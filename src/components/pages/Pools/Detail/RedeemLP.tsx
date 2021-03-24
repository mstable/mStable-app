import React, { FC, useMemo, useState } from 'react';

import { FeederPool__factory } from '@mstable/protocol/types/generated';
import { usePropose } from '../../../../context/TransactionsProvider';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import {
  useTokens,
  useTokenSubscription,
} from '../../../../context/TokensProvider';
import { SendButton } from '../../../forms/SendButton';
import { AssetExchange } from '../../../forms/AssetExchange';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';
import { BigDecimalInputValues } from '../../../../hooks/useBigDecimalInputs';
import { useEstimatedRedeemTokenOutput } from '../../../../hooks/useEstimatedRedeemTokenOutput';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useMinimumOutput } from '../../../../hooks/useOutput';

const formId = 'RedeemLP';

interface Props {
  poolAddress: string;
  tokens: string[];
}

export const RedeemLP: FC<Props> = ({ poolAddress, tokens }) => {
  const propose = usePropose();
  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const token = useTokenSubscription(poolAddress);
  const outputTokens = useTokens(tokens);

  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    tokens[0],
  );

  const feederPool = useMemo(
    () =>
      poolAddress && signer
        ? FeederPool__factory.connect(poolAddress, signer)
        : undefined,
    [poolAddress, signer],
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const outputToken = useMemo(
    () => outputTokens.find(t => t.address === outputAddress),
    [outputAddress, outputTokens],
  );

  const { estimatedOutputAmount, exchangeRate } = useEstimatedRedeemTokenOutput(
    feederPool,
    inputAmount,
    {
      [outputAddress as string]: {
        ...outputTokens.find(t => t.address === outputAddress),
      },
    } as BigDecimalInputValues,
  );

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    inputAmount,
    estimatedOutputAmount?.value,
  );

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount';

    if (
      !estimatedOutputAmount?.value?.simple &&
      !estimatedOutputAmount?.fetching
    )
      return `Not enough ${outputToken?.symbol} in basket`;

    if (token?.balance.exact && inputAmount.exact.gt(token.balance.exact)) {
      return 'Insufficient balance';
    }

    if (!outputToken) {
      return 'Must select an asset to receive';
    }

    if (inputAmount.exact.eq(0)) {
      return 'Amount must be greater than zero';
    }

    return estimatedOutputAmount?.error;
  }, [inputAmount, token, estimatedOutputAmount, outputToken]);

  return (
    <AssetExchange
      inputAddressOptions={token ? [token] : []}
      outputAddressOptions={outputTokens}
      error={penaltyBonus?.message}
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(token?.balance.string);
      }}
      handleSetOutputAddress={setOutputAddress}
      inputAddress={poolAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      outputFormValue={estimatedOutputAmount?.value?.string}
    >
      <SendButton
        title={error ?? 'Redeem'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!signer || !walletAddress || !feederPool) return;
          if (!outputAddress || !inputAmount || !minOutputAmount) return;

          return propose<Interfaces.FeederPool, 'redeem'>(
            new TransactionManifest(
              feederPool,
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
        }}
      />
      <TransactionInfo
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
      />
    </AssetExchange>
  );
};
