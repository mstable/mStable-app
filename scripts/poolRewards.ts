#!/usr/bin/env node

import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { argv } from 'yargs';
import path from 'path';
import fs from 'fs';
import format from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';

import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
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
  weekNumber?: string;
}

interface ValidatedArgs {
  contractAddress: string;
  poolName: string;
  start: number;
  totalPlatformRewards: BigNumber;
  week: {
    number: number;
    startDate: Date;
    endDate: Date;
    startTimestamp: number;
    endTimestamp: number;
  };
}

const getValidatedArgs = (): ValidatedArgs => {
  const {
    weekNumber,
    poolName,
    contractAddress,
    start,
    totalPlatformRewards,
  } = argv as InputArgs;

  if (!weekNumber) {
    throw new Error('Missing "weekNumber" argument');
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
  const endDate = addWeeks(startDate, 1);
  const endTimestamp = Math.floor(endDate.getTime() / 1e3);

  return {
    contractAddress,
    poolName,
    start: parseInt(start),
    totalPlatformRewards: parseUnits(totalPlatformRewards.toString(), 18),
    week: {
      number: parseInt(weekNumber),
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
    start: args.week.endTimestamp.toString(),
    end: (args.week.endTimestamp + 60).toString(),
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
    start: args.week.startTimestamp,
    end: args.week.endTimestamp,
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

  const command = `yarn run pool-rewards --weekNumber=${args.week.number} --contractAddress=${args.contractAddress} --totalPlatformRewards=${args.totalPlatformRewards} --start=${args.start} --poolName="${args.poolName}"`;
  const commandMsg = `_Run the script on \`mStable-app\` to verify for yourself:_\n\n\`${command}\``;

  const weekFmt = format(args.week.startDate, 'LLL do, yyyy');

  const markdown = `
| ${`${symbol} rewards week starting ${weekFmt}`.padEnd(
    40,
    ' ',
  )} |                                            |
| ---------------------------------------- | ------------------------------------------ |
| Pool                                     | ${args.poolName.padEnd(42)} |
| EARN Address                             | ${args.contractAddress.padEnd(
    42,
  )} |
| Total number of addresses                | ${orderedStakers.length
    .toString()
    .padEnd(42)} |
| ${`Total ${symbol} airdropped`.padEnd(
    40,
    ' ',
  )} | ${args.totalPlatformRewards.toString().padEnd(42)} |

${commandMsg}

| Holder address                             | % of MTA earned      | ${`${symbol} allocation`.padEnd(
    22,
    ' ',
  )} |
| ------------------------------------------ | -------------------- | ---------------------- |
${orderedStakers
  .map(
    ([staker, { totalPlatformRewardsEarned, percentageOfPool }]: any) =>
      `| ${staker} | ${formatUnits(percentageOfPool, 16).padEnd(
        20,
      )} | ${formatUnits(totalPlatformRewardsEarned, 18).padEnd(22)} |`,
  )
  .join('\n')}
`;

  const jsonData = {
    metadata: {
      contractAddress: args.contractAddress,
      poolName: args.poolName,
      week: args.week,
      totalRewards: formatUnits(args.totalPlatformRewards, 18),
    },
    values: Object.fromEntries(
      orderedStakers.map(([address, { totalPlatformRewardsEarned }]) => [
        address,
        formatUnits(totalPlatformRewardsEarned, 18),
      ]),
    ),
  };
  const json = JSON.stringify(jsonData, null, 2);

  const filePath = path.join(
    'public',
    'reports',
    args.week.number.toString().padStart(3, '0'),
  );

  await fs.promises.mkdir(filePath, { recursive: true });
  await fs.promises.writeFile(
    `${filePath}/${args.contractAddress}.md`,
    markdown,
  );
  await fs.promises.writeFile(`${filePath}/${args.contractAddress}.json`, json);
})();
