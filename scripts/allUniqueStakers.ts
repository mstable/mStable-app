/**
 *******************************************************************************
 *
 * Call the script with the following args:
 *
 * - Tranche number
 * - Current tranche start timestamp
 * - Rewards manifest: platform rewards per staking contract for the
 *   current tranche
 *
 * Usage example:
 *
 * `yarn run all-unique-stakers --trancheNumber=2 --startTimestamp=1597062435 --rewardsManifestFile=./rewardsTranche2.json`
 *
 * Example rewards manifest file for a given tranche:
 *
 * {
 *   "0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4": {
 *     "0xba100000625a3754423978a60c9317c58a424e3d": "1000"
 *   },
 *   "0x881c72d1e6317f10a1cdcbe05040e7564e790c80": {
 *     "0xba100000625a3754423978a60c9317c58a424e3d": "1000"
 *   },
 *   "0xf4a7d2d85f4ba11b5c73c35e27044c0c49f7f027": {
 *     "0xba100000625a3754423978a60c9317c58a424e3d": "1000"
 *   },
 *   "0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb":  {
 *     "0xba100000625a3754423978a60c9317c58a424e3d": "1000"
 *   }
 * }
 *
 *******************************************************************************
 *
 * Tranches are presumed to run for a week, so add a week to the start to
 * get the end of the current tranche.
 *
 * The start of the current tranche is presumed to be the end of the
 * previous tranche.
 *
 *******************************************************************************
 *
 * Run the main query with:
 *
 * start: 0
 * end: current tranche start
 *
 * and then with:
 *
 * start: 0
 * end: current tranche end
 *
 *******************************************************************************
 *
 * Firstly get the net total earned for each staker in each pool from 0 up
 * until the current tranche start (i.e. subtract claimed amounts)
 *
 * Then do the same, but up until the current tranche end.
 *
 * To get the net total amounts earned for each staker in each pool for the
 * current tranche, simply subtract the first totals from the second totals.
 *
 * These per-staker totals should be added up (for each pool) to get the
 * total earned for all stakers in that pool, which is used to derive
 * pool share percentages.
 *
 *******************************************************************************
 */

import fs from 'fs';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { options } from 'yargs';
import addWeeks from 'date-fns/addWeeks';

import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
import { generateJsonReport } from './utils/generateJsonReport';
import { runMain } from './utils/runMain';

import {
  RewardsDocument,
  RewardsQueryResult,
  RewardsQueryVariables,
} from '../src/graphql/scripts';
import { SCALE } from '../src/web3/constants';
import { fetchAllData } from './utils/fetchAllData';
import {
  BlockTimestampDocument,
  BlockTimestampQueryResult,
  BlockTimestampQueryVariables,
} from '../src/graphql/blocks';
import { generateMarkdownReport } from './utils/generateMarkdownReport';

interface RewardsManifest {
  [pool: string]: {
    [platformToken: string]: BigNumber;
  };
}

interface ValidatedArgs {
  rewardsManifest: RewardsManifest;
  tranche: {
    number: number;
    start: {
      blockNumber: number;
      timestamp: number;
    };
    end: {
      blockNumber: number;
      timestamp: number;
    };
  };
}

interface PoolMetadata {
  name: string;
}

type Data = NonNullable<
  RewardsQueryResult['data']
>['stakingRewardsContracts'][number];

interface Pool {
  address: string;
  claimRewardTransactions: Data['claimRewardTransactions'];
  lastUpdateTime: number;
  platformRewards: RewardsManifest[Pool['address']];
  rewardPerToken: BigNumber;
  rewardPerTokenStored: BigNumber;
  rewardRate: BigNumber;
  stakingBalances: Data['stakingBalances'];
  stakingRewards: Data['stakingRewards'];
  totalTokens: BigNumber;
}

interface Pools {
  [address: string]: Pool;
}

interface PoolEarnings {
  totalEarnedPerPlatformToken: {
    [platformToken: string]: BigNumber;
  };
  stakers: {
    [account: string]: {
      percentageOfPool: BigNumber;
      earnedPerPlatformToken: { [platformToken: string]: BigNumber };
      totalEarned: BigNumber;
    };
  };
}

interface EarningsPerPool {
  [address: string]: PoolEarnings;
}

interface EarningsPerPlatformToken {
  [platformToken: string]: {
    totalEarnedForAllStakers: BigNumber;
    totalEarnedPerStaker: {
      [account: string]: BigNumber;
    };
  };
}

const METADATA: { [address: string]: PoolMetadata } = {
  '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4': {
    name: 'mUSD/MTA 5/95 Balancer',
  },
  '0xf4a7d2d85f4ba11b5c73c35e27044c0c49f7f027': {
    name: 'mUSD/MTA 95/5 Balancer',
  },
  '0x881c72d1e6317f10a1cdcbe05040e7564e790c80': {
    name: 'mUSD/USDC Balancer',
  },
  '0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb': {
    name: 'mUSD/WETH Balancer',
  },
  '0x25970282aac735cd4c76f30bfb0bf2bc8dad4e70': {
    name: 'mUSD/MTA 20/80 Balancer',
  },
  '0x0d0d65e7a7db277d3e0f5e1676325e75f3340455': {
    name: 'MTA/WETH Uniswap',
  },
};

const parseRewardsManifest = async (
  filePath: string,
): Promise<RewardsManifest> => {
  let rewardsManifest: RewardsManifest;

  try {
    // Example: `{ "0xPOOL": { "0xBAL": "1099.23", "0xSNX": "821.49" } }`
    const buffer = await fs.promises.readFile(filePath);
    const jsonObj: Record<string, Record<string, string>> = JSON.parse(
      buffer as any,
    );

    if (
      !Object.values(jsonObj).every(pools =>
        Object.values(pools).every(amount => parseUnits(amount, 18)),
      )
    ) {
      throw new Error('Invalid format (expected `RewardsManifest`)');
    }

    rewardsManifest = Object.fromEntries(
      Object.entries(jsonObj).map(([pool, platformTokens]) => [
        pool.toLowerCase(),
        Object.fromEntries(
          Object.entries(platformTokens).map(([platformToken, amount]) => [
            platformToken.toLowerCase(),
            parseUnits(amount, 18), // Assuming all are 18 decimals
          ]),
        ),
      ]),
    );
  } catch (error) {
    throw new Error(`Unable to parse "rewardsJson": ${error.message}`);
  }

  return rewardsManifest;
};

const parseArgs = async (): Promise<ValidatedArgs> => {
  const {
    argv: { startTimestamp, trancheNumber, rewardsManifestFile },
  } = options({
    rewardsManifestFile: { type: 'string', demandOption: true },
    startTimestamp: { type: 'number', demandOption: true },
    trancheNumber: { type: 'number', demandOption: true },
  });

  if (startTimestamp.toString().length !== 10) {
    throw new Error('Invalid timestamp (expected seconds)');
  }

  // Using one week as a default period, could be an argument
  const endTimestamp = Math.floor(
    addWeeks(Math.floor(startTimestamp * 1e3), 1).getTime() / 1e3,
  );

  const rewardsManifest = await parseRewardsManifest(rewardsManifestFile);

  const client = getApolloClient();

  const { data: startBlockData } = (await client.query({
    query: BlockTimestampDocument,
    variables: {
      start: startTimestamp.toString(),
      end: (startTimestamp + 60).toString(),
    } as BlockTimestampQueryVariables,
  })) as BlockTimestampQueryResult;

  const { data: endBlockData } = (await client.query({
    query: BlockTimestampDocument,
    variables: {
      start: endTimestamp.toString(),
      end: (endTimestamp + 60).toString(),
    } as BlockTimestampQueryVariables,
  })) as BlockTimestampQueryResult;

  const {
    blocks: [startBlock],
  } = startBlockData as NonNullable<typeof startBlockData>;

  const {
    blocks: [endBlock],
  } = endBlockData as NonNullable<typeof endBlockData>;

  if (!startBlock) {
    throw new Error(`No block found for timestamp ${startTimestamp}`);
  }

  if (!endBlock) {
    throw new Error(`No block found for timestamp ${endTimestamp}`);
  }

  const validatedArgs: ValidatedArgs = {
    rewardsManifest,
    tranche: {
      number: trancheNumber,
      start: {
        blockNumber: parseInt(startBlock.number),
        timestamp: parseInt(startBlock.timestamp),
      },
      end: {
        blockNumber: parseInt(endBlock.number),
        timestamp: parseInt(endBlock.timestamp),
      },
    },
  };

  console.log(
    `Using tranche:\n---\n${JSON.stringify(
      validatedArgs.tranche,
      null,
      2,
    )}\n---`,
  );
  console.log(
    `Using manifest:\n---\n${JSON.stringify(
      validatedArgs.rewardsManifest,
      null,
      2,
    )}\n---`,
  );

  return validatedArgs;
};

const shouldFetchMore = (
  data: RewardsQueryResult['data'],
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

const fetchPools = async ({
  start,
  end,
  rewardsManifest,
}: {
  start: { timestamp: number };
  end: { blockNumber: number; timestamp: number };
  rewardsManifest: ValidatedArgs['rewardsManifest'];
}): Promise<Pools> => {
  const client = getApolloClient();

  let result: Pools = {};

  // For each pool in the manifest
  for (const id of Object.keys(rewardsManifest)) {
    // Fetch all data and combine the fields which required more fetches
    for await (const data of fetchAllData(
      client,
      RewardsDocument,
      {
        id,
        // start: start.timestamp,
        end: end.timestamp,
        block: { number: end.blockNumber },
      } as RewardsQueryVariables,
      shouldFetchMore,
    )) {
      result = data.stakingRewardsContracts.reduce<Pools>((prev, current) => {
        const { address, lastUpdateTime } = current;

        // Combine the previous and current results
        const stakingRewards = [
          ...(prev[address]?.stakingRewards ?? []),
          ...current.stakingRewards,
        ];
        const stakingBalances = [
          ...(prev[address]?.stakingBalances ?? []),
          ...current.stakingBalances,
        ];
        const claimRewardTransactions = [
          ...(prev[address]?.claimRewardTransactions ?? []),
          ...current.claimRewardTransactions,
        ];

        const rewardRate = new BigNumber(current.rewardRate);
        const rewardPerTokenStored = new BigNumber(
          current.rewardPerTokenStored,
        );
        const totalTokens = new BigNumber(current.totalSupply);

        let rewardPerToken = rewardPerTokenStored;
        {
          // If there is no StakingToken liquidity, avoid div(0)
          if (!totalTokens.eq(0)) {
            const timeSinceLastUpdate = end.timestamp - lastUpdateTime;

            // New reward units to distribute = rewardRate * timeSinceLastUpdate
            const rewardUnitsToDistribute = rewardRate.mul(timeSinceLastUpdate);

            // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
            const unitsToDistributePerToken = rewardUnitsToDistribute
              .mul(SCALE)
              .div(totalTokens);

            rewardPerToken = rewardPerTokenStored.add(
              unitsToDistributePerToken,
            );
          }
        }

        const contract: Pool = {
          address,
          claimRewardTransactions,
          lastUpdateTime,
          platformRewards: rewardsManifest[address],
          rewardPerToken,
          rewardPerTokenStored,
          rewardRate,
          stakingBalances,
          stakingRewards,
          totalTokens,
        };

        return {
          ...prev,
          [address]: contract,
        };
      }, result);
    }
  }

  return result;
};

const fetchPoolsCurrentTranche = async ({
  tranche: { start, end },
  rewardsManifest,
}: ValidatedArgs): Promise<Pools> =>
  fetchPools({ start, end, rewardsManifest });

const fetchPoolsPreviousTranches = async ({
  tranche,
  rewardsManifest,
}: ValidatedArgs): Promise<Pools> =>
  fetchPools({ start: { timestamp: 0 }, end: tranche.start, rewardsManifest });

const getPoolEarnings = (
  {
    claimRewardTransactions,
    rewardPerToken,
    stakingBalances,
    stakingRewards,
    platformRewards,
  }: Pool,
  previousEarnings?: PoolEarnings,
): PoolEarnings => {
  const stakingRewardsPerAccount: Record<
    string,
    { amount: BigNumber; amountPerTokenPaid: BigNumber }
  > = Object.fromEntries(
    stakingRewards.map(({ amount, account, amountPerTokenPaid }) => [
      account,
      {
        amount: new BigNumber(amount),
        amountPerTokenPaid: new BigNumber(amountPerTokenPaid),
      },
    ]),
  );

  const stakingBalancesPerAccount: Record<
    string,
    BigNumber
  > = Object.fromEntries(
    stakingBalances.map(({ amount, account }) => [
      account,
      new BigNumber(amount),
    ]),
  );

  const totalClaimedPerAccount = claimRewardTransactions.reduce<
    Record<string, BigNumber>
  >(
    (prev, { amount, sender: account }) => ({
      ...prev,
      [account]: (prev[account] ?? new BigNumber(0)).add(amount),
    }),
    {},
  );

  // Filter out accounts without a staking balance
  const accounts = Object.keys(stakingBalancesPerAccount).filter(account =>
    stakingBalancesPerAccount[account].gt(0),
  );

  const totalEarnedPerAccount = accounts.reduce<Record<string, BigNumber>>(
    (prev, account) => {
      const stakingReward = stakingRewardsPerAccount[account];
      const stakingBalance = stakingBalancesPerAccount[account];
      const totalClaimed: BigNumber | undefined =
        totalClaimedPerAccount[account];

      // Current rate per token - rate user previously received
      const userRewardDelta = rewardPerToken.sub(
        stakingReward.amountPerTokenPaid,
      );

      // New reward = staked tokens * difference in rate
      const userNewReward = stakingBalance.mul(userRewardDelta).div(SCALE);

      // Add to previous rewards
      const earned = stakingReward.amount.add(userNewReward);

      // Add claimed amount, if any
      let totalEarned = totalClaimed ? earned.add(totalClaimed) : earned;

      // Subtract total earned from previous tranches, if any
      const prevTotalEarned = previousEarnings?.stakers[account]?.totalEarned;
      if (prevTotalEarned) {
        totalEarned = totalEarned.sub(prevTotalEarned);
      }

      return {
        ...prev,
        [account]: totalEarned,
      };
    },
    {},
  );

  const totalEarnedForAllStakers = Object.values(totalEarnedPerAccount).reduce<
    BigNumber
  >((prev, current) => prev.add(current), new BigNumber(0));

  const platformRewardsEarnedPerAccount: Record<
    string,
    {
      percentageOfPool: BigNumber;
      earnedPerPlatformToken: { [platformToken: string]: BigNumber };
    }
  > = Object.fromEntries(
    accounts.map(account => {
      const totalEarned = totalEarnedPerAccount[account];

      const percentageOfPool = totalEarned
        .mul(SCALE)
        .div(totalEarnedForAllStakers);

      const earnedPerPlatformToken = Object.fromEntries(
        Object.entries(platformRewards).map(
          ([platformToken, totalPlatformRewards]) => {
            const total = totalPlatformRewards.mul(percentageOfPool).div(SCALE);
            return [platformToken, total];
          },
        ),
      );

      return [account, { percentageOfPool, earnedPerPlatformToken }];
    }),
  );

  const totalEarnedPerPlatformToken = Object.values(
    platformRewardsEarnedPerAccount,
  ).reduce<PoolEarnings['totalEarnedPerPlatformToken']>(
    (_totalPerPlatformToken, { earnedPerPlatformToken }) =>
      Object.entries(earnedPerPlatformToken).reduce(
        (prev, [platformToken, total]) => ({
          ...prev,
          [platformToken]: (prev[platformToken] ?? new BigNumber(0)).add(total),
        }),
        _totalPerPlatformToken,
      ),
    {},
  );

  return {
    totalEarnedPerPlatformToken,
    stakers: accounts.reduce<PoolEarnings['stakers']>((prev, account) => {
      const totalEarned = totalEarnedPerAccount[account];
      const {
        earnedPerPlatformToken,
        percentageOfPool,
      } = platformRewardsEarnedPerAccount[account];

      return {
        ...prev,
        [account]: {
          percentageOfPool,
          earnedPerPlatformToken,
          totalEarned,
        },
      };
    }, {}),
  };
};

const getEarningsPerPool = (
  pools: Pools,
  previousEarnings?: EarningsPerPool,
): EarningsPerPool =>
  Object.fromEntries(
    Object.entries(pools).map(([address, pool]) => [
      address,
      getPoolEarnings(pool, previousEarnings?.[address]),
    ]),
  );

const getEarningsPerPlatform = (
  earningsPerPool: EarningsPerPool,
): EarningsPerPlatformToken => {
  return Object.values(earningsPerPool).reduce<EarningsPerPlatformToken>(
    (prev, { stakers, totalEarnedPerPlatformToken }) => {
      const current = Object.entries(totalEarnedPerPlatformToken).reduce<
        EarningsPerPlatformToken
      >((_prev, [platformToken, totalEarned]) => {
        const totalEarnedForAllStakers = (
          _prev[platformToken]?.totalEarnedForAllStakers ?? new BigNumber(0)
        ).add(totalEarned);

        const totalEarnedPerStaker = Object.entries(stakers).reduce<{
          [account: string]: BigNumber;
        }>(
          (
            _totalEarnedPerStaker,
            [
              account,
              {
                earnedPerPlatformToken: { [platformToken]: earned },
              },
            ],
          ) => ({
            ..._totalEarnedPerStaker,
            [account]: (_totalEarnedPerStaker[account] ?? new BigNumber(0)).add(
              earned,
            ),
          }),
          {},
        );

        return {
          ..._prev,
          [platformToken]: {
            totalEarnedForAllStakers,
            totalEarnedPerStaker,
          },
        };
      }, prev);

      return {
        ...prev,
        ...current,
      };
    },
    {},
  );
};

interface PlatformReport {
  platformToken: string;
  totalEarnedForAllStakers: string;
  orderedStakers: Record<string, string>;
  tranche: ValidatedArgs['tranche'];
}

interface PoolReport {
  address: string;
  metadata: PoolMetadata;
  totalEarnedPerPlatformToken: {
    [platformToken: string]: string;
  };
  orderedStakers: {
    [account: string]: {
      [platformToken: string]: string;
    };
  };
  tranche: ValidatedArgs['tranche'];
}

const generatePoolReport = async ({
  tranche,
  address,
  metadata,
  orderedStakers,
  totalEarnedPerPlatformToken,
}: PoolReport): Promise<string> =>
  generateMarkdownReport({
    dirName: `tranches/${tranche.number}`,
    fileName: `${tranche.number.toString().padStart(3, '0')} - Tranche ${
      tranche.number
    } - ${metadata.name}`,
    items: [], // TODO
  });

const generatePlatformReport = async (
  platformReport: PlatformReport,
): Promise<string> =>
  generateJsonReport({
    dirName: `tranches/${platformReport.tranche.number}`,
    fileName: platformReport.platformToken,
    data: platformReport,
  });

const generatePlatformReports = async (
  { tranche: { start, end, number }, rewardsManifest }: ValidatedArgs,
  platformEarnings: EarningsPerPlatformToken,
): Promise<string[]> => {
  const platformReports: PlatformReport[] = Object.entries(
    platformEarnings,
  ).map(
    ([platformToken, { totalEarnedForAllStakers, totalEarnedPerStaker }]) => ({
      platformToken,
      pools: Object.keys(rewardsManifest).filter(
        address => rewardsManifest[address][platformToken],
      ),
      tranche: { start, end, number },
      totalEarnedForAllStakers: formatUnits(totalEarnedForAllStakers, 18),
      orderedStakers: Object.fromEntries(
        Object.entries(totalEarnedPerStaker)
          .sort(([, a], [, b]) => (b.gt(a) ? 1 : -1))
          .map(([account, amount]) => [account, formatUnits(amount, 18)]),
      ),
    }),
  );

  return Promise.all(platformReports.map(generatePlatformReport));
};

const main = async () => {
  // Parse args and fetch data
  const args = await parseArgs();
  const poolsPreviousTranches = await fetchPoolsPreviousTranches(args);
  const poolsCurrentTranche = await fetchPoolsCurrentTranche(args);

  // Process earnings data
  // const earningsPreviousTranches = getEarningsPerPool(poolsPreviousTranches);
  const earningsCurrentTranche = getEarningsPerPool(
    poolsCurrentTranche,
    // earningsPreviousTranches,
  );
  const platformEarnings = getEarningsPerPlatform(earningsCurrentTranche);

  // Output all reports
  // const poolFiles = await generatePoolReports(args, poolEarnings);
  const platformFiles = await generatePlatformReports(args, platformEarnings);

  // console.log(`Created files:\n${[...poolFiles, ...platformFiles].join('\n')}`);
  console.log(`Created files:\n${platformFiles.join('\n')}`);
};

runMain(main);
