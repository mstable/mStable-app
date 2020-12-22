import React, { FC, useEffect } from 'react';

import { useWalletAddress } from '../../../../../context/OnboardProvider';
import {
  useSetFormManifest,
  FormProvider,
} from '../../../../forms/TransactionForm/FormProvider';
import { useSelectedSaveV2Contract } from '../../../../../web3/hooks';
import { Interfaces } from '../../../../../types';
import { TransactionForm } from '../../../../forms/TransactionForm';
import { TransactionType } from '../types';
import { useSaveState } from '../SaveProvider';
import { SaveConfirm } from '../SaveConfirm';
import { SaveInput } from '../SaveInput';

const DepositForm: FC = () => {
  const {
    amount,
    amountInCredits,
    transactionType,
    valid,
    massetState,
  } = useSaveState();
  const massetSymbol = massetState?.token.symbol;

  const setFormManifest = useSetFormManifest();
  const savingsContract = useSelectedSaveV2Contract();
  const walletAddress = useWalletAddress();

  useEffect(() => {
    if (savingsContract && valid && walletAddress) {
      if (transactionType === TransactionType.Deposit && amount) {
        const body = `${amount.format()} ${massetSymbol}`;
        setFormManifest<
          Interfaces.SavingsContract,
          'depositSavings(uint256,address)'
        >({
          iface: savingsContract,
          args: [amount.exact, walletAddress],
          fn: 'depositSavings(uint256,address)',
          purpose: {
            present: `Depositing ${body}`,
            past: `Deposited ${body}`,
          },
        });
        return;
      }
    }
    setFormManifest(null);
  }, [
    amountInCredits,
    valid,
    amount,
    savingsContract,
    setFormManifest,
    transactionType,
    massetSymbol,
    walletAddress,
  ]);

  return (
    <TransactionForm
      confirm={<SaveConfirm />}
      confirmLabel="Deposit"
      input={<SaveInput />}
      transactionsLabel="Transactions"
      valid={valid}
    />
  );
};

export const Deposit: FC = () => (
  <FormProvider formId="deposit">
    <DepositForm />
  </FormProvider>
);
