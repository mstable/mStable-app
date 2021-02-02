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
import { sanitizeCurvedMassetError } from '../../../../utils/strings';

import { CurvedMassetFactory } from '../../../../typechain/CurvedMassetFactory';
import { CurvedMasset } from '../../../../typechain/CurvedMasset';
import { Interfaces } from '../../../../types';

import { SendButton } from '../../../forms/SendButton';
import { AssetInput } from '../../../forms/AssetInput';
import { SlippageInput } from '../../../forms/SlippageInput';
import { CollapseBox } from '../../../forms/CollapseBox';
import { ViewportWidth } from '../../../../theme';
import { Arrow } from '../../../core/Arrow';
import { ErrorMessage } from '../../../core/ErrorMessage';
import { Widget } from '../../../core/Widget';
import { ExchangeRate } from '../../../core/ExchangeRate';
import { InfoBox } from '../../../forms/InfoBox';

const formId = 'redeem';

const Exchange = styled.div`
  flex-direction: column;
  align-self: center;
  width: 100%;

  > div:first-child {
    margin-bottom: 1rem;
  }
`;

const Details = styled.div`
  flex-direction: column-reverse;
  width: 100%;
  align-self: center;

  > * {
    margin-top: 0.75rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  > :last-child {
    display: flex;
    flex-direction: column;

    > div {
      margin: 0.5rem 0;
    }

    > * > {
      display: flex;
      flex-direction: row;

      * {
        width: 100%;
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > * {
    display: flex;
    justify-content: space-between;
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

  const curvedMasset = useMemo(
    () =>
      signer ? CurvedMassetFactory.connect(massetAddress, signer) : undefined,
    [massetAddress, signer],
  );

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _curvedMasset: CurvedMasset | undefined,
      _inputAmount: BigDecimal | undefined,
      _outputAddress: string | undefined,
    ) => {
      if (_curvedMasset && _outputAddress && _inputAmount?.exact.gt(0)) {
        setBassetAmount({ fetching: true });
        _curvedMasset
          .getRedeemOutput(_outputAddress, _inputAmount.exact)
          .then(_bassetAmount => {
            setBassetAmount({ value: new BigDecimal(_bassetAmount) });
          })
          .catch((_error: Error): void => {
            setBassetAmount({
              error: sanitizeCurvedMassetError(_error),
            });
          });
      } else {
        setBassetAmount({});
      }
    },
    1000,
    [curvedMasset, inputAmount, outputAddress],
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

  return (
    <Container>
      <Exchange>
        <Widget title="Send">
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
        </Widget>
        <Arrow />
        <Widget
          title="Receive"
          headerContent={
            <ExchangeRate
              exchangeRate={exchangeRate}
              inputToken={massetToken}
              outputToken={outputToken}
            />
          }
        >
          <AssetInput
            address={outputAddress}
            addressOptions={addressOptions}
            amountDisabled
            formValue={bassetAmount.value?.string}
            handleSetAddress={handleSetAddress}
          />
        </Widget>
      </Exchange>
      <Details>
        <Column>
          {error && <ErrorMessage error={error} />}
          {minOutputAmount && outputToken && (
            <InfoBox>
              <p>Minimum {outputToken.symbol} received</p>
              <span>{minOutputAmount.string}</span>
            </InfoBox>
          )}
        </Column>
        <CollapseBox title="Advanced">
          <SlippageInput
            handleSetSlippage={handleSetSlippage}
            slippageFormValue={slippageFormValue}
          />
        </CollapseBox>
      </Details>
      <SendButton
        valid={!error}
        title="Redeem"
        handleSend={() => {
          if (
            curvedMasset &&
            walletAddress &&
            inputAmount &&
            outputAddress &&
            minOutputAmount
          ) {
            propose<Interfaces.CurvedMasset, 'redeem'>(
              new TransactionManifest(
                curvedMasset,
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
    </Container>
  );
};
