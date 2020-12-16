import React, { FC, useEffect } from 'react';

import { useSetFormManifest } from '../../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../../forms/TransactionForm';
import { useSelectedSaveV1Contract } from '../../../../web3/hooks';
import { Interfaces } from '../../../../types';
import { TransactionType } from './types';
import { useSaveState } from './SaveProvider';
import { SaveConfirm } from './SaveConfirm';
import { SaveInput } from './SaveInput';

export const SaveForm: FC = () => {
  const {
    amount,
    amountInCredits,
    transactionType,
    valid,
    massetState,
  } = useSaveState();
  const massetSymbol = massetState?.token.symbol;

  const setFormManifest = useSetFormManifest();
  const savingsContract = useSelectedSaveV1Contract();

  // Set the form manifest
  useEffect(() => {
    if (valid && savingsContract && amount) {
      if (transactionType === TransactionType.Deposit) {
        const body = `${amount.format()} ${massetSymbol}`;
        setFormManifest<Interfaces.SavingsContract, 'depositSavings(uint256)'>({
          iface: savingsContract,
          args: [amount.exact],
          fn: 'depositSavings(uint256)',
          purpose: {
            present: `Depositing ${body}`,
            past: `Deposited ${body}`,
          },
        });
        return;
      }

      if (transactionType === TransactionType.Withdraw && amountInCredits) {
        const body = `${massetSymbol} savings`;
        setFormManifest<Interfaces.SavingsContract, 'redeem'>({
          iface: savingsContract,
          args: [amountInCredits.exact],
          fn: 'redeem',
          purpose: {
            present: `Withdrawing ${body}`,
            past: `Withdrew ${body}`,
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
  ]);

  return (
    <TransactionForm
      confirm={<SaveConfirm />}
      confirmLabel={
        transactionType === TransactionType.Deposit ? 'Deposit' : 'Withdraw'
      }
      input={<SaveInput />}
      transactionsLabel="Save transactions"
      valid={valid}
    />
  );
};
