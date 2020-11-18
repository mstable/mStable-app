import './utils/init';
import {
  BlockTimestampDocument,
  BlockTimestampQueryResult,
  BlockTimestampQueryVariables,
} from '../src/graphql/blocks';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import { getApolloClient } from './utils/getApolloClient';
import { runMain } from './utils/runMain';
import {
  ScriptVaultBalancesDocument,
  ScriptVaultBalancesQueryResult,
  ScriptVaultBalancesQueryVariables,
} from '../src/graphql/protocol';
import { outputJsonReport } from './utils/outputJsonReport';

interface BlockTimestamps {
  dates: Date[];
  blocks: { number: string; timestamp: string }[];
}

type Result = {
  dates: Date[];
} & {
  [address: string]: string;
};

const getBlockTimestamps = async (): Promise<BlockTimestamps> => {
  const client = getApolloClient();

  const interval = { start: 1590584400000, end: Date.now() };

  const dates = eachDayOfInterval(interval);

  const queries = (await Promise.all(
    dates.map(date =>
      client.query({
        query: BlockTimestampDocument,
        variables: {
          start: Math.floor(date.getTime() / 1e3).toString(),
          end: (Math.floor(date.getTime() / 1e3) + 60).toString(),
        } as BlockTimestampQueryVariables,
      }),
    ),
  )) as BlockTimestampQueryResult[];

  const blocks = queries
    .filter(q => q.data?.blocks?.[0])
    .map(({ data }) => data?.blocks[0]) as any;

  return { dates, blocks };
};

const getHistoricalVaultBalances = async ({
  dates,
  blocks,
}: BlockTimestamps): Promise<Result> => {
  const client = getApolloClient();

  const balances = (
    await Promise.all(
      blocks.map(async ({ number, timestamp }, index) => {
        const { data } = (await client.query({
          query: ScriptVaultBalancesDocument,
          variables: {
            block: { number: parseInt(number) },
          } as ScriptVaultBalancesQueryVariables,
        })) as ScriptVaultBalancesQueryResult;
        return data;
      }),
    )
  ).filter(data => (data?.bassets || []).length > 0) as any;

  return {
    dates,
    [balances[0].bassets[0]?.id as string]: balances.map(
      (b: any) => b.bassets[0].vaultBalance,
    ),
    [balances[1].bassets[1]?.id as string]: balances.map(
      (b: any) => b.bassets[1].vaultBalance,
    ),
    [balances[2].bassets[2]?.id as string]: balances.map(
      (b: any) => b.bassets[2].vaultBalance,
    ),
    [balances[3].bassets[3]?.id as string]: balances.map(
      (b: any) => b.bassets[3].vaultBalance,
    ),
  };
};

export const main = async () => {
  const blockTimestamps = await getBlockTimestamps();

  const balances = await getHistoricalVaultBalances(blockTimestamps);

  const startTime = balances.dates[0].getTime();
  const endTime = balances.dates[balances.dates.length - 1].getTime();

  const file = await outputJsonReport({
    dirName: 'vault-breakdown',
    fileName: `${startTime}-${endTime}`,
    data: balances,
  });

  console.log(`Created file: ${file}`);
};
