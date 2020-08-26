import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { BigNumber } from 'ethers/utils';

import { P, H2, H3 } from '../../core/Typography';
import { FormRow } from '../../core/Form';
import { Input } from '../../forms/Input';
import { AmountInput } from '../../forms/AmountInput';
import { Size } from '../../../theme';
import { BigDecimal } from '../../../web3/BigDecimal';
import { useApyForTimePeriod } from '../../../web3/hooks';
import { formatExactAmount } from '../../../web3/amounts';
import {
  useCalculatorState,
  useCalculatorDispatch,
} from './CalculatorProvider';

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

const ResultValue: FC = ({ children }) =>
  children ? <Bold>{children}</Bold> : <Skeleton width={100} />;

const DAYS_IN_YEAR = 365;

export const CalculatorForm: FC = () => {
  const {
    amount,
    startDate,
    startMinDate,
    startMaxDate,
    endDate,
    endMinDate,
    totalDays,
    depositedAmount,
    isInThePast,
    isInTheFuture,
  } = useCalculatorState();

  const {
    amountChanged,
    startDateChanged,
    endDateChanged,
  } = useCalculatorDispatch();

  const avgApy = useApyForTimePeriod(new Date(startDate), new Date(endDate));
  const last30DaysApy = new BigNumber('0'); // TODO

  const totalEarnings = useMemo<BigNumber>(() => {
    const amountBigDecimal = BigDecimal.maybeParse(amount, 18);

    if (amountBigDecimal && avgApy) {
      return amountBigDecimal
        .mulTruncate(avgApy)
        .exact.mul(totalDays)
        .div(DAYS_IN_YEAR);
    }

    return new BigNumber('0');
  }, [avgApy, amount, totalDays]);

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

      <FormRow>
        <H2>Estimated result</H2>

        {isInThePast && (
          <P size={Size.l}>
            Average performance from deposit date till today:{' '}
            <ResultValue>{formatExactAmount(avgApy, 16, '% APY')}</ResultValue>
          </P>
        )}

        {isInTheFuture && (
          <P size={Size.l}>
            Estimated future performance (average APY for last 30 days):{' '}
            <ResultValue>
              {formatExactAmount(last30DaysApy, 16, '% APY')}
            </ResultValue>
          </P>
        )}

        <P size={Size.l}>
          {`Total estimated earnings for selected ${totalDays} days: `}
          <ResultValue>
            {formatExactAmount(totalEarnings, 18, 'mUSD')}
          </ResultValue>
        </P>
      </FormRow>
    </div>
  );
};
