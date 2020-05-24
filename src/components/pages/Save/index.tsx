import React, { FC, useEffect } from 'react';

import { useSavingsContract } from '../../../context/DataProvider/ContractsProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { SaveProvider, useSaveState } from './SaveProvider';
import { SaveInput } from './SaveInput';
import { SaveConfirm } from './SaveConfirm';
import { TransactionType } from './types';
import { Interfaces } from '../../../types';

const SaveForm: FC<{}> = () => {
  const {
    error,
    touched,
    values: {
      input: {
        amount: { exact: inputAmount },
        amountInCredits,
      },
      transactionType,
    },
  } = useSaveState();

  const setFormManifest = useSetFormManifest();
  const savingsContract = useSavingsContract();

  // Set the form manifest
  useEffect(() => {
    if (!error && savingsContract && inputAmount) {
      if (transactionType === TransactionType.Deposit) {
        setFormManifest<Interfaces.SavingsContract, 'depositSavings'>({
          iface: savingsContract,
          args: [inputAmount],
          fn: 'depositSavings',
        });
        return;
      }

      if (transactionType === TransactionType.Withdraw && amountInCredits) {
        setFormManifest<Interfaces.SavingsContract, 'redeem'>({
          iface: savingsContract,
          args: [amountInCredits],
          fn: 'redeem',
        });
        return;
      }
    }

    setFormManifest(null);
  }, [
    amountInCredits,
    error,
    inputAmount,
    savingsContract,
    setFormManifest,
    transactionType,
  ]);

  return (
    <TransactionForm
      confirm={<SaveConfirm />}
      confirmLabel={
        transactionType === TransactionType.Deposit ? 'Deposit' : 'Withdrawal'
      }
      formId="save"
      input={<SaveInput />}
      transactionsLabel="Save transactions"
      valid={touched && !error}
    />
  );
};

export const Save: FC<{}> = () => (
  <SaveProvider>
    <FormProvider>
      <SaveForm />
    </FormProvider>
  </SaveProvider>
);
