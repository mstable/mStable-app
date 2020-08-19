import { ApolloClient } from '@apollo/client';
import { BigNumber, bigNumberify, formatUnits } from 'ethers/utils';
import merge from 'lodash.merge';

import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
import { generateJsonReport } from './utils/generateJsonReport';
import { generateMarkdownReport } from './utils/generateMarkdownReport';
import { runMain } from './utils/runMain';

import {
  AllRewardsTransactionsDocument,
  AllRewardsTransactionsQueryResult,
} from '../src/graphql/scripts';

type Data = NonNullable<
  AllRewardsTransactionsQueryResult['data']
>['stakingRewardsContracts'];

interface StakingRewardsContracts {
  [contractAddress: string]: Data[number];
}

interface Amount {
  exact: BigNumber;
  string: string;
}

interface StakerPool {
  stakingBalance: Amount;
  stakingReward: {
    amount: Amount;
    amountPerTokenPaid: Amount;
  };
  totalClaimed: Amount;
  totalEarned: Amount;
}

interface StakerPools {
  [contractAddress: string]: StakerPool;
}

interface Staker {
  account: string;
  cumulativePlatformRewardEarned: Amount;
  pools: StakerPools;
}

interface Stakers {
  [account: string]: Staker;
}

const getAmount = (amount: string | BigNumber, decimals = 18): Amount => {
  const exact = bigNumberify(amount);
  return {
    exact,
    string: formatUnits(exact, decimals),
  };
};

const shouldFetchMore = (
  data: AllRewardsTransactionsQueryResult['data'],
  limit: number,
): boolean =>
  Boolean(
    data?.stakingRewardsContracts?.some(
      ({ stakingBalances, stakingRewards, claimRewardTransactions }) =>
        stakingRewards.length === limit ||
        stakingBalances.length === limit ||
        claimRewardTransactions.length === limit,
    ),
  );

const fetchDataWithLimit = async (
  client: ApolloClient<any>,
  limit: number,
  offset: number,
): Promise<AllRewardsTransactionsQueryResult['data']> => {
  const { data } = (await client.query({
    query: AllRewardsTransactionsDocument,
    variables: { limit, offset },
  })) as AllRewardsTransactionsQueryResult;

  return data;
};

const fetchAllData = async function*(
  client: ApolloClient<any>,
): AsyncIterable<Data> {
  const limit = 500;
  let offset = 0;

  let data = await fetchDataWithLimit(client, limit, offset);

  while (shouldFetchMore(data, limit)) {
    if (data?.stakingRewardsContracts) {
      yield data.stakingRewardsContracts;
    } else {
      return;
    }

    offset += limit;
    data = await fetchDataWithLimit(client, limit, offset);
  }
};

const fetchStakingRewardsContracts = async (): Promise<StakingRewardsContracts> => {
  const client = getApolloClient();

  let result: StakingRewardsContracts = {};

  // Fetch all data and combine the fields which required more fetches
  for await (const data of fetchAllData(client)) {
    result = data.reduce((prev, current) => {
      const existing = prev[current.address];

      const combined = {
        ...current,
        ...existing,
        stakingRewards: [
          ...(existing?.stakingRewards ?? []),
          ...current.stakingRewards,
        ],
        stakingBalances: [
          ...(existing?.stakingBalances ?? []),
          ...current.stakingBalances,
        ],
        claimRewardTransactions: [
          ...(existing?.claimRewardTransactions ?? []),
          ...current.claimRewardTransactions,
        ],
      };

      return { ...prev, [current.address]: combined };
    }, result);
  }

  return result;
};

const getUniqueStakers = (
  stakingRewardsContracts: StakingRewardsContracts,
): Stakers => {
  const stakers = Object.values(stakingRewardsContracts).reduce<Stakers>(
    (
      prev,
      { address, stakingRewards, stakingBalances, claimRewardTransactions },
    ) => {
      const stakers: Stakers = {};

      stakingBalances.forEach(({ account, amount }) => {
        const pool: StakerPool = {
          ...stakers[account]?.pools[address],
          stakingBalance: getAmount(amount),
        };

        stakers[account] = {
          ...stakers[account],
          account,
          pools: {
            ...stakers[account]?.pools,
            [address]: pool,
          },
        };
      });

      stakingRewards.forEach(({ amount, account, amountPerTokenPaid }) => {
        const pool: StakerPool = {
          ...stakers[account]?.pools[address],
          stakingReward: {
            amount: getAmount(amount),
            amountPerTokenPaid: getAmount(amountPerTokenPaid),
          },
        };

        stakers[account] = {
          ...stakers[account],
          account,
          pools: {
            ...stakers[account]?.pools,
            [address]: pool,
          },
        };
      });

      claimRewardTransactions.forEach(({ amount, sender: account }) => {
        const totalClaimed = getAmount(
          (
            stakers[account]?.pools[address]?.totalClaimed?.exact ??
            new BigNumber(0)
          ).add(amount),
        );

        const pool: StakerPool = {
          ...stakers[account]?.pools[address],
          totalClaimed,
        };

        stakers[account] = {
          ...stakers[account],
          account,
          pools: {
            ...stakers[account]?.pools,
            [address]: pool,
          },
        };
      });

      return merge(prev, stakers);
    },
    {},
  );

  return Object.keys(stakers).reduce<Stakers>((prev, current) => {
    const staker = stakers[current];

    const cumulative = Object.values(staker.pools).reduce(
      (_total, pool) => _total.add(pool.totalEarned.exact),
      new BigNumber(0),
    );

    return {
      ...prev,
      [current]: {
        ...staker,
        cumulativePlatformRewardEarned: getAmount(cumulative),
      },
    };
  }, {});
};

runMain(async () => {
  const stakingRewardsContracts = await fetchStakingRewardsContracts();

  const uniqueStakers = getUniqueStakers(stakingRewardsContracts);

  // const dirName = '';
  // const fileName = '';
  // await generateMarkdownReport({ dirName, fileName, items: [] });
  // await generateJsonReport({ dirName, fileName, data: {} });
});
