import React, { FC, useMemo, useState } from 'react';

import { usePropose } from '../../../../context/TransactionsProvider';
import { useWalletAddress } from '../../../../context/OnboardProvider';
import { SendButton } from '../../../forms/SendButton';
import { AssetExchange } from '../../../forms/AssetExchange';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';
import { BigDecimalInputValue } from '../../../../hooks/useBigDecimalInputs';
import { AddressOption, Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import {
  useFPAssetAddressOptions,
  useFPVaultAddressOptions,
  useSelectedFeederPoolContracts,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { useEstimatedOutput } from '../../../../hooks/useEstimatedOutput';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

const formId = 'RedeemLP';

export const RedeemLP: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const contracts = useSelectedFeederPoolContracts();
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const massetPrice = useSelectedMassetPrice();

  const isLowLiquidity =
    feederPool?.liquidity.simple * (massetPrice ?? 0) < 100000;

  const vaultAddressOptions = useFPVaultAddressOptions();

  const defaultInputOptions = isLowLiquidity
    ? [
        vaultAddressOptions.find(
          v => v.address === feederPool.vault.address,
        ) as AddressOption,
      ]
    : vaultAddressOptions;

  const defaultOutputOptions = useFPAssetAddressOptions(true);

  const [inputOptions, setInputOptions] = useState<AddressOption[]>(
    defaultInputOptions,
  );
  const [outputOptions, setOutputOptions] = useState<AddressOption[]>(
    defaultOutputOptions.filter(a => a.address === feederPool.address),
  );

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    feederPool.vault.address,
  );
  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    feederPool.address,
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const handleSetInputAddress = (address: string): void => {
    if (address === feederPool.address) {
      setOutputOptions(
        defaultOutputOptions.filter(
          v =>
            v.address !== feederPool.vault.address ||
            v.address !== feederPool.address,
        ),
      );
      setOutputAddress(feederPool.fasset.address);
    } else {
      setInputOptions(defaultInputOptions);
    }
    setInputAddress(address);
  };

  const handleSetOutputAddress = (address: string): void => {
    if (address === feederPool.address) {
      setInputOptions(
        defaultInputOptions.filter(
          v =>
            v.address !== feederPool.vault.address ||
            v.address !== feederPool.address,
        ),
      );
      setInputAddress(feederPool.vault.address);
    } else {
      setInputOptions(defaultOutputOptions);
    }
    setOutputAddress(address);
  };

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  // Can't use useTokenSubscription because the input might be e.g. vault
  const inputToken = inputOptions.find(t => t.address === inputAddress);

  const outputToken = useMemo(
    () => outputOptions.find(t => t.address === outputAddress),
    [outputAddress, outputOptions],
  );

  const isUnstakingFromVault =
    inputAddress === feederPool.vault.address &&
    outputAddress === feederPool.address;

  const shouldSkipEstimation = isUnstakingFromVault;

  const { estimatedOutputAmount, exchangeRate, feeRate } = useEstimatedOutput(
    {
      ...inputToken,
      amount: inputAmount,
    } as BigDecimalInputValue,
    {
      ...outputOptions.find(t => t.address === outputAddress),
    } as BigDecimalInputValue,
    shouldSkipEstimation,
  );

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    inputAmount,
    estimatedOutputAmount.value,
  );

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount';

    if (
      inputToken?.balance?.exact &&
      inputAmount.exact.gt(inputToken?.balance?.exact)
    ) {
      return 'Insufficient balance';
    }

    if (!outputToken) {
      return 'Must select an asset to receive';
    }

    if (inputAmount.exact.eq(0)) {
      return 'Amount must be greater than zero';
    }

    if (isUnstakingFromVault) return;

    if (!estimatedOutputAmount.value?.simple && !estimatedOutputAmount.fetching)
      return `Not enough ${outputToken?.symbol} in basket`;

    if (estimatedOutputAmount.fetching) return 'Validating…';

    return estimatedOutputAmount.error;
  }, [
    inputAmount,
    inputToken,
    outputToken,
    isUnstakingFromVault,
    estimatedOutputAmount,
  ]);

  return (
    <AssetExchange
      inputAddressOptions={inputOptions}
      outputAddressOptions={outputOptions}
      error={(!isUnstakingFromVault && penaltyBonus?.message) || undefined}
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(inputToken?.balance?.string);
      }}
      handleSetInputAddress={handleSetInputAddress}
      handleSetOutputAddress={handleSetOutputAddress}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      outputFormValue={
        isUnstakingFromVault
          ? inputFormValue
          : estimatedOutputAmount.value?.string
      }
      isFetching={estimatedOutputAmount.fetching}
    >
      <SendButton
        title={error ?? 'Redeem'}
        penaltyBonusAmount={
          (!isUnstakingFromVault && penaltyBonus?.percentage) || undefined
        }
        valid={!error}
        handleSend={() => {
          if (!contracts || !walletAddress || !feederPool) return;
          if (!outputAddress || !inputAmount) return;

          if (isUnstakingFromVault) {
            return propose<Interfaces.BoostedSavingsVault, 'withdraw'>(
              new TransactionManifest(
                contracts.vault,
                'withdraw',
                [inputAmount.exact],
                { past: 'Withdrew', present: 'Withdrawing' },
                formId,
              ),
            );
          }

          if (!minOutputAmount) return;

          return propose<Interfaces.FeederPool, 'redeem'>(
            new TransactionManifest(
              contracts.feederPool,
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
        feeAmount={feeRate.value}
        feeLabel="Redemption Fee"
        feeTip="The received amount includes a small redemption fee. Fees are sent to Liquidity Providers."
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
      />
    </AssetExchange>
  );
};
