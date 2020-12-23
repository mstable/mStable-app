import React, { FC, useEffect } from 'react';

import { useWalletAddress } from '../../../../context/OnboardProvider';
import {
  useSetFormManifest,
  FormProvider,
} from '../../../forms/TransactionForm/FormProvider';
import { useSelectedSaveV2Contract } from '../../../../web3/hooks';
import { Interfaces } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import { TransactionType } from './types';
import { useSaveState } from './SaveProvider';
import { SaveConfirm } from './SaveConfirm';
import { SaveInput } from './SaveInput';

const WithdrawFormContent: FC = () => {
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
      confirmLabel="Withdraw"
      input={<SaveInput />}
      transactionsLabel="Transactions"
      valid={valid}
    />
  );
};

export const WithdrawForm: FC = () => (
  <FormProvider formId="withdraw">
    <WithdrawFormContent />
  </FormProvider>
);
