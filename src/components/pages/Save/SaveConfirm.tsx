import React, { FC } from 'react';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { useSaveState } from './SaveProvider';
import { TransactionType } from './types';

export const SaveConfirm: FC<{}> = () => {
  const { valid, transactionType, amount } = useSaveState();

  return valid && amount?.simple ? (
    <>
      <P size={1}>
        <span>
          You are{' '}
          {transactionType === TransactionType.Deposit
            ? 'depositing'
            : 'withdrawing'}{' '}
        </span>
        <span>
          <CountUp end={amount.simple} /> mUSD
        </span>
        .
      </P>
      {transactionType === TransactionType.Deposit ? (
        <P size={1}>This amount can be withdrawn at any time, without a fee.</P>
      ) : null}
    </>
  ) : (
    <P>No valid transaction.</P>
  );
};
