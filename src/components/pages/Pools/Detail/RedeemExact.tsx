import type { FC } from 'react';
import React, { useEffect, useMemo } from 'react';

import { usePropose } from '../../../../context/TransactionsProvider';
import { useWalletAddress } from '../../../../context/OnboardProvider';
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
import { useExchangeRateForFPInputs } from '../../../../hooks/useMassetExchangeRate';
import {
  useSelectedFeederPoolContract,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';

const formId = 'RedeemExactLP';

export const RedeemExact: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const contract = useSelectedFeederPoolContract();
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const outputTokens = useMemo(
    () => [feederPool.masset.token, feederPool.fasset.token],
    [feederPool],
  );

  const [outputValues, , slippage] = useMultiAssetExchangeState();
  const [, setOutputAmount] = useMultiAssetExchangeDispatch();
  const estimatedOutputAmount = useEstimatedRedeemOutput(
    contract,
    outputValues,
  );
  const exchangeRate = useExchangeRateForFPInputs(
    feederPool.address,
    estimatedOutputAmount,
    outputValues,
  );

  const touched = useMemo(
    () => Object.values(outputValues).filter(v => v.touched),
    [outputValues],
  );

  const inputAmount = useMemo(() => {
    if (!Object.keys(outputValues).length || !touched.length) return;

    return touched
      .map(v => v.amount)
      .reduce((a, b) => (a as BigDecimal).add(b as BigDecimal));
  }, [outputValues, touched]);

  const { maxOutputAmount, penaltyBonus } = useMaximumOutput(
    slippage?.simple,
    inputAmount,
    estimatedOutputAmount.value,
  );

  const outputOption = feederPool.token as AddressOption;

  const outputLabel = useMemo(
    () =>
      touched
        .map(
          v =>
            (outputTokens.find(t => t.address === v.address) as {
              symbol: string;
            }).symbol,
        )
        .join(', '),
    [touched, outputTokens],
  );

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount';

    if (
      estimatedOutputAmount.value?.exact.gt(feederPool.token.balance.exact ?? 0)
    ) {
      return 'Insufficient balance';
    }

    if (estimatedOutputAmount.fetching) return 'Validating…';

    return estimatedOutputAmount.error;
  }, [estimatedOutputAmount, feederPool.token.balance, touched]);

  useEffect(() => {
    setOutputAmount(estimatedOutputAmount);
  }, [estimatedOutputAmount, setOutputAmount]);

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
          if (!contract || !walletAddress || !maxOutputAmount) return;

          const addresses = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);

          return propose<Interfaces.FeederPool, 'redeemExactBassets'>(
            new TransactionManifest(
              contract,
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
