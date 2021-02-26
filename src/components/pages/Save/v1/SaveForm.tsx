import React, { FC, useCallback } from 'react';

import { TransactionManifest } from '../../../../web3/TransactionManifest';
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

  const contract = useSelectedSaveV1Contract();

  // Set the form manifest
  const createTransaction = useCallback(
    (
      formId: string,
    ): TransactionManifest<
      Interfaces.SavingsContract,
      'depositSavings(uint256)' | 'redeem'
    > | void => {
      if (valid && contract && amount) {
        if (transactionType === TransactionType.Deposit) {
          const body = `${amount.format()} ${massetSymbol}`;
          return new TransactionManifest(
            contract as never,
            'depositSavings(uint256)',
            [amount.exact],
            {
              present: `Depositing ${body}`,
              past: `Deposited ${body}`,
            },
            formId,
          );
        }

        if (transactionType === TransactionType.Withdraw && amountInCredits) {
          const body = `${massetSymbol} savings`;
          return new TransactionManifest(
            contract as never,
            'redeem',
            [amountInCredits.exact],
            {
              present: `Withdrawing ${body}`,
              past: `Withdrew ${body}`,
            },
            formId,
          );
        }
      }
    },
    [amountInCredits, valid, amount, contract, transactionType, massetSymbol],
  );

  return (
    <TransactionForm
      formId="save"
      confirm={<SaveConfirm />}
      confirmLabel={
        transactionType === TransactionType.Deposit ? 'Deposit' : 'Withdraw'
      }
      createTransaction={createTransaction}
      input={<SaveInput />}
      valid={valid}
    />
  );
};
