import { useMemo, useState } from 'react';

import {
  FeederPool,
  FeederPool__factory,
  Masset,
  Masset__factory,
} from '@mstable/protocol/types/generated';
import { usePrevious, useThrottleFn } from 'react-use';

import { BigDecimal } from '../web3/BigDecimal';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { MassetState } from '../context/DataProvider/types';
import { useSigner } from '../context/OnboardProvider';
import { sanitizeMassetError } from '../utils/strings';

import type { BigDecimalInputValue } from './useBigDecimalInputs';
import { FetchState, useFetchState } from './useFetchState';

type Contract = Masset | FeederPool;

interface Output {
  estimatedOutputAmount: FetchState<BigDecimal>;
  exchangeRate: FetchState<BigDecimal>;
  feeRate: FetchState<BigDecimal>;
}

enum Action {
  SWAP,
  REDEEM,
  MINT,
}

const inputValuesAreEqual = (
  a?: BigDecimalInputValue,
  b?: BigDecimalInputValue,
): boolean =>
  !!(
    (!a && !b) ||
    (a &&
      b &&
      a.amount?.exact.toString() === b.amount?.exact.toString() &&
      a.address === b.address)
  );

/**
 * This hook is designed to route to correct hook based on input/output
 */
export const useEstimatedOutput = (
  inputValue?: BigDecimalInputValue,
  outputValue?: BigDecimalInputValue,
): Output => {
  const inputValuePrev = usePrevious(inputValue);
  const outputValuePrev = usePrevious(outputValue);

  const [
    estimatedOutputAmount,
    setEstimatedOutputAmount,
  ] = useFetchState<BigDecimal>();

  const [action, setAction] = useState<Action | undefined>();

  const signer = useSigner();
  const massetState = useSelectedMassetState() as MassetState;
  const {
    address: massetAddress,
    fAssets,
    bAssets,
    feeRate: swapFeeRate,
  } = massetState;

  const poolAddress = Object.keys(fAssets)
    .filter(address => fAssets[address].address !== massetAddress)
    .find(
      address =>
        fAssets[address].address === inputValue?.address ||
        fAssets[address].address === outputValue?.address ||
        address === inputValue?.address ||
        address === outputValue?.address,
    );

  const contract: Contract | undefined = useMemo(() => {
    if (!signer) return;

    // use feeder pool to do swap
    if (poolAddress && poolAddress !== massetAddress) {
      return FeederPool__factory.connect(poolAddress, signer);
    }
    return Masset__factory.connect(massetAddress, signer);
  }, [poolAddress, massetAddress, signer]);

  const isFeederPool = contract?.address === poolAddress;

  /*
   * |------------------------------------------------------|
   * | ROUTES                                               |
   * | -----------------------------------------------------|
   * | Input  | Output | Function      | Tokens             |
   * | -----------------------------------------------------|
   * | basset | masset | masset mint   | 1 basset, 1 masset |
   * | masset | basset | masset redeem | 1 masset, 1 basset |
   * | basset | basset | masset swap   | 2 bassets          |
   * | fasset | basset | fpool swap    | 1 fasset           |
   * | fasset | masset | fpool swap    | 1 fasset           |
   * |------------------------------------------------------|
   */

  useThrottleFn(
    (
      _contract?: Contract,
      _inputValue?: BigDecimalInputValue,
      _inputValuePrev?: BigDecimalInputValue,
      _outputValue?: BigDecimalInputValue,
      _outputValuePrev?: BigDecimalInputValue,
      _isFeederPool?: boolean,
    ) => {
      if (!_inputValue || !_outputValue) return;

      // This is symptom-fighting; new BigDecimals are being created somewhere,
      // so strict equality always comes up false
      const inputEq = inputValuesAreEqual(_inputValue, _inputValuePrev);
      const outputEq = inputValuesAreEqual(_outputValue, _outputValuePrev);
      if (inputEq && outputEq) return;

      if (!_contract) return setEstimatedOutputAmount.fetching();

      const { address: inputAddress, amount: inputAmount } = _inputValue;
      const { address: outputAddress, decimals: outputDecimals } = _outputValue;

      const isLPRedeem = _contract.address === inputAddress;
      const isLPMint = _contract.address === outputAddress;

      const isMassetMint =
        bAssets[inputAddress]?.address && outputAddress === massetAddress;

      const isBassetSwap =
        [inputAddress, outputAddress].filter(
          address => bAssets[address]?.address,
        ).length === 2;

      if (!inputAmount?.exact.gt(0)) return;

      if (isMassetMint || isLPMint) {
        setAction(Action.MINT);
        setEstimatedOutputAmount.fetching();
        return _contract
          .getMintOutput(inputAddress, (inputAmount as BigDecimal).exact)
          .then(_amount => {
            setEstimatedOutputAmount.value(new BigDecimal(_amount));
          })
          .catch(_error => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }

      if ((_isFeederPool || isBassetSwap) && !isLPRedeem) {
        setAction(Action.SWAP);
        setEstimatedOutputAmount.fetching();
        return _contract
          .getSwapOutput(inputAddress, outputAddress, inputAmount.exact)
          .then(_swapOutput => {
            setEstimatedOutputAmount.value(
              new BigDecimal(_swapOutput, outputDecimals),
            );
          })
          .catch(_error => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }

      if (!_isFeederPool || isLPRedeem) {
        setAction(Action.REDEEM);
        setEstimatedOutputAmount.fetching();
        return _contract
          .getRedeemOutput(outputAddress, inputAmount.exact)
          .then(_amount => {
            setEstimatedOutputAmount.value(
              new BigDecimal(_amount, outputDecimals),
            );
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }

      setEstimatedOutputAmount.value();
    },
    2500,
    [
      contract,
      inputValue,
      inputValuePrev,
      outputValue,
      outputValuePrev,
      isFeederPool,
    ],
  );

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (estimatedOutputAmount.fetching) return { fetching: true };
    if (!inputValue?.amount || !outputValue) return {};

    const { amount: inputAmount, address: inputAddress } = inputValue;
    const { address: outputAddress } = outputValue;

    if (!estimatedOutputAmount.value) return { fetching: true };

    if (!estimatedOutputAmount.value.exact.gt(0) || !inputAmount.exact.gt(0)) {
      return { error: 'Amount must be greater than zero' };
    }

    // Scale asset via ratio
    const scaleAsset = (address: string, amount: BigDecimal): BigDecimal => {
      if (!amount?.simple) return BigDecimal.ZERO;

      // Only bAsset/fAsset amounts are scaled
      if (address === massetAddress || address === poolAddress) return amount;

      // Scale w/ ratio
      const ratio =
        bAssets[address]?.ratio ?? (poolAddress && fAssets[poolAddress].ratio);

      // shouldn't hit but better to have this can crash
      if (!ratio) return amount;

      return amount.mulRatioTruncate(ratio).setDecimals(18);
    };

    const scaledInput = scaleAsset(inputAddress, inputAmount);
    const scaledOutput = scaleAsset(outputAddress, estimatedOutputAmount.value);

    const value = scaledInput.divPrecisely(scaledOutput);
    return { value };
  }, [
    bAssets,
    estimatedOutputAmount,
    fAssets,
    poolAddress,
    inputValue,
    massetAddress,
    outputValue,
  ]);

  const feeRate = useMemo<FetchState<BigDecimal>>(() => {
    // if not swap, return
    if (action !== Action.SWAP) return {};
    if (estimatedOutputAmount.fetching) return { fetching: true };

    const feeRateSimple = swapFeeRate
      ? parseInt(swapFeeRate.toString(), 10) / 1e18
      : undefined;

    const outputSimple = estimatedOutputAmount.value?.simple;

    const swapFee =
      outputSimple && feeRateSimple
        ? outputSimple / (1 - feeRateSimple) - outputSimple
        : undefined;

    const value = BigDecimal.maybeParse(swapFee?.toFixed(18));

    if (value) {
      return { value };
    }
    return {};
  }, [estimatedOutputAmount, swapFeeRate, action]);

  return { estimatedOutputAmount, exchangeRate, feeRate };
};
