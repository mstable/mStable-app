/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import styled from 'styled-components';
import {
  endOfDay,
  subDays,
  endOfHour,
  subHours,
  startOfDay,
  startOfHour,
} from 'date-fns';

import { TimeMetricPeriod } from '../../graphql/legacy';
import { ToggleInput } from '../forms/ToggleInput';
import { TabsContainer, TabBtn } from '../core/Tabs';
import { H3 } from '../core/Typography';
import { Color, FontSize, ViewportWidth } from '../../theme';

export enum DateRange {
  Day,
  Week,
  Month,
}

export interface Metric<T extends string> {
  type: T;
  label: string;
  enabled?: boolean;
  color?: string;
}

export interface DateFilter {
  dateRange: DateRange;
  from: Date;
  end: Date;
  period: TimeMetricPeriod;
  label: string;
  enabled?: boolean;
}

export interface State<T extends string> {
  metrics: Metric<T>[];
  dates: DateFilter[];
}

enum Actions {
  SetDateRange,
  ToggleType,
}

type Action<T extends string> =
  | {
      type: Actions.SetDateRange;
      payload: DateRange;
    }
  | {
      type: Actions.ToggleType;
      payload: T;
    };

interface Dispatch<T extends string> {
  setDateRange(dateRange: DateRange): void;
  toggleType(type: T): void;
}

const DateRangeBtn = styled(TabBtn)`
  white-space: nowrap;
  font-weight: normal;
  font-size: 12px;
`;

const Control = styled.div`
  padding-bottom: 16px;

  ${H3} {
    font-size: ${FontSize.m};
  }

  > div {
    min-height: 70px;
  }
`;

const ControlsContainer = styled.div`
  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    justify-content: space-between;

    > :first-child {
      flex: 1;
      margin-right: 16px;
    }
  }
`;

const ToggleLabel = styled.div`
  font-size: ${FontSize.xs};

  @media (min-width: ${ViewportWidth.m}) {
    font-size: ${FontSize.s};
  }
`;

const Toggle = styled.div`
  text-align: center;

  > :first-child {
    display: flex;
    justify-content: center;
    padding-bottom: 8px;
  }
`;

const MetricToggles = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 8px;
  border: 1px ${Color.blackTransparenter} solid;
`;

const ChartContainer = styled.div`
  svg {
    overflow: visible;
  }
`;

const Container = styled.div``;

const reducer: Reducer<State<any>, Action<any>> = (state, action) => {
  switch (action.type) {
    case Actions.SetDateRange: {
      const dateRange = action.payload;
      return {
        ...state,
        dates: state.dates.map(d =>
          d.dateRange === dateRange
            ? { ...d, enabled: true }
            : { ...d, enabled: false },
        ),
      };
    }

    case Actions.ToggleType: {
      const type = action.payload;
      return {
        ...state,
        metrics: state.metrics.map(t =>
          t.type === type ? { ...t, enabled: !t.enabled } : t,
        ),
      };
    }

    default:
      return state;
  }
};

const END_OF_HOUR = endOfHour(new Date());
const END_OF_DAY = endOfDay(new Date());

const DATE_RANGES: State<never>['dates'] = [
  {
    dateRange: DateRange.Day,
    period: TimeMetricPeriod.Hour,
    label: '24 hour',
    from: startOfHour(subHours(new Date(), 23)),
    end: END_OF_HOUR,
  },
  {
    dateRange: DateRange.Week,
    period: TimeMetricPeriod.Day,
    label: '7 day',
    from: startOfDay(subDays(new Date(), 6)),
    end: END_OF_DAY,
  },
  {
    dateRange: DateRange.Month,
    period: TimeMetricPeriod.Day,
    label: '30 day',
    from: startOfDay(subDays(new Date(), 29)),
    end: END_OF_DAY,
  },
];

interface Props<T extends string> {
  metrics: Metric<T>[];
  defaultDateRange?: DateRange;
}

const stateCtx = createContext<State<any>>({} as State<any>);

const dispatchCtx = createContext<Dispatch<any>>({} as Dispatch<any>);

const initializer = <T extends string>({
  metrics,
  defaultDateRange = DateRange.Week,
}: {
  metrics: Metric<T>[];
  defaultDateRange?: DateRange;
}): State<T> => ({
  metrics,
  dates: DATE_RANGES.map(date =>
    date.dateRange === defaultDateRange ? { ...date, enabled: true } : date,
  ),
});

export const Metrics = <T extends string>({
  metrics,
  defaultDateRange,
  children,
}: PropsWithChildren<Props<T>>): ReactElement => {
  const [state, dispatch] = useReducer(
    reducer,
    { metrics, defaultDateRange },
    initializer,
  );

  const toggleType = useCallback<Dispatch<T>['toggleType']>(
    type => {
      dispatch({ type: Actions.ToggleType, payload: type });
    },
    [dispatch],
  );

  const setDateRange = useCallback<Dispatch<never>['setDateRange']>(
    dateRange => {
      dispatch({ type: Actions.SetDateRange, payload: dateRange });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ toggleType, setDateRange }), [
          toggleType,
          setDateRange,
        ])}
      >
        <Container>
          <ControlsContainer>
            <Control>
              <H3 borderTop>Metrics</H3>
              <MetricToggles>
                {state.metrics.map(({ type, enabled, label, color }) => (
                  <Toggle key={type}>
                    <div>
                      <ToggleInput
                        enabledColor={color}
                        onClick={() => toggleType(type)}
                        checked={!!enabled}
                      />
                    </div>
                    <ToggleLabel>{label}</ToggleLabel>
                  </Toggle>
                ))}
              </MetricToggles>
            </Control>
            <Control>
              <H3 borderTop>Range</H3>
              <TabsContainer>
                {state.dates.map(({ label, enabled, dateRange }) => (
                  <DateRangeBtn
                    key={dateRange}
                    type="button"
                    onClick={() => setDateRange(dateRange)}
                    active={!!enabled}
                  >
                    {label}
                  </DateRangeBtn>
                ))}
              </TabsContainer>
            </Control>
          </ControlsContainer>
          <ChartContainer>{children}</ChartContainer>
        </Container>
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMetricsState = <T extends string>(): State<T> =>
  useContext(stateCtx);

export const useMetricsDispatch = <T extends string>(): Dispatch<T> =>
  useContext(dispatchCtx);

export const useDateFilter = (): DateFilter => {
  const { dates } = useMetricsState();
  return useMemo(
    () => dates.find(d => d.enabled) as NonNullable<typeof dates[0]>,
    [dates],
  );
};

export const useMetrics = <T extends string>(): Record<T, Metric<T>> => {
  const { metrics } = useMetricsState<T>();
  return useMemo(
    () =>
      metrics.reduce(
        (_types, type) => ({ ..._types, [type.type]: type }),
        {} as Record<T, Metric<T>>,
      ),
    [metrics],
  );
};
