import React, { FC, useEffect, useMemo } from 'react';

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
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { SendButton } from '../../../forms/SendButton';
import { AddressOption, Interfaces } from '../../../../types';
import {
  OneToManyAssetExchange,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../../forms/MultiAssetExchange';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useEstimatedRedeemOutput } from '../../../../hooks/useEstimatedRedeemOutput';
import { useMaximumOutput } from '../../../../hooks/useOutput';

const formId = 'RedeemExactLP';

interface Props {
  poolAddress: string;
  tokens: string[];
}

export const RedeemExact: FC<Props> = ({ poolAddress, tokens }) => {
  const propose = usePropose();
  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const token = useTokenSubscription(poolAddress);
  const outputTokens = useTokens(tokens);

  const feederPool = useMemo(
    () =>
      poolAddress && signer
        ? FeederPool__factory.connect(poolAddress, signer)
        : undefined,
    [poolAddress, signer],
  );

  const [outputValues, , slippage] = useMultiAssetExchangeState();
  const [, setOutputAmount] = useMultiAssetExchangeDispatch();
  const { estimatedOutputAmount, exchangeRate } = useEstimatedRedeemOutput(
    feederPool,
    outputValues,
  );

  useEffect(() => {
    setOutputAmount(estimatedOutputAmount);
  }, [estimatedOutputAmount, setOutputAmount]);

  const touched = useMemo(
    () => Object.values(outputValues).filter(v => v.touched),
    [outputValues],
  );

  const inputAmount = useMemo(() => {
    if (!Object.keys(outputValues).length) return;
    if (!touched.length) return;

    const totalAmount = touched
      .map(v => v.amount)
      .reduce((a, b) => (b ? a?.add(b) : a));
    return totalAmount;
  }, [outputValues, touched]);

  const { maxOutputAmount, penaltyBonus } = useMaximumOutput(
    slippage?.simple,
    inputAmount,
    estimatedOutputAmount?.value,
  );

  const outputOption: AddressOption | undefined =
    (token && {
      ...token,
      address: token.address,
    }) ||
    undefined;

  const outputLabel = useMemo(
    () =>
      touched
        .map(v => outputTokens.find(t => t.address === v.address)?.symbol)
        .join(', '),
    [touched, outputTokens],
  );

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount';

    if (estimatedOutputAmount?.value?.exact.gt(token?.balance.exact ?? 0)) {
      return 'Insufficient balance';
    }

    return estimatedOutputAmount?.error;
  }, [estimatedOutputAmount, token, touched]);

  return (
    <OneToManyAssetExchange
      exchangeRate={exchangeRate}
      inputAddress={outputOption?.address as string}
      inputLabel={outputOption?.symbol}
      outputLabel={outputLabel}
      maxOutputAmount={maxOutputAmount}
      error={penaltyBonus?.message}
    >
      <SendButton
        title={error ?? 'Redeem'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!signer || !walletAddress || !maxOutputAmount) return;

          const addresses = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);

          return propose<Interfaces.FeederPool, 'redeemExactBassets'>(
            new TransactionManifest(
              FeederPool__factory.connect(poolAddress, signer),
              'redeemExactBassets',
              [addresses, amounts, maxOutputAmount.exact, walletAddress],
              { past: 'Redeemed', present: 'Redeeming' },
              formId,
            ),
          );
        }}
      />
    </OneToManyAssetExchange>
  );
};
