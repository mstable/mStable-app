import React, { FC, useMemo, useState } from 'react';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { SaveWrapperFactory } from '../../../../typechain/SaveWrapperFactory';
import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { SavingsContractFactory } from '../../../../typechain/SavingsContractFactory';

import { Interfaces } from '../../../../types';
import { ADDRESSES } from '../../../../constants';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';

const formId = 'SaveDeposit';

const depositPurpose = {
  present: 'Depositing savings',
  past: 'Deposited savings',
};

const depositAndStakePurpose = {
  present: 'Depositing and staking savings',
  past: 'Deposited and staked savings',
};

const saveWrapperDeployed = !!ADDRESSES.mUSD.SaveWrapper;

export const SaveDeposit: FC<{
  saveAndStake?: boolean;
}> = ({ saveAndStake }) => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const savingsContract = massetState?.savingsContracts.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const vaultBalance = vault?.account?.rawBalance ?? BigDecimal.ZERO;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;

  const bassets = useMemo(
    () => (saveWrapperDeployed ? Object.keys(massetState?.bAssets ?? {}) : []),
    [massetState?.bAssets],
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const isDepositingSave = inputAddress === saveAddress;
  const isDepositingBasset = inputAddress && bassets.includes(inputAddress);

  const inputToken = useTokenSubscription(inputAddress);

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      inputToken?.balance &&
      inputToken.balance.simple < inputAmount.simple
    ) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [inputAmount, inputToken]);

  const inputAddressOptions = useMemo(() => {
    return [
      { address: massetAddress as string },
      { address: saveAddress as string },
      ...bassets.map(address => ({ address })),
    ];
  }, [massetAddress, saveAddress, bassets]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (isDepositingSave || !inputAmount || !saveExchangeRate) return {};

    return { value: saveExchangeRate };
  }, [inputAmount, isDepositingSave, saveExchangeRate]);

  const basset = inputAddress && massetState?.bAssets[inputAddress];
  const scaledInputAmount = useMemo<BigDecimal | undefined>(
    () =>
      basset && inputAmount
        ? inputAmount
            .divRatioPrecisely(basset.ratio)
            .setDecimals(basset.token.decimals)
        : inputAmount,
    [basset, inputAmount],
  );

  const depositApprove = useMemo(
    () => ({
      spender: isDepositingBasset
        ? (ADDRESSES.mUSD.SaveWrapper as string)
        : (saveAddress as string),
      amount: scaledInputAmount,
      address: inputAddress as string,
    }),
    [isDepositingBasset, saveAddress, scaledInputAmount, inputAddress],
  );

  const stakeApprove = useMemo(
    () => ({
      spender: isDepositingSave
        ? (vaultAddress as string)
        : (ADDRESSES.mUSD.SaveWrapper as string),
      amount: scaledInputAmount,
      address: inputAddress as string,
    }),
    [scaledInputAmount, inputAddress, isDepositingSave, vaultAddress],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      inputAddress={inputAddress}
      inputAmount={inputAmount}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      outputLabel={isDepositingSave ? 'imUSD Vault' : undefined}
      outputBalance={isDepositingSave ? vaultBalance : undefined}
      error={error}
      exchangeRate={exchangeRate}
      // slippage={slippage}
      handleSetAddress={setInputAddress}
      handleSetAmount={setInputFormValue}
      handleSetMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string);
        }
      }}
    >
      {isDepositingSave ? (
        <SendButton
          valid={valid}
          title="Stake"
          approve={stakeApprove}
          handleSend={() => {
            if (
              signer &&
              saveAddress &&
              vaultAddress &&
              inputAmount &&
              inputAddress
            ) {
              return propose<Interfaces.BoostedSavingsVault, 'stake(uint256)'>(
                new TransactionManifest(
                  BoostedSavingsVaultFactory.connect(vaultAddress, signer),
                  'stake(uint256)',
                  [inputAmount.exact],
                  {
                    present: 'Staking savings',
                    past: 'Staked savings',
                  },
                  formId,
                ),
              );
            }
          }}
        />
      ) : (
        <>
          {!saveAndStake && (
            <SendButton
              valid={valid}
              title="Deposit"
              handleSend={async () => {
                if (
                  signer &&
                  saveAddress &&
                  massetAddress &&
                  massetState &&
                  inputAmount &&
                  inputAddress
                ) {
                  if (inputAddress === massetAddress) {
                    return propose<
                      Interfaces.SavingsContract,
                      'depositSavings(uint256)'
                    >(
                      new TransactionManifest(
                        SavingsContractFactory.connect(saveAddress, signer),
                        'depositSavings(uint256)',
                        [inputAmount.exact],
                        depositPurpose,
                        formId,
                      ),
                    );
                  }

                  if (
                    saveWrapperDeployed &&
                    isDepositingBasset &&
                    scaledInputAmount
                  ) {
                    return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                      new TransactionManifest(
                        SaveWrapperFactory.connect(
                          ADDRESSES.mUSD.SaveWrapper as string,
                          signer,
                        ),
                        'saveViaMint',
                        [inputAddress, scaledInputAmount.exact, false],
                        depositPurpose,
                        formId,
                      ),
                    );
                  }

                  // TODO: via Curve
                }
              }}
              approve={depositApprove}
            />
          )}
          {saveWrapperDeployed && (
            <SendButton
              valid={valid}
              title="Deposit & Stake"
              handleSend={async () => {
                if (
                  signer &&
                  massetAddress &&
                  massetState &&
                  saveAddress &&
                  inputAmount &&
                  inputAddress
                ) {
                  if (inputAddress === massetAddress) {
                    return propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                      new TransactionManifest(
                        SaveWrapperFactory.connect(
                          ADDRESSES.mUSD.SaveWrapper as string,
                          signer,
                        ),
                        'saveAndStake',
                        [inputAmount.exact],
                        depositAndStakePurpose,
                        formId,
                      ),
                    );
                  }

                  if (isDepositingBasset && scaledInputAmount) {
                    return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                      new TransactionManifest(
                        SaveWrapperFactory.connect(
                          ADDRESSES.mUSD.SaveWrapper as string,
                          signer,
                        ),
                        'saveViaMint',
                        [inputAddress, scaledInputAmount.exact, true],
                        depositAndStakePurpose,
                        formId,
                      ),
                    );
                  }
                  // TODO: via Curve
                }
              }}
              approve={stakeApprove}
            />
          )}
        </>
      )}
    </AssetExchange>
  );
};
