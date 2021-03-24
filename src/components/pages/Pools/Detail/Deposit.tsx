import React, { FC, useEffect, useMemo } from 'react';

import { usePropose } from '../../../../context/TransactionsProvider';
import { useWalletAddress } from '../../../../context/OnboardProvider';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { SendButton } from '../../../forms/SendButton';
import { AddressOption, Interfaces } from '../../../../types';
import {
  ManyToOneAssetExchange,
  MultiAssetExchangeProvider,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../../forms/MultiAssetExchange';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useEstimatedMintOutput } from '../../../../hooks/useEstimatedMintOutput';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import { useExchangeRateForFPInputs } from '../../../../hooks/useMassetExchangeRate';
import {
  useSelectedFeederPoolAssets,
  useSelectedFeederPoolContract,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';

const formId = 'DepositLP';

const DepositLogic: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const contract = useSelectedFeederPoolContract();
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const inputTokens = useMemo(
    () => [feederPool.masset.token, feederPool.fasset.token],
    [feederPool],
  );

  const [inputValues, , slippage] = useMultiAssetExchangeState();
  const [inputCallbacks, setOutputAmount] = useMultiAssetExchangeDispatch();

  const estimatedOutputAmount = useEstimatedMintOutput(contract, inputValues);
  const exchangeRate = useExchangeRateForFPInputs(
    feederPool.address,
    estimatedOutputAmount.value,
    inputValues,
  );

  const touched = useMemo(
    () => Object.values(inputValues).filter(v => v.touched),
    [inputValues],
  );

  const inputAmount = useMemo(() => {
    if (!Object.keys(inputValues).length || !touched.length) return;

    return touched
      .map(v => v.amount)
      .reduce((a, b) => (a as BigDecimal).add(b as BigDecimal));
  }, [inputValues, touched]);

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippage?.simple,
    inputAmount,
    estimatedOutputAmount.value,
  );

  const setMaxCallbacks = useMemo(
    () =>
      Object.fromEntries(
        inputTokens.map(({ address, balance }) => [
          address,
          () => {
            inputCallbacks[address].setAmount(balance);
          },
        ]),
      ),
    [inputTokens, inputCallbacks],
  );

  const outputOption = feederPool.token as AddressOption;

  const inputLabel = useMemo(
    () =>
      touched
        .map(
          v =>
            (inputTokens.find(t => t.address === v.address) as {
              symbol: string;
            }).symbol,
        )
        .join(', '),
    [inputTokens, touched],
  );

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount';

    const addressesApprovalNeeded = inputTokens.filter(t =>
      inputValues[t.address].amount?.exact.gt(
        t.allowances[feederPool.address]?.exact ?? 0,
      ),
    );

    if (addressesApprovalNeeded.length)
      return `Approval for ${addressesApprovalNeeded
        .map(t => t.symbol)
        .join(', ')} needed`;

    return estimatedOutputAmount.error;
  }, [
    estimatedOutputAmount,
    inputTokens,
    inputValues,
    feederPool.address,
    touched,
  ]);

  useEffect(() => {
    setOutputAmount(estimatedOutputAmount);
  }, [estimatedOutputAmount, setOutputAmount]);

  return (
    <ManyToOneAssetExchange
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputLabel={outputOption.symbol}
      outputAddress={outputOption.address}
      setMaxCallbacks={setMaxCallbacks}
      spender={feederPool.address}
      minOutputAmount={minOutputAmount}
      error={penaltyBonus?.message}
    >
      <SendButton
        title={error ?? 'Deposit'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!contract || !walletAddress || !minOutputAmount) return;

          // TODO use SaveWrapper to deposit straight to vault
          if (touched.length === 1) {
            const [{ address, amount }] = touched;
            return propose<Interfaces.FeederPool, 'mint'>(
              new TransactionManifest(
                contract,
                'mint',
                [
                  address,
                  (amount as BigDecimal).exact,
                  minOutputAmount.exact,
                  walletAddress,
                ],
                { past: 'Deposited', present: 'Depositing' },
                formId,
              ),
            );
          }

          const addresses = touched.map(v => v.address as string);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);

          return propose<Interfaces.FeederPool, 'mintMulti'>(
            new TransactionManifest(
              contract,
              'mintMulti',
              [addresses, amounts, minOutputAmount.exact, walletAddress],
              { past: 'Deposited', present: 'Depositing' },
              formId,
            ),
          );
        }}
      />
    </ManyToOneAssetExchange>
  );
};

export const Deposit: FC = () => {
  const assets = useSelectedFeederPoolAssets();

  return (
    <MultiAssetExchangeProvider assets={assets}>
      <DepositLogic />
    </MultiAssetExchangeProvider>
  );
};
