import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { BigNumber } from 'ethers/utils';

import { P, H2, H3 } from '../../core/Typography';
import { FormRow } from '../../core/Form';
import { Input } from '../../forms/Input';
import { AmountInput } from '../../forms/AmountInput';
import { Size } from '../../../theme';
import { useApyForTimePeriod, useApyForPast30Days } from '../../../web3/hooks';
import { formatExactAmount } from '../../../web3/amounts';
import {
  useCalculatorState,
  useCalculatorDispatch,
} from './CalculatorProvider';
import { calculateEarnings } from './utils';

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

const Section = styled.div`
  padding-bottom: 1rem;
`;

const ResultValue: FC = ({ children }) =>
  children ? <Bold>{children}</Bold> : <Skeleton width={100} />;

export const CalculatorForm: FC = () => {
  const {
    depositedAmount,
    amount,
    startDate,
    startMinDate,
    startMaxDate,
    endDate,
    endMinDate,
    pastDays,
    futureDays,
    isInThePast,
    isInTheFuture,
  } = useCalculatorState();

  const {
    amountChanged,
    startDateChanged,
    endDateChanged,
  } = useCalculatorDispatch();

  const pastApy = useApyForTimePeriod(new Date(startDate), new Date(endDate));
  const futureApy = useApyForPast30Days();

  const pastEarnings = useMemo<BigNumber>(
    () => calculateEarnings(amount, pastApy, pastDays),
    [amount, pastApy, pastDays],
  );
  const futureEarnings = useMemo<BigNumber>(
    () => calculateEarnings(amount, futureApy, futureDays),
    [amount, futureApy, futureDays],
  );

  return (
    <div>
      <FormRow>
        <H3>Deposit amount in mUSD</H3>
        <AmountInput value={amount} onChange={value => amountChanged(value)} />
        <P>
          Your savings balance:{' '}
          <ResultValue>
            {depositedAmount
              ? formatExactAmount(depositedAmount.exact, 18, 'mUSD')
              : undefined}
          </ResultValue>
        </P>
      </FormRow>

      <DatesRow>
        <FormRow>
          <H3>Deposit date</H3>
          <Input
            error={undefined}
            name="startDate"
            type="date"
            min={startMinDate}
            max={startMaxDate}
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
            min={endMinDate}
            value={endDate}
            onChange={e => endDateChanged(e.target.value)}
          />
        </FormRow>
      </DatesRow>

      <Section>
        <H2 borderTop>Estimated result</H2>

        {isInThePast && (
          <P size={Size.l}>
            Average performance from deposit date till today:{' '}
            <ResultValue>{formatExactAmount(pastApy, 16, '% APY')}</ResultValue>
          </P>
        )}

        {isInTheFuture && (
          <P size={Size.l}>
            Estimated future performance based on average APY for last 30 days:{' '}
            <ResultValue>
              {formatExactAmount(futureApy, 16, '% APY')}
            </ResultValue>
          </P>
        )}

        {isInThePast && (
          <P size={Size.l}>
            {`Past earnings for selected ${pastDays} days: `}
            <ResultValue>
              {formatExactAmount(pastEarnings, 18, 'mUSD')}
            </ResultValue>
          </P>
        )}

        {isInTheFuture && (
          <P size={Size.l}>
            {`Estimated earnings for selected ${futureDays} days in the future: `}
            <ResultValue>
              {formatExactAmount(futureEarnings, 18, 'mUSD')}
            </ResultValue>
          </P>
        )}

        {isInThePast && isInTheFuture && (
          <P size={Size.l}>
            {`Total earnings for selected ${pastDays + futureDays} days: `}
            <ResultValue>
              {formatExactAmount(pastEarnings.add(futureEarnings), 18, 'mUSD')}
            </ResultValue>
          </P>
        )}
      </Section>
    </div>
  );
};
