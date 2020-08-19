#!/usr/bin/env node

import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { argv } from 'yargs';
import format from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';

import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
import { generateMarkdownReport } from './utils/generateMarkdownReport';
import { generateJsonReport } from './utils/generateJsonReport';

import {
  BlockTimestampDocument,
  BlockTimestampQueryResult,
  BlockTimestampQueryVariables,
} from '../src/graphql/blocks';
import { SCALE } from '../src/web3/constants';
import {
  RewardsTransactionsDocument,
  RewardsTransactionsQueryResult,
  RewardsTransactionsQueryVariables,
} from '../src/graphql/scripts';

interface InputArgs {
  contractAddress?: string;
  poolName?: string;
  start?: string;
  totalPlatformRewards?: number;
  trancheNumber?: string;
}

interface ValidatedArgs {
  contractAddress: string;
  poolName: string;
  start: number;
  totalPlatformRewards: BigNumber;
  tranche: {
    number: number;
    startDate: Date;
    endDate: Date;
    startTimestamp: number;
    endTimestamp: number;
  };
}

const getValidatedArgs = (): ValidatedArgs => {
  const {
    trancheNumber,
    poolName,
    contractAddress,
    start,
    totalPlatformRewards,
  } = argv as InputArgs;

  if (!trancheNumber) {
    throw new Error('Missing "trancheNumber" argument');
  }

  if (!poolName) {
    throw new Error('Missing "poolName" argument');
  }

  if (!start) {
    throw new Error(
      'Missing "start" argument (timestamp in seconds of week start)',
    );
  }

  if (!contractAddress) {
    throw new Error(
      'Missing "contractAddress" argument (staking rewards contract address)',
    );
  }

  if (!totalPlatformRewards) {
    throw new Error(
      'Missing "totalPlatformRewards" argument (platform rewards allocated, decimal number)',
    );
  }

  const startTimestamp = parseInt(start);

  const startDate = new Date(Math.floor(startTimestamp * 1e3));

  // Using one week as a default period, could be an argument
  const endDate = addWeeks(startDate, 1);

  const endTimestamp = Math.floor(endDate.getTime() / 1e3);

  return {
    contractAddress,
    poolName,
    start: parseInt(start),
    totalPlatformRewards: parseUnits(totalPlatformRewards.toString(), 18),
    tranche: {
      number: parseInt(trancheNumber),
      startDate,
      endDate,
      startTimestamp,
      endTimestamp,
    },
  };
};

const args = getValidatedArgs();

(async () => {
  const client = getApolloClient();

  const blockVariables: BlockTimestampQueryVariables = {
    start: args.tranche.endTimestamp.toString(),
    end: (args.tranche.endTimestamp + 60).toString(),
  };

  const { data: blockData } = (await client.query({
    query: BlockTimestampDocument,
    variables: blockVariables,
  })) as BlockTimestampQueryResult;

  const {
    blocks: [block],
  } = blockData as NonNullable<typeof blockData>;
  const end = parseInt(block.timestamp);

  const rewardsTxsVariables: RewardsTransactionsQueryVariables = {
    stakingRewards: args.contractAddress,
    start: args.tranche.startTimestamp,
    end: args.tranche.endTimestamp,
    block: { number: parseInt(block.number) },
  };

  const { data: rewardsData } = (await client.query({
    query: RewardsTransactionsDocument,
    variables: rewardsTxsVariables,
  })) as RewardsTransactionsQueryResult;

  const {
    stakingRewardsContracts: [data],
  } = rewardsData as NonNullable<typeof rewardsData>;

  const {
    lastUpdateTime,
    claimRewardTransactions,
    stakingRewards,
    stakingBalances,
    platformToken,
  } = data;
  const rewardPerTokenStored = new BigNumber(data.rewardPerTokenStored);
  const rewardRate = new BigNumber(data.rewardRate);
  const totalTokens = new BigNumber(data.totalSupply);
  const symbol = platformToken?.symbol ?? 'Token';

  const rewardPerToken = (() => {
    if (totalTokens.eq(0)) {
      // If there is no StakingToken liquidity, avoid div(0)
      return rewardPerTokenStored;
    }

    const timeSinceLastUpdate = end - lastUpdateTime;

    // New reward units to distribute = rewardRate * timeSinceLastUpdate
    const rewardUnitsToDistribute = rewardRate.mul(timeSinceLastUpdate);

    // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
    const unitsToDistributePerToken = rewardUnitsToDistribute
      .mul(SCALE)
      .div(totalTokens);

    return rewardPerTokenStored.add(unitsToDistributePerToken);
  })();

  const stakers: Record<string, any> = {};

  let totalEarnedForAllStakers = new BigNumber(0);

  claimRewardTransactions.forEach(({ sender, amount }: any) => {
    const current = stakers[sender];
    stakers[sender] = {
      ...current,
      claimed: [...((current && current.claimed) || []), new BigNumber(amount)],
    };
  });

  stakingRewards.forEach(({ account, amount, amountPerTokenPaid }: any) => {
    const current = stakers[account];
    stakers[account] = {
      ...current,
      stakingReward: {
        amount: new BigNumber(amount),
        amountPerTokenPaid: new BigNumber(amountPerTokenPaid),
      },
    };
  });

  stakingBalances.forEach(({ account, amount }: any) => {
    const current = stakers[account];
    stakers[account] = {
      ...current,
      stakingBalance: new BigNumber(amount),
    };
  });

  Object.keys(stakers).forEach(staker => {
    const current = stakers[staker];
    const { claimed = [], stakingReward, stakingBalance } = current;

    const totalClaimed = claimed.reduce(
      (prev: BigNumber, current: BigNumber) => prev.add(current),
      new BigNumber(0),
    );

    const earned = (() => {
      // Current rate per token - rate user previously received
      const userRewardDelta = rewardPerToken.sub(
        stakingReward.amountPerTokenPaid,
      );

      // New reward = staked tokens * difference in rate
      const userNewReward = stakingBalance.mul(userRewardDelta).div(SCALE);

      // Add to previous rewards
      return stakingReward.amount.add(userNewReward);
    })();

    const totalEarned = earned.add(totalClaimed);

    stakers[staker] = {
      totalEarned,
    };

    totalEarnedForAllStakers = totalEarnedForAllStakers.add(totalEarned);
  });

  Object.keys(stakers).forEach(staker => {
    const current = stakers[staker];

    const percentageOfPool = current.totalEarned
      .mul(SCALE)
      .div(totalEarnedForAllStakers);

    const totalPlatformRewardsEarned = args.totalPlatformRewards
      .mul(percentageOfPool)
      .div(SCALE);

    stakers[staker] = {
      ...current,
      percentageOfPool,
      totalPlatformRewardsEarned,
    };
  });

  const orderedStakers = Object.entries(stakers).sort((a, b) =>
    b[1].percentageOfPool.gt(a[1].percentageOfPool) ? 1 : -1,
  );

  const dirName = args.tranche.number.toString().padStart(3, '0');
  const fileName = args.contractAddress;

  const markdownReport = await generateMarkdownReport({
    fileName,
    dirName,
    items: [
      {
        columns: [
          {
            title: `${symbol} rewards week starting ${format(
              args.tranche.startDate,
              'LLL do, yyyy',
            )}`,
            width: 40,
          },
          { width: 42 },
        ],
        rows: [
          ['Pool', args.poolName],
          ['EARN address', args.contractAddress],
          ['Total number of addresses', orderedStakers.length],
          [`Total ${symbol} airdropped`, orderedStakers.length],
        ],
      },
      `_Run the script on \`mStable-app\` to verify for yourself:_`,
      {
        code: `yarn run pool-rewards --trancheNumber=${args.tranche.number} --contractAddress=${args.contractAddress} --totalPlatformRewards=${args.totalPlatformRewards} --start=${args.start} --poolName="${args.poolName}"`,
      },
      {
        columns: [
          { title: 'Holder address', width: 42 },
          { title: '% of MTA earned', width: 20 },
          { title: `${symbol} allocation`, width: 22 },
        ],
        rows: orderedStakers.map(
          ([staker, { totalPlatformRewardsEarned, percentageOfPool }]: [
            string,
            {
              totalPlatformRewardsEarned: BigNumber;
              percentageOfPool: BigNumber;
            },
          ]) => [
            staker,
            formatUnits(percentageOfPool, 16),
            formatUnits(totalPlatformRewardsEarned, 18),
          ],
        ),
      },
    ],
  });

  const jsonReport = await generateJsonReport({
    dirName,
    fileName,
    data: {
      metadata: {
        contractAddress: args.contractAddress,
        poolName: args.poolName,
        tranche: args.tranche,
        totalRewards: formatUnits(args.totalPlatformRewards, 18),
      },
      values: Object.fromEntries(
        orderedStakers.map(([address, { totalPlatformRewardsEarned }]) => [
          address,
          formatUnits(totalPlatformRewardsEarned, 18),
        ]),
      ),
    },
  });

  console.log(`Created files:\n${[markdownReport, jsonReport].join('\n')}`);
})();
