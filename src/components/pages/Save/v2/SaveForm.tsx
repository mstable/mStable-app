import React, { FC, useEffect } from 'react';

import { useWalletAddress } from '../../../../context/OnboardProvider';
import { useSetFormManifest } from '../../../forms/TransactionForm/FormProvider';
import { useSelectedSaveV2Contract } from '../../../../web3/hooks';
import { Interfaces } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
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
  const savingsContract = useSelectedSaveV2Contract();
  const walletAddress = useWalletAddress();

  useEffect(() => {
    if (savingsContract && valid && walletAddress) {
      if (transactionType === TransactionType.Deposit && amount) {
        const body = `${amount.format()} ${massetSymbol}`;
        setFormManifest<Interfaces.SavingsContract, 'deposit'>({
          iface: savingsContract,
          args: [amount.exact, walletAddress],
          fn: 'deposit',
          purpose: {
            present: `Depositing ${body}`,
            past: `Deposited ${body}`,
          },
        });
        return;
      }
      if (transactionType === TransactionType.Withdraw && amountInCredits) {
        const body = `${massetSymbol} savings`;
        setFormManifest<Interfaces.SavingsContract, 'redeemUnderlying'>({
          iface: savingsContract,
          args: [amountInCredits.exact],
          fn: 'redeemUnderlying',
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
    walletAddress,
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
