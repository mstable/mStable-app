import { useMemo } from 'react';
import { eachDayOfInterval, endOfDay, subDays } from 'date-fns';

import { useSelectedSavingsContractState } from '../context/SelectedSaveVersionProvider';

import { useBlockTimesForDates } from './useBlockTimesForDates';
import { useDailyApysForBlockTimes } from './useDailyApysForBlockTimes';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';

const now = new Date();
const timestampsForWeek = eachDayOfInterval({
  start: subDays(now, 6),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

export const useAvailableSaveApy = (): {
  value: number;
  v1Apy: number;
  type: 'live' | 'average' | 'inactive' | 'fetching' | 'bootstrapping';
} => {
  const massetState = useSelectedMassetState();
  const savingsContract = useSelectedSavingsContractState();
  const v1Apy = massetState?.savingsContracts.v1?.dailyAPY ?? 0;
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
      return { value, v1Apy, type: 'fetching' };
    }

    if (!current) {
      return { value, v1Apy, type: 'inactive' };
    }

    const nonZeroApys = dailyApys.filter(v => v.dailyAPY > 0);

    // Not enough data to sample an average
    const useLive = nonZeroApys.length < 2;

    if (useLive) {
      value = liveAPY ?? value;
    } else {
      value =
        nonZeroApys.reduce((prev, { dailyAPY }) => prev + dailyAPY, 0) /
        nonZeroApys.length;
    }

    // It's possible to get misleading APYs during boostrapping
    if (value > 1000) {
      return { value: 0, v1Apy, type: 'bootstrapping' };
    }

    return { value, v1Apy, type: useLive ? 'live' : 'average' };
  }, [fetching, current, dailyApys, v1Apy, liveAPY]);
};
