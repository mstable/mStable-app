import React, { FC, useCallback, useEffect, useState } from 'react';

import { useSelectedMassetSavingsContract } from '../../../context/DataProvider/ContractsProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { Interfaces, SaveVersion } from '../../../types';
import { SaveProvider, useSaveState } from './SaveProvider';
import { SaveInput } from './SaveInput';
import { SaveInfo } from './SaveInfo';
import { SaveConfirm } from './SaveConfirm';
import { TransactionType } from './types';
import { PageHeader } from '../PageHeader';
import { ToggleSave, ToggleSaveSelection } from '../../forms/ToggleSave';

const { CURRENT, DEPRECATED } = SaveVersion;

const SaveForm: FC<{}> = () => {
  const { amount, amountInCredits, transactionType, valid } = useSaveState();

  const setFormManifest = useSetFormManifest();
  const savingsContract = useSelectedMassetSavingsContract();

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

export const Save: FC<{}> = () => {
  const [activeVersion, setActiveVersion] = useState(CURRENT);

  const handleVersionToggle = useCallback(
    (selection: ToggleSaveSelection) =>
      setActiveVersion(selection === 'primary' ? CURRENT : DEPRECATED),
    [],
  );

  return (
    <SaveProvider>
      <FormProvider formId="save">
        <PageHeader title="Save" subtitle="Earn mUSD’s native interest rate">
          <ToggleSave onClick={handleVersionToggle} />
        </PageHeader>
        <SaveInfo version={activeVersion} />
        <SaveForm />
      </FormProvider>
    </SaveProvider>
  );
};
