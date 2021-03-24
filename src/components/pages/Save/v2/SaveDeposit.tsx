import React, { FC, useMemo, useState } from 'react';
import { BoostedSavingsVault__factory } from '@mstable/protocol/types/generated/factories/BoostedSavingsVault__factory';
import { ISavingsContractV2__factory } from '@mstable/protocol/types/generated/factories/ISavingsContractV2__factory';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { SaveWrapper__factory } from '../../../../typechain';

import { Interfaces } from '../../../../types';
import { ADDRESSES } from '../../../../constants';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';

const formId = 'SaveDeposit';

const depositPurpose = {
  present: 'Depositing savings',
  past: 'Deposited savings',
};

const depositAndStakePurpose = {
  present: 'Depositing and staking savings',
  past: 'Deposited and staked savings',
};

export const SaveDeposit: FC<{
  saveAndStake?: boolean;
}> = ({ saveAndStake }) => {
  const signer = useSigner();
  const propose = usePropose();
  const massetName = useSelectedMassetName();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveTokenSymbol = savingsContract?.token?.symbol ?? '';
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const vaultBalance = vault?.account?.rawBalance ?? BigDecimal.ZERO;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;
  const saveWrapperAddress = ADDRESSES[massetName]?.SaveWrapper;
  const canDepositWithWrapper = !!(
    // TODO remove mBTC requirement when new SaveWrapper is deployed
    (savingsContract?.active && !!saveWrapperAddress && massetName === 'mbtc')
  );

  const bassets = useMemo(
    () =>
      canDepositWithWrapper ? Object.keys(massetState?.bAssets ?? {}) : [],
    [canDepositWithWrapper, massetState?.bAssets],
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
      ...(ADDRESSES[massetName]?.SaveWrapper
        ? [{ address: saveAddress as string }]
        : []),
      ...bassets.map(address => ({ address })),
    ];
  }, [massetAddress, massetName, saveAddress, bassets]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (isDepositingSave || !inputAmount || !saveExchangeRate) return {};

    return { value: BigDecimal.ONE.divPrecisely(saveExchangeRate) };
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
        ? (saveWrapperAddress as string)
        : (saveAddress as string),
      amount: scaledInputAmount,
      address: inputAddress as string,
    }),
    [
      isDepositingBasset,
      saveWrapperAddress,
      saveAddress,
      scaledInputAmount,
      inputAddress,
    ],
  );

  const stakeApprove = useMemo(
    () => ({
      spender: isDepositingSave
        ? (vaultAddress as string)
        : (saveWrapperAddress as string),
      amount: scaledInputAmount,
      address: inputAddress as string,
    }),
    [
      isDepositingSave,
      vaultAddress,
      saveWrapperAddress,
      scaledInputAmount,
      inputAddress,
    ],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      outputAddressOptions={[
        {
          address: saveAddress,
          balance: isDepositingSave ? vaultBalance : undefined,
          label: isDepositingSave ? `${saveTokenSymbol} Vault` : undefined,
        },
      ]}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      error={error}
      exchangeRate={exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string);
        }
      }}
      outputAddressDisabled
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
                  BoostedSavingsVault__factory.connect(vaultAddress, signer),
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
              title={`Mint ${saveTokenSymbol}`}
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
                        ISavingsContractV2__factory.connect(
                          saveAddress,
                          signer,
                        ),
                        'depositSavings(uint256)',
                        [inputAmount.exact],
                        depositPurpose,
                        formId,
                      ),
                    );
                  }

                  if (
                    canDepositWithWrapper &&
                    isDepositingBasset &&
                    scaledInputAmount
                  ) {
                    const manifest = new TransactionManifest<
                      Interfaces.SaveWrapper,
                      'saveViaMint'
                    >(
                      SaveWrapper__factory.connect(
                        saveWrapperAddress as string,
                        signer,
                      ),
                      'saveViaMint',
                      [inputAddress, scaledInputAmount.exact, false],
                      depositPurpose,
                      formId,
                    );
                    manifest.setFallbackGasLimit(580000);
                    return propose(manifest);
                  }

                  // TODO: via Curve
                }
              }}
              approve={depositApprove}
            />
          )}
          {!!vault && (
            <SendButton
              valid={valid}
              title="Mint & Deposit to Vault"
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
                        SaveWrapper__factory.connect(
                          saveWrapperAddress as string,
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
                        SaveWrapper__factory.connect(
                          saveWrapperAddress as string,
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
