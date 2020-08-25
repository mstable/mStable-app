import React, { FC, useEffect } from 'react';

import { useSavingsContract } from '../../../context/DataProvider/ContractsProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { ReactComponent as SaveIcon } from '../../icons/circle/usd.svg';
import { P } from '../../core/Typography';
import { Interfaces } from '../../../types';
import { SaveProvider, useSaveState } from './SaveProvider';
import { SaveInput } from './SaveInput';
import { SaveInfo } from './SaveInfo';
import { SaveConfirm } from './SaveConfirm';
import { TransactionType } from './types';
import { PageHeader } from '../PageHeader';

const SaveForm: FC<{}> = () => {
  const { amount, amountInCredits, transactionType, valid } = useSaveState();

  const setFormManifest = useSetFormManifest();
  const savingsContract = useSavingsContract();

  // Set the form manifest
  useEffect(() => {
    if (valid && savingsContract && amount) {
      if (transactionType === TransactionType.Deposit) {
        setFormManifest<Interfaces.SavingsContract, 'depositSavings'>({
          iface: savingsContract,
          args: [amount.exact],
          fn: 'depositSavings',
        });
        return;
      }

      if (transactionType === TransactionType.Withdraw && amountInCredits) {
        setFormManifest<Interfaces.SavingsContract, 'redeem'>({
          iface: savingsContract,
          args: [amountInCredits.exact],
          fn: 'redeem',
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
  ]);

  return (
    <TransactionForm
      confirm={<SaveConfirm />}
      confirmLabel={
        transactionType === TransactionType.Deposit ? 'Deposit' : 'Withdrawal'
      }
      input={<SaveInput />}
      transactionsLabel="Save transactions"
      valid={valid}
    />
  );
};

export const Save: FC<{}> = () => (
  <SaveProvider>
    <FormProvider formId="save">
      <PageHeader
        icon={<SaveIcon />}
        title="SAVE"
        subtitle="Earn mUSD’s native interest rate"
      >
        <P>
          Deposit your mUSD into the mUSD SAVE contract and start earning
          interest.
        </P>
      </PageHeader>
      <SaveInfo />
      <SaveForm />
    </FormProvider>
  </SaveProvider>
);
