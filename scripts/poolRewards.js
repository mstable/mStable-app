#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies,@typescript-eslint/no-var-requires,no-console */

require('./utils/init');
const { BigNumber, formatUnits } = require('ethers/utils');
const gql = require('graphql-tag');
const { getApolloClient } = require('./utils/getApolloClient');
const { argv } = require('yargs');

let { contractAddress, start, end, totalPlatformRewards } = argv;

if (!(start && end)) {
  throw new Error(
    'Missing "start" and "end" arguments (timestamps in seconds)',
  );
}

if (!contractAddress) {
  throw new Error(
    'Missing "contractAddress" argument (staking rewards contract address)',
  );
}

if (!totalPlatformRewards) {
  throw new Error(
    'Missing "totalPlatformRewards" argument (exact number of platform rewards allocated)',
  );
}

const SCALE = new BigNumber((1e18).toString());
const PERCENT_SCALE = new BigNumber((1e16).toString());

totalPlatformRewards = new BigNumber(totalPlatformRewards);

const blockQuery = gql`
  query BlockTimestamp($start: BigInt!, $end: BigInt!) @api(name: blocks) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $start, timestamp_lt: $end }
    ) {
      number
    }
  }
`;

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
      platformRewardPerTokenStored
      platformRewardRate
      rewardPerTokenStored
      rewardRate
      totalStakingRewards
      totalSupply

      stakingRewards(first: 1000) {
        amount
        account
        amountPerTokenPaid
      }

      stakingBalances(first: 1000) {
        amount
        account
      }

      claimRewardTransactions(
        first: 1000
        orderBy: timestamp
        orderDirection: asc
        where: { timestamp_gt: $start, timestamp_lt: $end }
      ) {
        amount
        sender
      }
    }
  }
`;

(async () => {
  const client = getApolloClient();

  // const {
  //   data: {
  //     blocks: [block],
  //   },
  // } = await client.query({
  //   query: blockQuery,
  //   variables: { start: end, end: end + 30 },
  // });
  const block = { number: 10632136 }

  let {
    data: {
      stakingRewardsContracts: [
        {
          claimRewardTransactions,
          lastUpdateTime,
          periodFinish,
          platformRewardPerTokenStored,
          platformRewardRate,
          rewardPerTokenStored,
          rewardRate,
          totalStakingRewards,
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

  platformRewardPerTokenStored = new BigNumber(platformRewardPerTokenStored);
  platformRewardRate = new BigNumber(platformRewardRate);
  rewardPerTokenStored = new BigNumber(rewardPerTokenStored);
  rewardRate = new BigNumber(rewardRate);
  totalStakingRewards = new BigNumber(totalStakingRewards);
  totalTokens = new BigNumber(totalTokens);

  const rewardPerToken = (() => {
    if (totalTokens.eq(0)) {
      // If there is no StakingToken liquidity, avoid div(0)
      return rewardPerTokenStored;
    }

    // const lastTimeRewardApplicable = Math.min(
    //   periodFinish,
    //   Math.floor(Date.now() / 1e3),
    // );
    const lastTimeRewardApplicable = end;

    const timeSinceLastUpdate = lastTimeRewardApplicable - lastUpdateTime;

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

    if (!stakingBalance) return;

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
  // 15080704365079364860800
  console.log(totalEarnedForAllStakers.toString());
  return;

  Object.keys(stakers).forEach(staker => {
    const current = stakers[staker];

    const percentageOfPool = current.totalEarned
      .mul(SCALE)
      .div(totalEarnedForAllStakers);

    stakers[staker] = {
      ...current,
      percentageOfPool,
    };
  });

  console.log(
    JSON.stringify(
      {
        totalEarnedForAllStakers: formatUnits(totalEarnedForAllStakers, 18),
        totalPlatformRewards: formatUnits(totalPlatformRewards, 18),
        totalStakingRewards: formatUnits(totalStakingRewards, 18),
        stakers: Object.entries(stakers).map(
          ([staker, { totalEarned, percentageOfPool }]) => ({
            staker,
            totalEarned: formatUnits(totalEarned, 18),
            percentageOfPool: formatUnits(percentageOfPool, 16),
          }),
        ),
      },
      null,
      2,
    ),
  );
})();
