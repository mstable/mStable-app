/**
 *******************************************************************************
 *
 * Call the script with the following args:
 *
 * - Tranche number
 * - Current tranche start timestamp
 * - Platform token address
 * - Platform token allocations per pool
 *
 * @example
 *
 * ```bash
yarn run platform-rewards --trancheNumber=32 \
  --startBlock=12225272 \
  --startTimestamp=1618230806 \
  --token=0xba100000625a3754423978a60c9317c58a424e3d \
  --allocations \
  0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb,12.928093722125540310
 * ```
 *
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

import { BigNumber, utils } from 'ethers';
import { options } from 'yargs';

import { getMerkleRootHash } from './merkleRootHash';
import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
import { outputJsonReport } from './utils/outputJsonReport';
import { fetchAllData } from './utils/fetchAllData';
import {
  ScriptRewardsDocument,
  ScriptRewardsQueryResult,
} from '../src/graphql/ecosystem';
import { SCALE } from '../src/constants';
import {
  BlockTimestampDocument,
  BlockTimestampQueryResult,
  BlockTimestampQueryVariables,
} from '../src/graphql/blocks';

interface BlockTimestamp {
  blockNumber: number;
  timestamp: number;
}

interface AddressBnMap {
  [address: string]: BigNumber;
}

interface AddressBnMapPerPool {
  [poolAddress: string]: AddressBnMap;
}

interface MtaEarningsAndShares {
  sharesPerPool: AddressBnMapPerPool;
  mtaEarningsPerStakerPerPool: AddressBnMapPerPool;
  totalMtaEarningsPerPoolAtStart: AddressBnMap;
  totalMtaEarningsPerPoolAtEnd: AddressBnMap;
}

interface Tranche {
  number: number;
  start: BlockTimestamp;
  end: BlockTimestamp;
}

interface ValidatedArgs {
  token: { symbol: string; address: string; decimals: number };
  allocations: AddressBnMap;
  poolAddresses: string[];
  tranche: Tranche;
}

interface PlatformEarnings {
  totalEarnedForAllStakers: BigNumber;
  totalEarnedPerStaker: AddressBnMap;
}

export interface PlatformEarningsReport {
  rewards: Record<string, string>;
  tokenAddress: string;
  totalRewards: string;
  tranche: ValidatedArgs['tranche'];
  mtaEarnings: {
    mtaEarningsPerStakerPerPool: Record<string, Record<string, string>>;
    totalMtaEarningsPerPoolAtStart: Record<string, string>;
    totalMtaEarningsPerPoolAtEnd: Record<string, string>;
  };
}

interface TokenMetadata {
  symbol: string;
  address: string;
  decimals: number;
}

type Data = NonNullable<
  ScriptRewardsQueryResult['data']
>['stakingRewardsContracts'][number];

interface Pool {
  address: string;
  claimRewardTransactions: Data['claimRewardTransactions'];
  lastUpdateTime: number;
  rewardPerToken: BigNumber;
  rewardPerTokenStored: BigNumber;
  rewardRate: BigNumber;
  stakingBalances: Data['stakingBalances'];
  stakingRewards: Data['stakingRewards'];
  totalTokens: BigNumber;
}

interface Pools {
  [poolAddress: string]: Pool;
}

interface ReportData {
  tranche: Tranche;
  token: TokenMetadata;
  dirName: string;
  fullOutputReportFileName: string;
  simpleOutputReportFileName: string;
  fullOutputReport: PlatformEarningsReport;
  simpleOutputReport: PlatformEarningsReport['rewards'];
}

const { formatUnits, parseUnits } = utils;

const TOKENS_METADATA: {
  [tokenAddress: string]: TokenMetadata;
} = {
  '0xba100000625a3754423978a60c9317c58a424e3d': {
    address: '0xba100000625a3754423978a60c9317c58a424e3d',
    symbol: 'BAL',
    decimals: 18,
  },
};

const parseArgs = async (): Promise<ValidatedArgs> => {
  const {
    argv: { startBlock, startTimestamp, trancheNumber, token, allocations },
  } = options({
    token: { type: 'string', demandOption: true },
    allocations: { type: 'array', demandOption: true },
    startBlock: { type: 'number', demandOption: true },
    startTimestamp: { type: 'number', demandOption: true },
    trancheNumber: { type: 'number', demandOption: true },
  });

  if (startTimestamp.toString().length !== 10) {
    throw new Error('Invalid timestamp (expected seconds)');
  }

  // Using one week as a default period, could be an argument
  const secondsInWeek = 604800;
  const endTimestamp = startTimestamp + secondsInWeek;

  const validatedToken = TOKENS_METADATA[token];

  if (!validatedToken) {
    throw new Error(`Token ${token} metadata not defined`);
  }

  const validatedAllocations: {
    [poolAddress: string]: BigNumber;
  } = Object.fromEntries(
    allocations.map(item => {
      const [poolAddress, amount] = (item as string).split(',');
      return [poolAddress, parseUnits(amount, 18)];
    }),
  );

  const client = getApolloClient();

  const { data: endBlockData } = (await client.query({
    query: BlockTimestampDocument,
    variables: {
      start: endTimestamp.toString(),
      end: (endTimestamp + 60).toString(),
    } as BlockTimestampQueryVariables,
  })) as BlockTimestampQueryResult;

  const {
    blocks: [endBlock],
  } = endBlockData as NonNullable<typeof endBlockData>;

  if (!endBlock) {
    throw new Error(`No block found for timestamp ${endTimestamp}`);
  }

  const validatedArgs: ValidatedArgs = {
    allocations: validatedAllocations,
    poolAddresses: Object.keys(validatedAllocations),
    token: validatedToken,
    tranche: {
      number: trancheNumber,
      start: {
        blockNumber: startBlock,
        timestamp: startTimestamp,
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

  return validatedArgs;
};

const shouldFetchMore = (
  data: ScriptRewardsQueryResult['data'],
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

const fetchPools = async (
  end: BlockTimestamp,
  poolAddresses: string[],
): Promise<Pools> => {
  const client = getApolloClient();

  let result: Pools = {};
  // For each pool in the manifest
  for (const id of poolAddresses) {
    // Fetch all data and combine the fields which required more fetches
    for await (const data of mod.fetchAllData(
      client,
      ScriptRewardsDocument,
      {
        id,
        end: end.timestamp,
        block: { number: end.blockNumber },
      },
      shouldFetchMore,
    )) {
      result = data.stakingRewardsContracts.reduce<Pools>((prev, current) => {
        const { address, lastUpdateTime, periodFinish } = current;

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

        const rewardRate = BigNumber.from(current.rewardRate);
        const rewardPerTokenStored = BigNumber.from(
          current.rewardPerTokenStored,
        );
        const totalTokens = BigNumber.from(current.totalSupply);

        let rewardPerToken = rewardPerTokenStored;

        // If there is no StakingToken liquidity, avoid div(0)
        if (!totalTokens.eq(0)) {
          const lastTimeRewardApplicable = Math.min(
            end.timestamp,
            periodFinish,
          );

          // New reward units to distribute = rewardRate * timeSinceLastUpdate
          const rewardUnitsToDistribute = rewardRate.mul(
            lastTimeRewardApplicable - lastUpdateTime,
          );

          // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
          const unitsToDistributePerToken = rewardUnitsToDistribute
            .mul(SCALE)
            .div(totalTokens);

          rewardPerToken = rewardPerTokenStored.add(unitsToDistributePerToken);
        }

        const contract: Pool = {
          address,
          claimRewardTransactions,
          lastUpdateTime,
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

const getEarningsPerStaker = ({
  claimRewardTransactions,
  rewardPerToken,
  stakingBalances,
  stakingRewards,
}: Pool): AddressBnMap => {
  const stakingRewardsPerAccount: Record<
    string,
    { amount: BigNumber; amountPerTokenPaid: BigNumber }
  > = Object.fromEntries(
    stakingRewards.map(({ amount, account, amountPerTokenPaid }) => [
      account,
      {
        amount: BigNumber.from(amount),
        amountPerTokenPaid: BigNumber.from(amountPerTokenPaid),
      },
    ]),
  );

  const stakingBalancesPerAccount: Record<
    string,
    BigNumber
  > = Object.fromEntries(
    stakingBalances.map(({ amount, account }) => [
      account,
      BigNumber.from(amount),
    ]),
  );

  const totalClaimedPerAccount = claimRewardTransactions.reduce<
    Record<string, BigNumber>
  >(
    (prev, { amount, sender: account }) => ({
      ...prev,
      [account]: (prev[account] ?? BigNumber.from(0)).add(amount),
    }),
    {},
  );

  const accounts = Object.keys(stakingBalancesPerAccount);

  return Object.fromEntries(
    accounts.map(account => {
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
      const totalEarned = totalClaimed ? earned.add(totalClaimed) : earned;

      return [account, totalEarned];
    }),
  );
};

const getEarningsPerStakerPerPool = (pools: Pools): AddressBnMapPerPool =>
  Object.fromEntries(
    Object.entries(pools).map(([address, pool]) => [
      address,
      getEarningsPerStaker(pool),
    ]),
  );

const subtractPreviousEarnings = (
  previous: AddressBnMapPerPool,
  current: AddressBnMapPerPool,
): AddressBnMapPerPool => {
  return Object.fromEntries(
    Object.entries(current).map(([poolAddress, currentEarnings]) => {
      const previousEarnings = previous[poolAddress];

      const trancheEarnings = Object.fromEntries(
        Object.entries(currentEarnings).map(([account, amount]) => {
          const previousAmount = previousEarnings?.[account];

          // Subtract previous earnings, if any. If there were no earnings,
          // in the latest tranche, the previous earnings are not relevant.
          const trancheAmount =
            previousAmount && amount.gt(0)
              ? amount.sub(previousAmount)
              : amount;

          return [account, trancheAmount];
        }),
      );

      return [poolAddress, trancheEarnings];
    }),
  );
};

const getSharesPerPool = (
  earningsPerStakerPerPool: AddressBnMapPerPool,
): { [poolAddress: string]: AddressBnMap } => {
  return Object.fromEntries(
    Object.entries(earningsPerStakerPerPool).map(
      ([poolAddress, earningsPerStaker]) => {
        const totalEarnedForAllStakers = Object.values(
          earningsPerStaker,
        ).reduce((prev, current) => prev.add(current), BigNumber.from(0));

        const sharePerStaker: AddressBnMap = Object.fromEntries(
          Object.entries(earningsPerStaker).map(([account, amount]) => {
            const share = totalEarnedForAllStakers.gt(0)
              ? amount.mul(SCALE).div(totalEarnedForAllStakers)
              : BigNumber.from(0);
            return [account, share];
          }),
        );

        return [poolAddress, sharePerStaker];
      },
    ),
  );
};

const getTotalMtaEarningsPerPool = (
  earningsPerStakerPerPool: AddressBnMapPerPool,
): AddressBnMap => {
  return Object.fromEntries(
    Object.entries(earningsPerStakerPerPool).map(([poolAddress, earnings]) => {
      const totalMtaEarnings = Object.values(earnings).reduce(
        (prev, current) => prev.add(current),
        BigNumber.from(0),
      );
      return [poolAddress, totalMtaEarnings];
    }),
  );
};

const getMtaEarningsAndShares = async (
  { start, end }: Tranche,
  poolAddresses: string[],
): Promise<MtaEarningsAndShares> => {
  const poolsAtStart = await mod.fetchPools(start, poolAddresses);
  const poolsAtEnd = await mod.fetchPools(end, poolAddresses);

  const earningsAtStart = getEarningsPerStakerPerPool(poolsAtStart);

  const earningsAtEnd = getEarningsPerStakerPerPool(poolsAtEnd);

  const earningsForTranche = subtractPreviousEarnings(
    earningsAtStart,
    earningsAtEnd,
  );

  const totalMtaEarningsPerPoolAtStart = getTotalMtaEarningsPerPool(
    earningsAtStart,
  );
  const totalMtaEarningsPerPoolAtEnd = getTotalMtaEarningsPerPool(
    earningsAtEnd,
  );

  const sharesPerPool = getSharesPerPool(earningsForTranche);

  return {
    totalMtaEarningsPerPoolAtStart,
    totalMtaEarningsPerPoolAtEnd,
    mtaEarningsPerStakerPerPool: earningsForTranche,
    sharesPerPool,
  };
};

const getPlatformEarnings = (
  poolRewards: AddressBnMap,
  { sharesPerPool }: MtaEarningsAndShares,
): PlatformEarnings => {
  const totalEarnedPerStaker: AddressBnMap = Object.entries(
    sharesPerPool,
  ).reduce((prev, current) => {
    const [poolAddress, sharePerStaker] = current;

    const allocatedRewards = poolRewards[poolAddress];

    return Object.entries(sharePerStaker)
      .filter(([, amount]) => amount.gt(0))
      .reduce<{
        [account: string]: BigNumber;
      }>((_prev, _current) => {
        const [account, share] = _current;

        const rewardAmount = allocatedRewards.mul(share).div(SCALE);

        return {
          ..._prev,
          [account]: (_prev[account] ?? BigNumber.from(0)).add(rewardAmount),
        };
      }, prev);
  }, {});

  const totalEarnedForAllStakers = Object.values(totalEarnedPerStaker).reduce(
    (prev, current) => prev.add(current),
    BigNumber.from(0),
  );

  return {
    totalEarnedForAllStakers,
    totalEarnedPerStaker,
  };
};

const getReportData = ({
  args: { tranche, token },
  platformEarnings: { totalEarnedForAllStakers, totalEarnedPerStaker },
  mtaEarningsAndShares: {
    // sharesPerPool,
    mtaEarningsPerStakerPerPool,
    totalMtaEarningsPerPoolAtEnd,
    totalMtaEarningsPerPoolAtStart,
  },
}: {
  args: ValidatedArgs;
  platformEarnings: PlatformEarnings;
  mtaEarningsAndShares: MtaEarningsAndShares;
}): ReportData => {
  const rewards = Object.fromEntries(
    Object.entries(totalEarnedPerStaker)
      .sort(([, a], [, b]) => (b.gt(a) ? 1 : -1))
      .map(([account, amount]) => [
        account,
        formatUnits(amount, token.decimals),
      ]),
  );

  const fullOutputReport: PlatformEarningsReport = {
    tranche,
    tokenAddress: token.address,
    totalRewards: formatUnits(totalEarnedForAllStakers, token.decimals),
    rewards,
    mtaEarnings: {
      mtaEarningsPerStakerPerPool: Object.fromEntries(
        Object.keys(mtaEarningsPerStakerPerPool)
          .sort()
          .map(poolAddress => {
            const earnings = Object.fromEntries(
              Object.entries(mtaEarningsPerStakerPerPool[poolAddress])
                .sort(([, a], [, b]) => (b.gt(a) ? 1 : -1))
                .map(([account, amount]) => [account, formatUnits(amount, 18)]),
            );
            return [poolAddress, earnings];
          }),
      ),
      totalMtaEarningsPerPoolAtEnd: Object.fromEntries(
        Object.keys(totalMtaEarningsPerPoolAtEnd)
          .sort()
          .map(poolAddress => [
            poolAddress,
            formatUnits(totalMtaEarningsPerPoolAtEnd[poolAddress], 18),
          ]),
      ),
      totalMtaEarningsPerPoolAtStart: Object.fromEntries(
        Object.keys(totalMtaEarningsPerPoolAtStart)
          .sort()
          .map(poolAddress => [
            poolAddress,
            formatUnits(totalMtaEarningsPerPoolAtStart[poolAddress], 18),
          ]),
      ),
    },
  };

  return {
    tranche,
    token,
    dirName: `tranches/${tranche.number}`,
    fullOutputReportFileName: `${token.address}${
      fullOutputReport ? '-full' : ''
    }`,
    fullOutputReport,
    simpleOutputReportFileName: token.address,
    simpleOutputReport: fullOutputReport.rewards,
  };
};

export const generateReportData = async (): Promise<ReportData> => {
  const args = await mod.parseArgs();
  const { tranche, allocations, poolAddresses } = args;

  const mtaEarningsAndShares = await getMtaEarningsAndShares(
    tranche,
    poolAddresses,
  );

  const platformEarnings = getPlatformEarnings(
    allocations,
    mtaEarningsAndShares,
  );

  return getReportData({
    args,
    platformEarnings,
    mtaEarningsAndShares,
  });
};

export const main = async () => {
  const {
    dirName,
    fullOutputReport,
    fullOutputReportFileName,
    simpleOutputReport,
    simpleOutputReportFileName,
    token,
    tranche,
  } = await generateReportData();

  const fullReport = await outputJsonReport({
    dirName,
    data: fullOutputReport,
    fileName: fullOutputReportFileName,
  });
  const simpleReport = await outputJsonReport({
    dirName,
    data: simpleOutputReport,
    fileName: simpleOutputReportFileName,
  });

  console.log('---');
  console.log(`Created files:\n\n${[fullReport, simpleReport].join('\n')}`);
  console.log('---');

  await getMerkleRootHash(tranche.number, token.address);
};

// For testing purposes
export const mod = {
  parseArgs,
  fetchAllData,
  fetchPools,
};
