import React, { FC, useMemo, useState } from 'react';
import { useThrottleFn } from 'react-use';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { MbtcFactory } from '../../../../typechain/MbtcFactory';
import { Mbtc } from '../../../../typechain/Mbtc';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';

import { AssetSwap } from '../../../forms/AssetSwap';
import { SendButton } from '../../../forms/SendButton';
import { PageAction, PageHeader } from '../../PageHeader';
import { sanitizeMassetError } from '../../../../utils/strings';
import { MassetState } from '../../../../context/DataProvider/types';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { MassetPage } from '../../MassetPage';

interface SwapOutput {
  value?: BigDecimal;
  fetching?: boolean;
  error?: string;
}

const Info = styled(TransactionInfo)`
  margin-top: 0.5rem;
`;

const formId = 'swap';

const SwapLogic: FC = () => {
  const massetState = useSelectedMassetState() as MassetState;
  const { address: massetAddress, feeRate, bAssets } = massetState;

  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const propose = usePropose();

  const [swapOutput, setSwapOutput] = useState<SwapOutput>({});

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const assetsByBalance = useMemo(
    () =>
      Object.values(bAssets).sort((a, b) =>
        a.balanceInMasset.exact.lt(b.balanceInMasset.exact) ? 1 : -1,
      ),
    [bAssets],
  );

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    assetsByBalance?.[0]?.address,
  );
  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    assetsByBalance?.[1]?.address,
  );

  const outputToken = useTokenSubscription(outputAddress);
  const outputDecimals = outputToken?.decimals;
  const inputToken = useTokenSubscription(inputAddress);
  const inputDecimals = inputToken?.decimals;
  const inputRatio = inputAddress
    ? massetState.bAssets[inputAddress].ratio
    : undefined;
  const outputRatio = outputAddress
    ? massetState.bAssets[outputAddress].ratio
    : undefined;

  const [inputAmount, inputFormValue, setInputAmount] = useBigDecimalInput(
    '0',
    {
      decimals: inputDecimals,
    },
  );

  const addressOptions = useMemo(
    () => Object.keys(bAssets).map(address => ({ address })),
    [bAssets],
  );

  const masset = useMemo(
    () => (signer ? MbtcFactory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _masset?: Mbtc,
      _inputAddress?: string,
      _inputAmount?: BigDecimal,
      _outputAddress?: string,
      _outputDecimals?: number,
    ) => {
      if (_masset) {
        if (
          _inputAddress &&
          _inputAmount &&
          _outputAddress &&
          _outputDecimals
        ) {
          setSwapOutput({ fetching: true });
          _masset
            .getSwapOutput(_inputAddress, _outputAddress, _inputAmount.exact)
            .then(_swapOutput => {
              setSwapOutput({
                value: new BigDecimal(_swapOutput, _outputDecimals),
              });
            })
            .catch(_error => {
              setSwapOutput({
                error: sanitizeMassetError(_error),
              });
            });
        } else {
          setSwapOutput({});
        }
      }
    },
    1000,
    [masset, inputAddress, inputAmount, outputAddress, outputDecimals],
  );

  // Calculate:
  // - exchange rate
  // - fee rate
  // - swap fee
  // - min output amount
  const amounts = useMemo(() => {
    const scaledInputAmount =
      inputRatio && inputAmount && inputAmount.exact.gt(0)
        ? inputAmount.mulRatioTruncate(inputRatio).setDecimals(18)
        : undefined;
    const scaledOutputAmount =
      outputRatio && swapOutput.value && swapOutput.value.exact.gt(0)
        ? swapOutput.value.mulRatioTruncate(outputRatio).setDecimals(18)
        : undefined;

    const exchangeRate =
      scaledInputAmount && scaledOutputAmount
        ? { value: scaledOutputAmount.divPrecisely(scaledInputAmount) }
        : { fetching: swapOutput.fetching };

    const feeRateSimple = feeRate
      ? parseInt(feeRate.toString(), 10) / 1e18
      : undefined;

    const outputSimple = swapOutput.value?.simple;

    const swapFee =
      outputSimple && feeRateSimple
        ? outputSimple / (1 - feeRateSimple) - outputSimple
        : undefined;

    const minOutputAmount = BigDecimal.maybeParse(
      swapOutput.value && slippageSimple
        ? (swapOutput.value.simple * (1 - slippageSimple / 100)).toFixed(
            swapOutput.value.decimals,
          )
        : undefined,
      outputDecimals,
    );

    return {
      exchangeRate,
      minOutputAmount,
      swapFee: BigDecimal.maybeParse(swapFee?.toFixed(18)),
    };
  }, [
    feeRate,
    inputAmount,
    slippageSimple,
    swapOutput.fetching,
    swapOutput.value,
    outputDecimals,
    inputRatio,
    outputRatio,
  ]);

  // Calling `getSwapOutput` performs the complex validation;
  // this validation is trivial.
  const error = useMemo<string | undefined>(() => {
    if (swapOutput.error) return swapOutput.error;

    if (inputAmount) {
      if (!inputToken) {
        return 'Select asset to send';
      }

      if (!outputToken) {
        return 'Select asset to receive';
      }

      if (
        inputToken?.balance &&
        inputAmount.exact.gt(inputToken.balance.exact)
      ) {
        return 'Insufficient balance';
      }
    }
  }, [swapOutput.error, inputAmount, inputToken, outputToken]);

  const slippageWarning = useMemo<string | undefined>(() => {
    if (!amounts?.minOutputAmount || !inputAmount) return;
    const { minOutputAmount } = amounts;

    const amountMinBound = inputAmount.simple * 0.95;
    const amountMaxBound = inputAmount.simple * 1.05;

    if (
      minOutputAmount.simple < amountMinBound ||
      minOutputAmount.simple > amountMaxBound
    ) {
      return 'WARNING: High slippage. 1% slippage protection';
    }
  }, [amounts, inputAmount]);

  const approve = useMemo(
    () =>
      inputAddress
        ? {
            spender: massetAddress,
            address: inputAddress,
            amount: inputAmount,
          }
        : undefined,
    [inputAddress, inputAmount, massetAddress],
  );

  return (
    <AssetSwap
      inputAddressOptions={addressOptions}
      outputAddressOptions={addressOptions}
      error={error ?? slippageWarning}
      exchangeRate={amounts.exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputAmount}
      handleSetInputMax={(): void => {
        setInputAmount(inputToken?.balance.string);
      }}
      handleSetOutputAddress={setOutputAddress}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress ?? addressOptions[0].address}
      outputFormValue={swapOutput.value?.string}
    >
      <SendButton
        valid={!error && !!swapOutput.value}
        title="Swap"
        approve={approve}
        slippageWarning={!!slippageWarning}
        handleSend={() => {
          if (
            masset &&
            walletAddress &&
            inputAmount &&
            amounts.minOutputAmount &&
            inputAddress &&
            outputAddress
          ) {
            propose<Interfaces.Masset, 'swap'>(
              new TransactionManifest(
                masset,
                'swap',
                [
                  inputAddress,
                  outputAddress,
                  inputAmount.exact,
                  amounts.minOutputAmount.exact,
                  walletAddress,
                ],
                { present: 'Swapping', past: 'Swapped' },
                formId,
              ),
            );
          }
        }}
      />
      <Info
        fee={amounts.swapFee}
        minOutputAmount={amounts.minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
      />
    </AssetSwap>
  );
};

export const Swap: FC = () => {
  const massetState = useSelectedMassetState();
  return (
    <div>
      <PageHeader
        action={PageAction.Swap}
        subtitle="Swap the underlying collateral of mBTC"
      />
      {massetState ? (
        <MassetPage>
          <SwapLogic />
        </MassetPage>
      ) : (
        <Skeleton height={480} />
      )}
    </div>
  );
};
