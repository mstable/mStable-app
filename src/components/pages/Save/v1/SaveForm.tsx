import React, { FC, useEffect } from 'react';

import { useWalletAddress } from '../../../../context/OnboardProvider';
import { useSetFormManifest } from '../../../forms/TransactionForm/FormProvider';
import {
  useSelectedSaveV1Contract,
  useSelectedSaveV2Contract,
} from '../../../../web3/hooks';
import { Interfaces } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import { useActiveSaveVersion } from '../ActiveSaveVersionProvider';
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
  const savingsContractV1 = useSelectedSaveV1Contract();
  const savingsContractV2 = useSelectedSaveV2Contract();
  const activeVersion = useActiveSaveVersion();
  const walletAddress = useWalletAddress();

  // Set the form manifest
  useEffect(() => {
    if (activeVersion === 2 && savingsContractV2) {
      if (
        transactionType === TransactionType.Deposit &&
        amount &&
        walletAddress
      ) {
        const body = `${amount.format()} ${massetSymbol}`;
        setFormManifest<Interfaces.SavingsContract, 'deposit'>({
          iface: savingsContractV2,
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
          iface: savingsContractV2,
          args: [amountInCredits.exact],
          fn: 'redeemUnderlying',
          purpose: {
            present: `Withdrawing ${body}`,
            past: `Withdrew ${body}`,
          },
        });
        return;
      }
    } else if (valid && savingsContractV1 && amount) {
      if (transactionType === TransactionType.Deposit) {
        const body = `${amount.format()} ${massetSymbol}`;
        setFormManifest<Interfaces.SavingsContract, 'depositSavings'>({
          iface: savingsContractV1,
          args: [amount.exact],
          fn: 'depositSavings',
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
          iface: savingsContractV1,
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
    savingsContractV1,
    savingsContractV2,
    setFormManifest,
    transactionType,
    massetSymbol,
    walletAddress,
    activeVersion,
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
