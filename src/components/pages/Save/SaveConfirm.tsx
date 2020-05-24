import React, { FC } from 'react';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { useSaveState } from './SaveProvider';
import { TransactionType } from './types';

export const SaveConfirm: FC<{}> = () => {
  const {
    touched,
    error,
    values: { transactionType, input },
  } = useSaveState();

  return touched && !error && input?.amount.simple ? (
    <>
      <P size={1}>
        <span>
          You are{' '}
          {transactionType === TransactionType.Deposit
            ? 'depositing'
            : 'withdrawing'}{' '}
        </span>
        <span>
          <CountUp end={input.amount.simple} /> {input.token.symbol}
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
