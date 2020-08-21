import fs from 'fs';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { options } from 'yargs';
import addWeeks from 'date-fns/addWeeks';

import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
import { generateJsonReport } from './utils/generateJsonReport';
import { runMain } from './utils/runMain';

import {
  AllRewardsTransactionsDocument,
  AllRewardsTransactionsQueryResult,
} from '../src/graphql/scripts';
import { SCALE } from '../src/web3/constants';
import { fetchAllData } from './utils/fetchAllData';
import {
  BlockTimestampDocument,
  BlockTimestampQueryResult,
  BlockTimestampQueryVariables,
} from '../src/graphql/blocks';

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

type Data = NonNullable<
  AllRewardsTransactionsQueryResult['data']
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

type OrderedStakers = [string, BigNumber][];

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

const fetchPools = async ({
  tranche: { start, end },
  rewardsManifest,
}: ValidatedArgs): Promise<Pools> => {
  const client = getApolloClient();

  let result: Pools = {};

  // Fetch all data and combine the fields which required more fetches
  for await (const data of fetchAllData(
    client,
    AllRewardsTransactionsDocument,
    {
      pools: Object.keys(rewardsManifest),
      start: start.timestamp,
      end: end.timestamp,
      block: { number: end.blockNumber },
    },
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
      const rewardPerTokenStored = new BigNumber(current.rewardPerTokenStored);
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

          rewardPerToken = rewardPerTokenStored.add(unitsToDistributePerToken);
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

  return result;
};

const getPoolEarnings = ({
  claimRewardTransactions,
  rewardPerToken,
  stakingBalances,
  stakingRewards,
  platformRewards,
}: Pool): PoolEarnings => {
  const stakingRewardsPerAccount: Record<
    string,
    { amount: BigNumber; amountPerTokenPaid: BigNumber }
  > = Object.fromEntries(
    stakingRewards.map(({ amount, account, amountPerTokenPaid }) => [
      account,
      {
        amount: new BigNumber(amountPerTokenPaid),
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

      // Subtract claimed amount, if any
      const totalEarned = totalClaimed ? earned.sub(totalClaimed) : earned;

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
      const percentageOfPool = totalEarnedPerAccount[account]
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
      const {
        earnedPerPlatformToken,
        percentageOfPool,
      } = platformRewardsEarnedPerAccount[account];

      return {
        ...prev,
        [account]: {
          percentageOfPool,
          earnedPerPlatformToken,
        },
      };
    }, {}),
  };
};

const getEarningsPerPool = (pools: Pools): EarningsPerPool =>
  Object.fromEntries(
    Object.entries(pools).map(([address, pool]) => [
      address,
      getPoolEarnings(pool),
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

// const getEarnedPerTokenOrdered = (
//   earnedPerToken: EarnedPerToken,
// ): EarnedPerTokenOrdered =>
//   Object.entries(earnedPerToken).reduce<EarnedPerTokenOrdered>(
//     (prev, [platformToken, { total, stakers }]) => ({
//       ...prev,
//       [platformToken]: {
//         total,
//         stakers: Object.entries(stakers)
//           .filter(([, amount]) => amount.gt(0))
//           .sort(([, a], [, b]) => (b.gt(a) ? 1 : -1)),
//       },
//     }),
//     {},
//   );
//
// const generateJsonFiles = async (
//   args: ValidatedArgs,
//   allAmountsEarnedOrdered: EarnedPerTokenOrdered,
// ): Promise<string[]> => {
//   const dirName = `stakers/${args.tranche.number}`;
//
//   const promises = Object.entries(allAmountsEarnedOrdered).map(
//     ([platformToken, { stakers, total }]) =>
//       generateJsonReport({
//         dirName,
//         fileName: platformToken,
//         data: {
//           total: formatUnits(total, 18),
//           tranche: args.tranche,
//           stakers: Object.fromEntries(
//             stakers.map(([account, amount]) => [
//               account,
//               formatUnits(amount, 18),
//             ]),
//           ),
//         },
//       }),
//   );
//
//   return Promise.all(promises);
// };

// const generatePoolReports = async (
//   args: ValidatedArgs,
//   poolEarnings: EarningsPerPool,
// ): Promise<string[]> => {
//   const dirName = `pools/${args.tranche.number}`;
//
//   const promises = Object.entries(poolEarnings).map(
//     ([poolAddress, { stakers, totalEarnedPerPlatformToken }]) =>
//       generateJsonReport({
//         dirName,
//         fileName: poolAddress,
//         data: {
//           totalEarnedPerPlatformToken: Object.fromEntries(
//             Object.entries(
//               totalEarnedPerPlatformToken,
//             ).map(([platformToken, amount]) => [
//               platformToken,
//               formatUnits(amount, 18),
//             ]),
//           ),
//           tranche: args.tranche,
//           stakers: Object.fromEntries(
//             stakers.map(([account, amount]) => [
//               account,
//               formatUnits(amount, 18),
//             ]),
//           ),
//         },
//       }),
//   );
//
//   return Promise.all(promises);
// };

interface PlatformReport {
  platformToken: string;
  totalEarnedForAllStakers: string;
  orderedStakers: Record<string, string>;
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
  const pools = await fetchPools(args);

  // Process earnings data
  const poolEarnings = getEarningsPerPool(pools);
  const platformEarnings = getEarningsPerPlatform(poolEarnings);

  // Output all reports
  // const poolFiles = await generatePoolReports(args, poolEarnings);
  const platformFiles = await generatePlatformReports(args, platformEarnings);

  // console.log(`Created files:\n${[...poolFiles, ...platformFiles].join('\n')}`);
  console.log(`Created files:\n${platformFiles.join('\n')}`);
};

runMain(main);
