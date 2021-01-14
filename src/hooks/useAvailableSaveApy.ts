import { useMemo } from 'react';
import { eachDayOfInterval, endOfDay, subDays } from 'date-fns';

import { useSelectedSavingsContractState } from '../context/SelectedSaveVersionProvider';

import { useBlockTimesForDates } from './useBlockTimesForDates';
import { useDailyApysForBlockTimes } from './useDailyApysForBlockTimes';

const now = new Date();
const timestampsForWeek = eachDayOfInterval({
  start: subDays(now, 6),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

export const useAvailableSaveApy = (): {
  value: number;
  type: 'live' | 'average' | 'inactive' | 'fetching' | 'bootstrapping';
} => {
  const savingsContract = useSelectedSavingsContractState();
  const liveAPY = savingsContract?.dailyAPY;

  const blockTimes = useBlockTimesForDates(timestampsForWeek);
  const dailyApys = useDailyApysForBlockTimes(
    savingsContract?.address,
    blockTimes,
  );
  const current = savingsContract?.current;
  const fetching = !savingsContract;

  return useMemo(() => {
    let value = 0;

    if (fetching) {
      return { value, type: 'fetching' };
    }

    if (!current) {
      return { value, type: 'inactive' };
    }

    // Not enough data to sample an average
    const useLive = dailyApys.length < 2;

    if (useLive) {
      value = liveAPY ?? value;
    } else {
      value =
        dailyApys.reduce((prev, { dailyAPY }) => prev + dailyAPY, 0) /
        dailyApys.length;
    }

    // It's possible to get misleading APYs during boostrapping
    if (value > 1000) {
      return { value: 0, type: 'bootstrapping' };
    }

    return { value, type: useLive ? 'live' : 'average' };
  }, [current, liveAPY, dailyApys, fetching]);
};
