import React, { FC, useEffect, useMemo, useState } from 'react';

import { usePropose } from '../../../../context/TransactionsProvider';
import { useWalletAddress } from '../../../../context/OnboardProvider';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { SendButton } from '../../../forms/SendButton';
import { Interfaces, SubscribedToken } from '../../../../types';
import {
  ManyToOneAssetExchange,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../../forms/MultiAssetExchange';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useEstimatedMintOutput } from '../../../../hooks/useEstimatedMintOutput';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import { useExchangeRateForFPInputs } from '../../../../hooks/useMassetExchangeRate';
import {
  useSelectedFeederPoolContracts,
  useSelectedFeederPoolState,
  useFPVaultAddressOptions,
  useFPAssetAddressOptions,
} from '../FeederPoolProvider';
import { ADDRESSES } from '../../../../constants';

const formId = 'DepositLP';

export const MintExact: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const contracts = useSelectedFeederPoolContracts();

  const propose = usePropose();
  const walletAddress = useWalletAddress();

  const assetAddressOptions = useFPAssetAddressOptions(true);
  const vaultAddressOptions = useFPVaultAddressOptions();

  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    vaultAddressOptions[0].address,
  );

  const [inputValues, , slippage] = useMultiAssetExchangeState();
  const [inputCallbacks, setOutputAmount] = useMultiAssetExchangeDispatch();

  const touched = useMemo(
    () => Object.values(inputValues).filter(v => v.touched),
    [inputValues],
  );

  const contractAddress = touched.find(v => v.address === feederPool.address)
    ? feederPool.vault.address
    : ADDRESSES.FEEDER_WRAPPER;

  const estimatedOutputAmount = useEstimatedMintOutput(
    contracts?.feederPool,
    inputValues,
  );

  const exchangeRate = useExchangeRateForFPInputs(
    feederPool.address,
    estimatedOutputAmount.value,
    inputValues,
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
        assetAddressOptions.map(({ address, balance }) => [
          address,
          () => {
            inputCallbacks[address].setAmount(balance);
          },
        ]),
      ),
    [assetAddressOptions, inputCallbacks],
  );

  const inputLabel = useMemo(
    () =>
      touched
        .map(
          v =>
            (assetAddressOptions.find(t => t.address === v.address) as {
              symbol: string;
            }).symbol,
        )
        .join(', '),
    [assetAddressOptions, touched],
  );

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount';

    const addressesApprovalNeeded = assetAddressOptions.filter(t =>
      inputValues[t.address]?.amount?.exact.gt(
        (t as SubscribedToken).allowances?.[contractAddress]?.exact ?? 0,
      ),
    );

    if (addressesApprovalNeeded.length)
      return `Approval for ${addressesApprovalNeeded
        .map(t => t.symbol)
        .join(', ')} needed`;

    return estimatedOutputAmount.error;
  }, [
    assetAddressOptions,
    estimatedOutputAmount,
    inputValues,
    contractAddress,
    touched,
  ]);

  useEffect(() => {
    setOutputAmount(estimatedOutputAmount);
  }, [estimatedOutputAmount, setOutputAmount]);

  return (
    <ManyToOneAssetExchange
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputAddressOptions={vaultAddressOptions}
      outputLabel={
        vaultAddressOptions.find(v => v.address === outputAddress)?.label
      }
      setOutputAddress={setOutputAddress}
      outputAddress={outputAddress}
      setMaxCallbacks={setMaxCallbacks}
      spender={contractAddress}
      minOutputAmount={minOutputAmount}
      error={penaltyBonus?.message}
    >
      <SendButton
        title={error ?? 'Deposit'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!contracts || !walletAddress || !minOutputAmount) return;

          if (contractAddress === ADDRESSES.FEEDER_WRAPPER) {
            return;
          }

          if (touched.length === 1) {
            const [{ address, amount }] = touched;
            return propose<Interfaces.FeederPool, 'mint'>(
              new TransactionManifest(
                contracts.feederPool,
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
              contracts.feederPool,
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
