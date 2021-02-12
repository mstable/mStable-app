import React, { FC, useMemo, useState } from 'react';
import { useThrottleFn } from 'react-use';
import styled from 'styled-components';

import { usePropose } from '../../../../context/TransactionsProvider';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { sanitizeMassetError } from '../../../../utils/strings';

import { Mbtc } from '../../../../typechain/Mbtc';
import { MbtcFactory } from '../../../../typechain/MbtcFactory';
import { Interfaces } from '../../../../types';

import { SendButton } from '../../../forms/SendButton';
import { AssetInput } from '../../../forms/AssetInput';
import { Arrow } from '../../../core/Arrow';
import { ErrorMessage } from '../../../core/ErrorMessage';
import { ExchangeRate } from '../../../core/ExchangeRate';
import { TransactionInfo } from '../../../core/TransactionInfo';

const formId = 'redeem';

const Container = styled.div`
  > * {
    margin: 0.5rem 0;
    &:first-child {
      margin-top: 0;
    }
  }
`;

export const RedeemMasset: FC = () => {
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const signer = useSigner();
  const massetState = useSelectedMassetState() as MassetState;
  const { address: massetAddress, bAssets } = massetState;

  const [outputAddress, handleSetAddress] = useState<string | undefined>();

  const [bassetAmount, setBassetAmount] = useState<{
    fetching?: boolean;
    error?: string;
    value?: BigDecimal;
  }>({});

  const [
    inputAmount,
    inputFormValue,
    handleSetInputFormValue,
    setInputAmount,
  ] = useBigDecimalInput();

  const [slippageSimple, slippageFormValue, handleSetSlippage] = useSimpleInput(
    0.1,
    {
      min: 0.01,
      max: 99.99,
    },
  );

  const massetToken = useTokenSubscription(massetAddress);
  const outputToken = useTokenSubscription(outputAddress);

  const masset = useMemo(
    () => (signer ? MbtcFactory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _masset: Mbtc | undefined,
      _inputAmount: BigDecimal | undefined,
      _outputAddress: string | undefined,
    ) => {
      if (_masset && _outputAddress && _inputAmount?.exact.gt(0)) {
        setBassetAmount({ fetching: true });
        _masset
          .getRedeemOutput(_outputAddress, _inputAmount.exact)
          .then(_bassetAmount => {
            setBassetAmount({ value: new BigDecimal(_bassetAmount) });
          })
          .catch((_error: Error): void => {
            setBassetAmount({
              error: sanitizeMassetError(_error),
            });
          });
      } else {
        setBassetAmount({});
      }
    },
    1000,
    [masset, inputAmount, outputAddress],
  );

  const { exchangeRate, minOutputAmount } = useMemo(() => {
    const _exchangeRate: { value?: BigDecimal; fetching?: boolean } =
      inputAmount && bassetAmount.value && inputAmount.exact.gt(0)
        ? { value: bassetAmount.value.divPrecisely(inputAmount) }
        : { fetching: bassetAmount.fetching };

    const _minOutputAmount = BigDecimal.maybeParse(
      bassetAmount.value && slippageSimple
        ? (bassetAmount.value.simple * (1 - slippageSimple / 100)).toFixed(
            bassetAmount.value.decimals,
          )
        : undefined,
    );

    return {
      exchangeRate: _exchangeRate,
      minOutputAmount: _minOutputAmount,
    };
  }, [inputAmount, bassetAmount.fetching, bassetAmount.value, slippageSimple]);

  const addressOptions = useMemo(
    () => Object.keys(bAssets).map(address => ({ address })),
    [bAssets],
  );

  const error = useMemo(() => {
    if (inputAmount) {
      if (
        massetToken?.balance.exact &&
        inputAmount.exact.gt(massetToken.balance.exact)
      ) {
        return 'Insufficient balance';
      }

      if (!outputAddress) {
        return 'Must select an asset to receive';
      }

      if (inputAmount.exact.eq(0)) {
        return 'Amount must be greater than zero';
      }
    }

    return bassetAmount.error;
  }, [bassetAmount.error, inputAmount, massetToken, outputAddress]);

  const slippageWarning = useMemo<string | undefined>(() => {
    if (!minOutputAmount || !inputAmount) return;

    const amountMinBound = inputAmount.simple * 0.95;
    const amountMaxBound = inputAmount.simple * 1.05;

    if (
      minOutputAmount.simple < amountMinBound ||
      minOutputAmount.simple > amountMaxBound
    ) {
      return 'WARNING: High slippage';
    }
  }, [minOutputAmount, inputAmount]);

  return (
    <Container>
      <AssetInput
        address={massetAddress}
        addressDisabled
        formValue={inputFormValue}
        handleSetAddress={handleSetAddress}
        handleSetAmount={handleSetInputFormValue}
        handleSetMax={() => {
          setInputAmount(massetToken?.balance);
        }}
      />
      <div>
        <Arrow />
        <ExchangeRate
          inputToken={massetToken}
          outputToken={outputToken}
          exchangeRate={exchangeRate}
        />
      </div>
      <AssetInput
        address={outputAddress ?? addressOptions[0].address}
        addressOptions={addressOptions}
        amountDisabled
        formValue={bassetAmount.value?.string}
        handleSetAddress={handleSetAddress}
        disabled
      />
      {(error || slippageWarning) && (
        <ErrorMessage error={error ?? slippageWarning ?? ''} />
      )}
      <SendButton
        valid={!error}
        title={slippageWarning ? 'Redeem Anyway' : 'Redeem'}
        slippageWarning={!!slippageWarning}
        handleSend={() => {
          if (
            masset &&
            walletAddress &&
            inputAmount &&
            outputAddress &&
            minOutputAmount
          ) {
            propose<Interfaces.Masset, 'redeem'>(
              new TransactionManifest(
                masset,
                'redeem',
                [
                  outputAddress,
                  inputAmount.exact,
                  minOutputAmount.exact,
                  walletAddress,
                ],
                { past: 'Redeemed', present: 'Redeeming' },
                formId,
              ),
            );
          }
        }}
      />
      <TransactionInfo
        minOutputAmount={minOutputAmount}
        onSetSlippage={handleSetSlippage}
        slippageFormValue={slippageFormValue}
      />
    </Container>
  );
};
