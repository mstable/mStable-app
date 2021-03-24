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
  ManyToOneAssetExchange,
  MultiAssetExchangeProvider,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../../forms/MultiAssetExchange';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useEstimatedMintOutput } from '../../../../hooks/useEstimatedMintOutput';
import { useMinimumOutput } from '../../../../hooks/useOutput';

interface Props {
  poolAddress: string;
  tokens: string[];
}

const formId = 'DepositLP';

const DepositLogic: FC<Props> = ({ poolAddress, tokens }) => {
  const propose = usePropose();
  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const token = useTokenSubscription(poolAddress);
  const inputTokens = useTokens(tokens);

  const feederPool = useMemo(
    () =>
      poolAddress && signer
        ? FeederPool__factory.connect(poolAddress, signer)
        : undefined,
    [poolAddress, signer],
  );

  const [inputValues, , slippage] = useMultiAssetExchangeState();
  const [inputCallbacks, setOutputAmount] = useMultiAssetExchangeDispatch();
  const { estimatedOutputAmount, exchangeRate } = useEstimatedMintOutput(
    feederPool,
    inputValues,
  );

  useEffect(() => {
    setOutputAmount(estimatedOutputAmount);
  }, [estimatedOutputAmount, setOutputAmount]);

  const touched = useMemo(
    () => Object.values(inputValues).filter(v => v.touched),
    [inputValues],
  );

  const inputAmount = useMemo(() => {
    if (!Object.keys(inputValues).length) return;
    if (!touched.length) return;

    const totalAmount = touched
      .map(v => v.amount)
      .reduce((a, b) => (b ? a?.add(b) : a));
    return totalAmount;
  }, [inputValues, touched]);

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippage?.simple,
    inputAmount,
    estimatedOutputAmount?.value,
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

  const outputOption: AddressOption | undefined =
    (token && {
      ...token,
      address: token.address,
    }) ||
    undefined;

  const inputLabel = useMemo(
    () =>
      Object.values(inputValues)
        .filter(v => v.touched)
        .map(v => inputTokens.find(t => t.address === v.address)?.symbol)
        .join(', '),
    [inputTokens, inputValues],
  );

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount';

    const addressesApprovalNeeded = inputTokens.filter(t =>
      inputValues[t.address].amount?.exact.gt(
        t.allowances[poolAddress]?.exact ?? 0,
      ),
    );

    if (addressesApprovalNeeded.length)
      return `Approval for ${addressesApprovalNeeded
        .map(t => t.symbol)
        .join(', ')} needed`;

    return estimatedOutputAmount?.error;
  }, [estimatedOutputAmount, inputTokens, inputValues, poolAddress, touched]);

  return (
    <ManyToOneAssetExchange
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputLabel={outputOption?.symbol}
      outputAddress={outputOption?.address as string}
      setMaxCallbacks={setMaxCallbacks}
      spender={poolAddress}
      minOutputAmount={minOutputAmount}
      error={penaltyBonus?.message}
    >
      <SendButton
        title={error ?? 'Deposit'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!signer || !walletAddress || !minOutputAmount) return;

          // TODO use SaveWrapper to deposit straight to vault
          if (touched.length === 1) {
            const [{ address, amount }] = touched;
            return propose<Interfaces.FeederPool, 'mint'>(
              new TransactionManifest(
                FeederPool__factory.connect(poolAddress, signer),
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
              FeederPool__factory.connect(poolAddress, signer),
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

export const Deposit: FC<Props> = ({ poolAddress, tokens }) => {
  const inputTokens = useTokens(tokens);
  const inputAssets = useMemo(() => {
    if (!inputTokens.length) return;
    return inputTokens
      ?.map(t => ({
        [t.address]: {
          decimals: t.decimals,
        },
      }))
      ?.reduce((a, b) => ({ ...a, ...b }));
  }, [inputTokens]);

  return inputAssets ? (
    <MultiAssetExchangeProvider assets={inputAssets}>
      <DepositLogic poolAddress={poolAddress} tokens={tokens} />
    </MultiAssetExchangeProvider>
  ) : null;
};
