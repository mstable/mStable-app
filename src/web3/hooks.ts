import { subDays, getUnixTime, endOfDay, eachDayOfInterval } from 'date-fns';
import { useMemo } from 'react';
import { BigNumber } from 'ethers/utils';
import { useQuery, gql, DocumentNode } from '@apollo/client';

import { useSigner } from '../context/OnboardProvider';
import {
  useSelectedMassetState,
  useSelectedSaveV1Address,
} from '../context/DataProvider/DataProvider';
import { Erc20DetailedFactory } from '../typechain/Erc20DetailedFactory';
import { MassetFactory } from '../typechain/MassetFactory';
import { SavingsContractFactory } from '../typechain/SavingsContractFactory';
import { SavingsContract } from '../typechain/SavingsContract.d';
import { Erc20Detailed } from '../typechain/Erc20Detailed.d';
import { Masset } from '../typechain/Masset.d';
import { truncateAddress } from './strings';

interface BlockTime {
  timestamp: number;
  number: number;
}

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

export const useBlockTimestampsDocument = (dates: Date[]): DocumentNode =>
  useMemo(
    () => gql`query BlockTimestamps @api(name: blocks) {
    ${dates
      .map(getUnixTime)
      .map(
        ts =>
          `t${ts}: blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: ${ts}, timestamp_lt: ${ts +
            60000} }) { number }`,
      )
      .join('\n')}
}`,
    [dates],
  );

export const getKeyTimestamp = (key: string): number => {
  const [, splitKey] = key.split('t');
  return parseInt(splitKey, 10);
};

export const useBlockTimesForDates = (dates: Date[]): BlockTime[] => {
  const blocksDoc = useBlockTimestampsDocument(dates);

  const query = useQuery<{
    [timestamp: string]: [] | [{ number: number }];
  }>(blocksDoc, { fetchPolicy: 'cache-first' });

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {}).filter(
      ([, value]) => !!value[0]?.number,
    ) as [string, [{ number: number }]][];

    return filtered
      .map(([key, [{ number }]]) => ({
        timestamp: getKeyTimestamp(key),
        number,
      }))
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }, [query.data]);
};

const nowUnix = getUnixTime(Date.now());

export const useDailyApysDocument = (
  savingsContractAddress: string | undefined,
  blockTimes: BlockTime[],
): DocumentNode =>
  useMemo(() => {
    const withId = `where: { id: "${savingsContractAddress}" }`;
    const currentApy = `t${nowUnix}: savingsContracts(${withId}) { ...DailySaveAPY }`;
    const blockApys = blockTimes
      .map(
        ({ timestamp, number }) => `
              t${timestamp}: savingsContracts(${withId}, block: { number: ${number} }) {
                ...DailySaveAPY
              }`,
      )
      .join('\n');

    return gql`
      fragment DailySaveAPY on SavingsContract {
        dailyAPY
        utilisationRate {
          simple
        }
      }
      query DailyApys @api(name: protocol) {
        ${currentApy}
        ${blockApys}
      }
    `;
  }, [savingsContractAddress, blockTimes]);

export const useDailyApysForBlockTimes = (
  savingsContractAddress: string | undefined,
  blockTimes: BlockTime[],
): { timestamp: number; dailyAPY: number; utilisationRate: number }[] => {
  const apysDoc = useDailyApysDocument(savingsContractAddress, blockTimes);

  const apysQuery = useQuery<{
    [timestamp: string]: [
      {
        dailyAPY: string;
        utilisationRate: { simple: string };
      },
    ];
  }>(apysDoc, { fetchPolicy: 'cache-first', nextFetchPolicy: 'cache-only' });

  return Object.entries(apysQuery.data || {})
    .filter(([, value]) => !!value?.[0]?.dailyAPY)
    .map(([key, [{ dailyAPY, utilisationRate }]]) => ({
      timestamp: getKeyTimestamp(key),
      dailyAPY: parseFloat(parseFloat(dailyAPY).toFixed(2)),
      utilisationRate: parseFloat(
        parseFloat(utilisationRate.simple).toFixed(2),
      ),
    }))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
};

const now = new Date();
export const timestampsForWeek = eachDayOfInterval({
  start: subDays(now, 6),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

export const useAverageApyForPastWeek = (): number | undefined => {
  // TODO support v1/v2
  const savingsContractAddress = useSelectedSaveV1Address();

  const blockTimes = useBlockTimesForDates(timestampsForWeek);
  const dailyApys = useDailyApysForBlockTimes(
    savingsContractAddress,
    blockTimes,
  );
  return useMemo(() => {
    if (dailyApys.length < 2) {
      // Not enough data to sample an average
      return undefined;
    }

    return (
      dailyApys.reduce((prev, { dailyAPY }) => prev + dailyAPY, 0) /
      dailyApys.length
    );
  }, [dailyApys]);
};

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = new BigNumber(1000);
  const offset = value.mul(GAS_MARGIN).div(new BigNumber(10000));
  return value.add(offset);
};

export const useErc20Contract = (
  address?: string | null,
): Erc20Detailed | undefined => {
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address
        ? Erc20DetailedFactory.connect(address, signer)
        : undefined,
    [address, signer],
  );
};

export const useSelectedMassetContract = (): Masset | undefined => {
  const massetState = useSelectedMassetState();
  const signer = useSigner();
  return useMemo(
    () =>
      signer && massetState?.address
        ? MassetFactory.connect(massetState.address, signer)
        : undefined,
    [massetState, signer],
  );
};
export const useSelectedSaveV1Contract = (): SavingsContract | undefined => {
  const massetState = useSelectedMassetState();
  const signer = useSigner();
  return useMemo(
    () =>
      signer && massetState?.savingsContracts.v1?.address
        ? SavingsContractFactory.connect(
            massetState.savingsContracts.v1.address,
            signer,
          )
        : undefined,
    [massetState, signer],
  );
};
