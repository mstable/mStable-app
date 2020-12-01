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
  const versionNumber = activeVersion === CURRENT ? 2 : 1;

  const getVersion = (selection: ToggleSaveSelection): SaveVersion =>
    selection === 'primary' ? CURRENT : DEPRECATED;

  const getSelection = (version: SaveVersion): ToggleSaveSelection =>
    version === CURRENT ? 'primary' : 'secondary';

  const handleVersionToggle = useCallback(
    (selection: ToggleSaveSelection) => setActiveVersion(getVersion(selection)),
    [],
  );

  const handleMigrateClick = async (): Promise<void> => {
    // await transaction trigger for withdraw.
    // switch state and allow user to select deposit w/ new balance
    setActiveVersion(CURRENT);
  };

  return (
    <SaveProvider>
      <FormProvider formId="save">
        <PageHeader
          title={`Save V${versionNumber}`}
          subtitle="Earn mUSD’s native interest rate"
        >
          <ToggleSave
            onClick={handleVersionToggle}
            selection={getSelection(activeVersion)}
          />
        </PageHeader>
        <SaveInfo version={activeVersion} onMigrateClick={handleMigrateClick} />
        <SaveForm />
      </FormProvider>
    </SaveProvider>
  );
};
