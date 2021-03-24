import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Masset__factory } from '@mstable/protocol/types/generated';
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
import { TransactionManifest } from '../../../../web3/TransactionManifest';

import { Interfaces } from '../../../../types';

import { SendButton } from '../../../forms/SendButton';
import { AssetInput } from '../../../forms/AssetInput';
import { Arrow } from '../../../core/Arrow';
import { ErrorMessage } from '../../../core/ErrorMessage';
import { ExchangeRate } from '../../../core/ExchangeRate';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import { useEstimatedRedeemTokenOutput } from '../../../../hooks/useEstimatedRedeemTokenOutput';
import { BigDecimalInputValues } from '../../../../hooks/useBigDecimalInputs';

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

  const [outputAddress, handleSetAddress] = useState<string | undefined>(
    Object.keys(bAssets)[0],
  );
  const massetToken = useTokenSubscription(massetAddress);
  const outputToken = useTokenSubscription(outputAddress);

  const [
    massetAmount,
    massetFormValue,
    handleSetMassetFormValue,
  ] = useBigDecimalInput('0', massetState.token.decimals);

  const [slippageSimple, slippageFormValue, handleSetSlippage] = useSimpleInput(
    0.1,
    {
      min: 0.01,
      max: 99.99,
    },
  );

  const masset = useMemo(
    () => (signer ? Masset__factory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  const { estimatedOutputAmount, exchangeRate } = useEstimatedRedeemTokenOutput(
    masset,
    massetAmount,
    {
      [outputAddress as string]: {
        ...outputToken,
      },
    } as BigDecimalInputValues,
  );

  const addressOptions = useMemo(
    () => Object.keys(bAssets).map(address => ({ address })),
    [bAssets],
  );

  const error = useMemo(() => {
    if (!massetAmount?.simple) return 'Enter an amount';

    if (massetAmount) {
      if (
        massetToken?.balance.exact &&
        massetAmount.exact.gt(massetToken.balance.exact)
      ) {
        return 'Insufficient balance';
      }

      if (!outputAddress) {
        return 'Must select an asset to receive';
      }

      if (massetAmount.exact.eq(0)) {
        return 'Amount must be greater than zero';
      }
    }

    return estimatedOutputAmount.error;
  }, [estimatedOutputAmount.error, massetAmount, massetToken, outputAddress]);

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    massetAmount,
    estimatedOutputAmount?.value,
  );

  return (
    <Container>
      <AssetInput
        address={massetAddress}
        addressDisabled
        formValue={massetFormValue}
        handleSetAddress={handleSetAddress}
        handleSetAmount={handleSetMassetFormValue}
        handleSetMax={() => {
          handleSetMassetFormValue(massetToken?.balance.string);
        }}
      />
      <div>
        <Arrow />
        {exchangeRate && (
          <ExchangeRate
            inputToken={massetToken}
            outputToken={outputToken}
            exchangeRate={exchangeRate}
          />
        )}
      </div>
      <AssetInput
        address={outputAddress ?? addressOptions[0].address}
        addressOptions={addressOptions}
        amountDisabled
        formValue={estimatedOutputAmount.value?.string}
        handleSetAddress={handleSetAddress}
      />
      {penaltyBonus?.message && <ErrorMessage error={penaltyBonus?.message} />}
      <SendButton
        valid={!error}
        title={error ?? 'Redeem'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        handleSend={() => {
          if (
            masset &&
            walletAddress &&
            massetAmount &&
            outputAddress &&
            minOutputAmount
          ) {
            propose<Interfaces.Masset, 'redeem'>(
              new TransactionManifest(
                masset,
                'redeem',
                [
                  outputAddress,
                  massetAmount.exact,
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
