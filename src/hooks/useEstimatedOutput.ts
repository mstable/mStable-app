import { useMemo, useState } from 'react';

import {
  FeederPool,
  FeederPool__factory,
  Masset,
  Masset__factory,
} from '@mstable/protocol/types/generated';
import { useThrottleFn } from 'react-use';
import type { BigDecimalInputValue } from './useBigDecimalInputs';
import { BigDecimal } from '../web3/BigDecimal';
import { FetchState, useFetchState } from './useFetchState';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { MassetState } from '../context/DataProvider/types';
import { useSigner } from '../context/OnboardProvider';
import { sanitizeMassetError } from '../utils/strings';

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

/**
 * This hook is designed to route to correct hook based on input/output
 */
export const useEstimatedOutput = (
  inputValue?: BigDecimalInputValue,
  outputValue?: BigDecimalInputValue,
): Output => {
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

  const feederAddress = Object.keys(fAssets)
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

    // use feeder to do swap
    if (feederAddress && feederAddress !== massetAddress) {
      return FeederPool__factory.connect(feederAddress, signer);
    }
    return Masset__factory.connect(massetAddress, signer);
  }, [feederAddress, massetAddress, signer]);

  const isFeederPool = contract?.address === feederAddress;

  // Routes
  // input ===  basset, output === masset => MINT     1 basset, 1 masset
  // input ===  masset, output === basset => REDEEM   1 masset, 1 basset
  // input ===  fasset, output === basset => SWAP     1 fasset
  // input ===  fasset, output === masset => SWAP     1 fasset
  // input ===  basset, output === basset => SWAP     2 bassets

  useThrottleFn(
    (
      _contract?: Contract,
      _inputValue?: BigDecimalInputValue,
      _outputValue?: BigDecimalInputValue,
      _isFeederPool?: boolean,
    ) => {
      if (!_inputValue || !_outputValue) return;
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

      if ((isMassetMint || isLPMint) && inputAmount?.simple) {
        setAction(Action.MINT);
        // TODO: Fix flicker
        // setEstimatedOutputAmount.fetching();
        return _contract
          .getMintOutput(inputAddress, (inputAmount as BigDecimal).exact)
          .then(_amount => {
            setEstimatedOutputAmount.value(new BigDecimal(_amount));
          });
      }

      if (
        (_isFeederPool || isBassetSwap) &&
        !isLPRedeem &&
        inputAmount?.simple
      ) {
        setAction(Action.SWAP);
        // setEstimatedOutputAmount.fetching();
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

      if ((!_isFeederPool || isLPRedeem) && inputAmount?.simple) {
        setAction(Action.REDEEM);
        // setEstimatedOutputAmount.fetching();
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
    [contract, inputValue, outputValue, isFeederPool],
  );

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (estimatedOutputAmount.fetching) return { fetching: true };
    if (!inputValue?.amount || !outputValue) return {};

    const { amount: inputAmount, address: inputAddress } = inputValue;
    const { address: outputAddress } = outputValue;

    if (!estimatedOutputAmount.value) return { fetching: true };

    if (!estimatedOutputAmount.value.exact.gt(0)) {
      return { error: 'Output amount must be greater than zero' };
    }

    // Scale asset via ratio
    const scaleAsset = (address: string, amount: BigDecimal): BigDecimal => {
      if (!amount?.simple) return BigDecimal.ZERO;

      // mAsset amount is not scaled
      if (address === massetAddress) return amount;

      // Scale w/ ratio
      const ratio =
        bAssets[address]?.ratio ?? fAssets[feederAddress as string]?.ratio;

      // shouldn't hit but better to have this can crash
      if (!ratio) return amount;

      return amount.mulRatioTruncate(ratio).setDecimals(18);
    };

    const scaledInput = scaleAsset(inputAddress, inputAmount);
    const scaledOutput = scaleAsset(
      outputAddress,
      estimatedOutputAmount?.value,
    );

    const value = scaledInput.divPrecisely(scaledOutput);
    return { value };
  }, [
    bAssets,
    estimatedOutputAmount,
    fAssets,
    feederAddress,
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
