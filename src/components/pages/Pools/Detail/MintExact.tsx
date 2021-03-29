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
    if (!touched.length) return;

    const massetAmount = touched.find(
      ({ address }) => address === feederPool.masset.address,
    )?.amount;

    const fassetAmount = touched.find(
      ({ address }) => address === feederPool.fasset.address,
    )?.amount;

    if (fassetAmount && massetAmount) {
      return fassetAmount
        .mulRatioTruncate(feederPool.fasset.ratio)
        .add(massetAmount)
        .setDecimals(18);
    }

    return massetAmount ?? fassetAmount;
  }, [feederPool, touched]);

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

  const isMintingAndStakingLP = outputAddress === feederPool.vault.address;

  const contractAddress = isMintingAndStakingLP
    ? contracts?.feederWrapper.address
    : contracts?.feederPool.address;

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount';
    if (!outputAddress) return 'Select a token';

    const addressesApprovalNeeded = assetAddressOptions.filter(t =>
      inputValues[t.address]?.amount?.exact.gt(
        (t as SubscribedToken).allowances?.[contractAddress ?? '']?.exact ?? 0,
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
    outputAddress,
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

          if (touched.length === 1) {
            const [{ address, amount }] = touched;
            // mint & stake via wrapper
            if (outputAddress !== feederPool.address) {
              return propose<Interfaces.FeederWrapper, 'mintAndStake'>(
                new TransactionManifest(
                  contracts.feederWrapper,
                  'mintAndStake',
                  [
                    feederPool.address,
                    feederPool.vault.address,
                    address,
                    (amount as BigDecimal).exact,
                    minOutputAmount.exact,
                  ],
                  {
                    past: 'Deposited & Staked',
                    present: 'Depositing & Staking',
                  },
                  formId,
                ),
              );
            }
            // mint
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

          // mint & stake multi
          if (isMintingAndStakingLP) {
            return propose<Interfaces.FeederWrapper, 'mintMultiAndStake'>(
              new TransactionManifest(
                contracts.feederWrapper,
                'mintMultiAndStake',
                [
                  feederPool.address,
                  feederPool.vault.address,
                  addresses,
                  amounts,
                  minOutputAmount.exact,
                ],
                { past: 'Deposited & Staked', present: 'Depositing & Staking' },
                formId,
              ),
            );
          }

          // mint multi
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
