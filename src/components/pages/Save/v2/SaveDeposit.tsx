import React, { FC, useMemo, useState } from 'react';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { SavingsContractFactory } from '../../../../typechain/SavingsContractFactory';
import { Interfaces } from '../../../../types';
import { ADDRESSES } from '../../../../constants';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { SaveWrapperFactory } from '../../../../typechain/SaveWrapperFactory';

const formId = 'SaveDeposit';

export const SaveDeposit: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const bassets = Object.keys(massetState?.bAssets ?? {});
  const savingsContract = massetState?.savingsContracts.v2;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const inputToken = useTokenSubscription(inputAddress);

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      inputToken &&
      inputToken.balance.simple < inputAmount.simple
    ) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [inputToken, inputAmount]);

  const inputAddressOptions = useMemo(() => {
    return [
      { address: massetAddress as string },
      // TODO: ETH
      ...bassets.map(address => ({ address })),
    ];
  }, [massetAddress, bassets]);

  const exchangeRate = useMemo<BigDecimal | undefined>(() => {
    // TODO: handle rate for Curve and Uniswap, and slippage
    return saveExchangeRate;
  }, [saveExchangeRate]);

  const depositApprove = useMemo(
    () => ({
      spender: saveAddress as string,
      amount: inputAmount,
      address: inputAddress as string,
    }),
    [inputAmount, inputAddress, saveAddress],
  );

  const stakeApprove = useMemo(
    () => ({
      spender: ADDRESSES.mUSD.SaveWrapper,
      amount: inputAmount,
      address: inputAddress as string,
    }),
    [inputAmount, inputAddress],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      inputAddress={inputAddress}
      inputAmount={inputAmount}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
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
      <SendButton
        valid={valid}
        title="Deposit"
        handleSend={() => {
          if (
            signer &&
            saveAddress &&
            massetAddress &&
            inputAmount &&
            inputAddress
          ) {
            // TODO: add detail to purposes
            if (inputAddress === massetAddress) {
              return propose<
                Interfaces.SavingsContract,
                'depositSavings(uint256)'
              >(
                new TransactionManifest(
                  SavingsContractFactory.connect(saveAddress, signer),
                  'depositSavings(uint256)',
                  [inputAmount.exact],
                  {
                    present: 'Depositing savings',
                    past: 'Deposited savings',
                  },
                  formId,
                ),
              );
            }
            if (bassets.includes(inputAddress)) {
              return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                new TransactionManifest(
                  SaveWrapperFactory.connect(
                    ADDRESSES.mUSD.SaveWrapper,
                    signer,
                  ),
                  'saveViaMint',
                  [inputAddress, inputAmount.exact, false],
                  {
                    present: 'Depositing savings',
                    past: 'Deposited savings',
                  },
                  formId,
                ),
              );
            }
            // TODO: via Curve, Uniswap
          }
        }}
        approve={depositApprove}
      />
      <SendButton
        valid={valid}
        title="Deposit & Stake"
        handleSend={() => {
          if (
            signer &&
            saveAddress &&
            massetAddress &&
            inputAmount &&
            inputAddress
          ) {
            // TODO: add detail to purposes
            if (inputAddress === massetAddress) {
              return propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                new TransactionManifest(
                  SaveWrapperFactory.connect(saveAddress, signer),
                  'saveAndStake',
                  [inputAmount.exact],
                  {
                    present: 'Depositing and staking savings',
                    past: 'Deposited and staked savings',
                  },
                  formId,
                ),
              );
            }
            if (bassets.includes(inputAddress)) {
              return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                new TransactionManifest(
                  SaveWrapperFactory.connect(
                    ADDRESSES.mUSD.SaveWrapper,
                    signer,
                  ),
                  'saveViaMint',
                  [inputAddress, inputAmount.exact, true],
                  {
                    present: 'Depositing and staking savings',
                    past: 'Deposited and staked savings',
                  },
                  formId,
                ),
              );
            }
            // TODO: via Curve, Uniswap
          }
        }}
        approve={stakeApprove}
      />
    </AssetExchange>
  );
};
