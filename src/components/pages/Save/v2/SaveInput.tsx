import React, { ComponentProps, FC, useCallback, useMemo } from 'react';

import { FormRow } from '../../../core/Form';
import { H3 } from '../../../core/Typography';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { TransactionType } from './types';
import { useSaveDispatch, useSaveState } from './SaveProvider';

export const SaveInput: FC = () => {
  const {
    error,
    amount,
    transactionType,
    formValue,
    needsUnlock,
    massetState,
  } = useSaveState();

  const { setAmount, setMaxAmount } = useSaveDispatch();

  const massetAddress = massetState?.address || null;
  const savingsContractAddress = massetState?.savingsContracts.v2?.address;

  const tokenAddresses = useMemo<string[]>(
    () => (massetAddress ? [massetAddress] : []),
    [massetAddress],
  );

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onChangeAmount']>
  >(
    _formValue => {
      setAmount(_formValue);
    },
    [setAmount],
  );

  return (
    <>
      <FormRow>
        <H3>
          {transactionType === TransactionType.Deposit
            ? 'Depositing'
            : 'Withdrawing'}
        </H3>
        <TokenAmountInput
          name="input"
          tokenValue={massetAddress}
          amountValue={formValue}
          onChangeAmount={handleChangeAmount}
          onSetMax={setMaxAmount}
          tokenAddresses={tokenAddresses}
          tokenDisabled
          error={error}
          needsUnlock={needsUnlock}
          spender={savingsContractAddress as string}
          approveAmount={amount}
        />
      </FormRow>
    </>
  );
};
