import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { Color } from '../../../../theme';
import { FormRow } from '../../../core/Form';
import { H3 } from '../../../core/Typography';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { ToggleInput } from '../../../forms/ToggleInput';
import { TransactionType } from './types';
import { useSaveDispatch, useSaveState } from './SaveProvider';

const TransactionTypeRow = styled(FormRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.l} 0`};

  > * {
    padding: 0 8px;
  }
`;

export const SaveInput: FC = () => {
  const {
    error,
    amount,
    transactionType,
    formValue,
    needsUnlock,
    massetState,
  } = useSaveState();

  const { toggleTransactionType, setAmount, setMaxAmount } = useSaveDispatch();

  const massetAddress = massetState?.address || null;
  const savingsContractAddress = massetState?.savingsContracts.v1?.address;

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
      <TransactionTypeRow>
        <div>Deposit</div>
        <ToggleInput
          onClick={toggleTransactionType}
          checked={transactionType === TransactionType.Withdraw}
          enabledColor={Color.blue}
          disabledColor={Color.green}
        />
        <div>Withdraw</div>
      </TransactionTypeRow>
      <FormRow>
        <H3>
          {transactionType === TransactionType.Deposit
            ? 'Depositing'
            : 'Withdrawing'}
        </H3>
        <TokenAmountInput
          name="input"
          tokenValue={massetAddress as string}
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
