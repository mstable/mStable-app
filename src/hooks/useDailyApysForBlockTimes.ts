import { useMemo } from 'react';
import { getUnixTime } from 'date-fns';
import { useQuery, gql, DocumentNode } from '@apollo/client';

import { getKeyTimestamp } from '../utils/getKeyTimestamp';

interface BlockTime {
  timestamp: number;
  number: number;
}

const nowUnix = getUnixTime(Date.now());

const useDailyApysDocument = (
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
