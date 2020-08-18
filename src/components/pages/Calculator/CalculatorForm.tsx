import React, { FC } from 'react';
import styled from 'styled-components';

import { P, H2, H3 } from '../../core/Typography';
import { Size } from '../../../theme';
import {
  useCalculatorState,
  useCalculatorDispatch,
} from './CalculatorProvider';
import { FormRow } from '../../core/Form';
import { Input } from '../../forms/Input';
import { AmountInput } from '../../forms/AmountInput';

const Bold = styled.span`
  font-weight: bold;
`;

const DatesRow = styled.div`
  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    display: flex;
    justify-content: space-between;
  }
`;

const DatesColumnNull = styled.div`
  width: 10%;
  flex-grow: 0;
`;

const MIN_DATE = '2020-05-29'; // when contract was deployed

export const CalculatorForm: FC<{}> = () => {
  const {
    amount,
    startDate,
    endDate,
    totalDays,
    depositedAmount,
    isInThePast,
    isInTheFuture,
    totalEarnings,
  } = useCalculatorState();

  const {
    amountChanged,
    startDateChanged,
    endDateChanged,
  } = useCalculatorDispatch();

  const avgApy = '20';
  const avgApyPast = '20';
  const avgApyFuture = '20';

  return (
    <div>
      <FormRow>
        <H3>Deposit amount in mUSD</H3>
        <AmountInput value={amount} onChange={value => amountChanged(value)} />
        <P>Your savings balance: {depositedAmount.format()} mUSD</P>
      </FormRow>

      <DatesRow>
        <FormRow>
          <H3>Deposit date</H3>
          <Input
            error={undefined}
            name="startDate"
            type="date"
            min={MIN_DATE}
            max={endDate}
            value={startDate}
            onChange={e => startDateChanged(e.target.value)}
          />
        </FormRow>
        <DatesColumnNull />
        <FormRow>
          <H3>Withdraw date</H3>
          <Input
            error={undefined}
            name="endDate"
            type="date"
            min={startDate}
            value={endDate}
            onChange={e => endDateChanged(e.target.value)}
          />
        </FormRow>
      </DatesRow>

      <FormRow>
        <H2>Result</H2>

        {isInThePast && (
          <P size={Size.l}>
            Past performance from Deposit date till Today:{' '}
            <Bold>{`${avgApyPast}% APY`}</Bold>
          </P>
        )}

        {isInTheFuture && (
          <P size={Size.l}>
            Future performance from Today till Withdraw date (estimated):{' '}
            <Bold>{`${avgApyFuture}% APY`}</Bold>
          </P>
        )}

        {isInThePast && isInTheFuture && (
          <P size={Size.l}>
            {`Average performance for selected ${totalDays} days:`}{' '}
            <Bold>{`${avgApy}% APY`}</Bold>
          </P>
        )}

        <P size={Size.l}>
          Total earnings: <Bold>{`${totalEarnings.format()} mUSD`}</Bold>
        </P>
      </FormRow>
    </div>
  );
};
