import React, { FC, useMemo } from 'react';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import Skeleton from 'react-loading-skeleton';
import { endOfHour, addMonths, differenceInDays } from 'date-fns';
import { BigNumber } from 'ethers/utils';

import { useApyForPast30Days } from '../../../web3/hooks';
import { parseExactAmount } from '../../../web3/amounts';
import { useVictoryTheme } from '../../../context/ThemeProvider';
import {
  abbreviateNumber,
  useDateFilterTickValues,
  useDateFilterTickFormat,
} from '../../stats/utils';
import { Color } from '../../../theme';
import { TimeMetricPeriod } from '../../../graphql/mstable';
import { DateRange } from '../../stats/Metrics';
import { H2 } from '../../core/Typography';

import { useCalculatorState } from './CalculatorProvider';
import { calculateEarnings } from './utils';

const startDate = endOfHour(new Date());

const dateFilter = {
  dateRange: DateRange.Month,
  period: TimeMetricPeriod.Month,
  label: '',
  from: startDate,
  end: addMonths(startDate, 7),
};

const days = differenceInDays(dateFilter.end, dateFilter.from);

const getBottomAndTopValues = (
  amount: string | null,
  futureEarnings: BigNumber,
): [number, number] => {
  const bottom = Math.floor(parseFloat(amount || '0'));
  const earnings = parseExactAmount(futureEarnings, 18).simple || 0;

  return [bottom, bottom + earnings];
};

export const EarningsChart: FC<{}> = () => {
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const victoryTheme = useVictoryTheme();

  const futureApy = useApyForPast30Days();
  const { amount } = useCalculatorState();

  const futureEarnings = useMemo(
    () => calculateEarnings(amount, futureApy, days),
    [amount, futureApy],
  );

  const [bottomValue, topValue] = useMemo(
    () => getBottomAndTopValues(amount, futureEarnings),
    [amount, futureEarnings],
  );

  const data = useMemo<{ x: Date; y: number }[]>(
    () => [
      { x: startDate, y: bottomValue },

      {
        x: addMonths(startDate, 3),
        // fake middle value to look like exponential chart
        y: bottomValue + (topValue - bottomValue) / 3,
      },
      { x: addMonths(startDate, 6), y: topValue },
    ],
    [bottomValue, topValue],
  );

  const domain = useMemo<[number, number]>(() => {
    // increase topValue by 3%
    const top = topValue + topValue * 0.03;
    return [bottomValue, Math.ceil(top)];
  }, [bottomValue, topValue]);

  return (
    <div>
      <H2 borderTop>Projected future earnings over next 6 months</H2>

      {(!amount || parseFloat(amount) === 0) && (
        <div>Provide deposit amount in the form above</div>
      )}

      {amount && parseFloat(amount) > 0 ? (
        <VictoryChart
          theme={victoryTheme}
          height={200}
          domainPadding={[20, 30]}
          padding={{ left: 45, top: 20, right: 0, bottom: 30 }}
        >
          <VictoryAxis
            dependentAxis
            domain={domain}
            tickFormat={
              parseFloat(amount || '0') > 1000 ? abbreviateNumber : undefined
            }
            fixLabelOverlap
            style={{
              ticks: { stroke: 'none' },
            }}
          />
          <VictoryAxis
            tickValues={tickValues}
            tickFormat={tickFormat}
            style={{
              grid: { stroke: 'none' },
            }}
          />
          <VictoryLine
            data={data}
            interpolation="natural"
            labels={({ datum }) => `${Math.ceil(datum.y)} mUSD`}
            labelComponent={<VictoryLabel />}
            style={{
              data: {
                stroke: Color.gold,
                strokeWidth: 2,
              },
            }}
          />
        </VictoryChart>
      ) : (
        <Skeleton height={270} />
      )}
    </div>
  );
};
