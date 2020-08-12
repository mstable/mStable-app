#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies,@typescript-eslint/no-var-requires,no-console */

require('./utils/init');
const { BigNumber, formatUnits, parseUnits } = require('ethers/utils');
const gql = require('graphql-tag');
const { getApolloClient } = require('./utils/getApolloClient');
const { argv } = require('yargs');

let {
  contractAddress,
  start,
  end,
  endBlockNumber,
  totalPlatformRewards,
} = argv;

if (!(start && end)) {
  throw new Error(
    'Missing "start" and "end" arguments (timestamps in seconds)',
  );
}

if (!endBlockNumber) {
  throw new Error('Missing "endBlockNumber" argument');
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

const SCALE = new BigNumber((1e18).toString());

totalPlatformRewards = parseUnits(totalPlatformRewards.toString(), 18);

const query = gql`
  query RewardsTransactions(
    $stakingRewards: ID!
    $start: Int!
    $end: Int!
    $block: Block_height
  ) @api(name: mstable) {
    stakingRewardsContracts(where: { id: $stakingRewards }, block: $block) {
      lastUpdateTime
      periodFinish
      rewardPerTokenStored
      rewardRate
      totalSupply

      stakingRewards(where: { type: REWARD }, first: 1000, block: $block) {
        amount
        account
        amountPerTokenPaid
      }

      stakingBalances(first: 1000, block: $block) {
        amount
        account
      }

      claimRewardTransactions(
        first: 1000
        orderBy: timestamp
        orderDirection: asc
        where: { timestamp_gt: $start, timestamp_lt: $end }
        block: $block
      ) {
        amount
        sender
      }
    }
  }
`;

(async () => {
  const client = getApolloClient();

  const block = { number: parseInt(endBlockNumber) };

  let {
    data: {
      stakingRewardsContracts: [
        {
          claimRewardTransactions,
          lastUpdateTime,
          periodFinish,
          rewardPerTokenStored,
          rewardRate,
          stakingRewards,
          stakingBalances,
          totalSupply: totalTokens,
        },
      ],
    },
  } = await client.query({
    query,
    variables: {
      stakingRewards: contractAddress,
      start,
      end,
      block: { number: parseInt(block.number) },
    },
  });

  rewardPerTokenStored = new BigNumber(rewardPerTokenStored);
  rewardRate = new BigNumber(rewardRate);
  totalTokens = new BigNumber(totalTokens);

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

  const stakers = {};

  let totalEarnedForAllStakers = new BigNumber(0);

  claimRewardTransactions.forEach(({ sender, amount }) => {
    const current = stakers[sender];
    stakers[sender] = {
      ...current,
      claimed: [...((current && current.claimed) || []), new BigNumber(amount)],
    };
  });

  stakingRewards.forEach(({ account, amount, amountPerTokenPaid }) => {
    const current = stakers[account];
    stakers[account] = {
      ...current,
      stakingReward: {
        amount: new BigNumber(amount),
        amountPerTokenPaid: new BigNumber(amountPerTokenPaid),
      },
    };
  });

  stakingBalances.forEach(({ account, amount }) => {
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
      (prev, current) => prev.add(current),
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

    const totalPlatformRewardsEarned = totalPlatformRewards
      .mul(percentageOfPool)
      .div(SCALE);

    stakers[staker] = {
      ...current,
      percentageOfPool,
      totalPlatformRewardsEarned,
    };
  });

  const report = {
    totalEarnedForAllStakers: formatUnits(totalEarnedForAllStakers, 18),
    totalPlatformRewards: formatUnits(totalPlatformRewards, 18),
    stakers: Object.entries(stakers)
      .sort((a, b) =>
        b[1].percentageOfPool.gt(a[1].percentageOfPool) ? 1 : -1,
      )
      .map(
        ([
          staker,
          { totalEarned, totalPlatformRewardsEarned, percentageOfPool },
        ]) => ({
          staker,
          totalEarned: formatUnits(totalEarned, 18),
          totalPlatformRewardsEarned: formatUnits(
            totalPlatformRewardsEarned,
            18,
          ),
          percentageOfPool: formatUnits(percentageOfPool, 16),
        }),
      ),
  };

  const json = JSON.stringify(report, null, 2);

  console.log(json);
})();
