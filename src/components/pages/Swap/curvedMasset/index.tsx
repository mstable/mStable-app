import React, { FC, useMemo, useState } from 'react';
import { useThrottleFn } from 'react-use';
import styled from 'styled-components';

import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { CurvedMassetFactory } from '../../../../typechain/CurvedMassetFactory';
import { CurvedMasset } from '../../../../typechain/CurvedMasset';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';

import { BidirectionalAssetExchange } from '../../../forms/BidirectionalAssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { PageAction, PageHeader } from '../../PageHeader';

interface SwapOutput {
  value?: BigDecimal;
  fetching?: boolean;
  error?: string;
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const formId = 'swap';

const sanitizeError = (error: Error): string => {
  const message = error.message.replace('execution reverted: ', '');

  switch (message) {
    case 'Out of bounds':
      return 'This swap would exceed hard limits to maintain diversification. Try a different pair of assets or a smaller amount.';
    default:
      return message;
  }
};

export const Swap: FC = () => {
  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const feeRate = massetState?.feeRate;

  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const propose = usePropose();

  const [inputAmount, inputFormValue, setInputAmount] = useBigDecimalInput();
  const [swapOutput, setSwapOutput] = useState<SwapOutput>({});

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    // Select the token the user has the most of
    (() =>
      Object.values(massetState?.bAssets ?? {}).sort((a, b) =>
        a.balanceInMasset.exact.lt(b.balanceInMasset.exact) ? 1 : -1,
      )?.[0]?.address)(),
  );
  const [outputAddress, setOutputAddress] = useState<string | undefined>();

  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);
  const outputDecimals = outputToken?.decimals;

  const addressOptions = useMemo(
    () => Object.keys(massetState?.bAssets ?? {}).map(address => ({ address })),
    [massetState],
  );

  const curvedMasset = useMemo(
    () =>
      massetAddress && signer
        ? CurvedMassetFactory.connect(massetAddress, signer)
        : undefined,
    [massetAddress, signer],
  );

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _curvedMasset?: CurvedMasset,
      _inputAddress?: string,
      _inputAmount?: BigDecimal,
      _outputAddress?: string,
      _outputDecimals?: number,
    ) => {
      if (_curvedMasset) {
        if (
          _inputAddress &&
          _inputAmount &&
          _outputAddress &&
          _outputDecimals
        ) {
          setSwapOutput({ fetching: true });

          _curvedMasset
            .getSwapOutput(_inputAddress, _outputAddress, _inputAmount.exact)
            .then(_swapOutput => {
              setSwapOutput({
                value: new BigDecimal(_swapOutput, _outputDecimals),
              });
            })
            .catch(_error => {
              setSwapOutput({
                error: sanitizeError(_error),
              });
            });
        } else {
          setSwapOutput({});
        }
      }
    },
    1000,
    [curvedMasset, inputAddress, inputAmount, outputAddress, outputDecimals],
  );

  // Calculate:
  // - exchange rate
  // - fee rate
  // - swap fee
  // - min output amount
  const amounts = useMemo(() => {
    const exchangeRate =
      inputAmount && swapOutput.value
        ? { value: swapOutput.value.divPrecisely(inputAmount) }
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

  const approve = useMemo(
    () =>
      massetAddress && inputAddress
        ? {
            spender: massetAddress,
            address: inputAddress,
            amount: inputAmount,
          }
        : undefined,
    [inputAddress, inputAmount, massetAddress],
  );

  return (
    <div>
      <PageHeader
        action={PageAction.Swap}
        subtitle="Swap the underlying collateral of mBTC"
      />
      <Form>
        <BidirectionalAssetExchange
          addressOptions={addressOptions}
          error={error}
          exchangeRate={amounts.exchangeRate}
          fee={amounts.swapFee}
          handleSetInputAddress={setInputAddress}
          handleSetInputAmount={setInputAmount}
          handleSetInputMax={(): void => {
            setInputAmount(inputToken?.balance.string);
          }}
          handleSetOutputAddress={setOutputAddress}
          handleSetSlippage={setSlippage}
          inputAddress={inputAddress}
          inputFormValue={inputFormValue}
          outputAddress={outputAddress}
          outputFormValue={swapOutput.value?.string}
          slippage={slippageFormValue}
          minOutputAmount={amounts.minOutputAmount}
        />
        <SendButton
          valid={!error && !!swapOutput.value}
          title="Swap"
          approve={approve}
          handleSend={() => {
            if (
              curvedMasset &&
              walletAddress &&
              inputAmount &&
              amounts.minOutputAmount &&
              inputAddress &&
              outputAddress
            ) {
              propose<Interfaces.CurvedMasset, 'swap'>(
                new TransactionManifest(
                  curvedMasset,
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
      </Form>
    </div>
  );
};
