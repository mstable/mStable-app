import { parseUnits } from 'ethers/utils';

import {
  mod,
  generateReport,
  PlatformEarningsReport,
} from '../../scripts/platformRewards';

describe('platformRewards', () => {
  const acct1 = {
    account: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
    start: {
      stakingRewards: [
        {
          account: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '0',
          amountPerTokenPaid: '942745067740930460',
        },
      ],
      stakingBalances: [
        {
          account: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '670796066806545446773',
        },
      ],
      claimRewardTransactions: [
        {
          sender: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '1483553565339505632',
        },
        {
          sender: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '62245384389833961107',
        },
      ],
    },
    end: {
      stakingRewards: [
        {
          account: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '0',
          amountPerTokenPaid: '1053685299841381660',
        },
      ],
      stakingBalances: [
        {
          account: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '670796066806545446773',
        },
      ],
      claimRewardTransactions: [
        {
          sender: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '1483553565339505632',
        },
        {
          sender: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '74418271343587920849',
        },
        {
          sender: '0x9b0c19000a8631c1f555bb365bde308384e4f2ff',
          amount: '62245384389833961107',
        },
      ],
    },
  };

  const acct2 = {
    account: '0xa24ebe62c3e7167c87c6915081815a6b82d45a44',
    start: {
      stakingRewards: [
        {
          account: '0xa24ebe62c3e7167c87c6915081815a6b82d45a44',
          amount: '0',
          amountPerTokenPaid: '899170748243924492',
        },
      ],
      stakingBalances: [
        {
          account: '0xa24ebe62c3e7167c87c6915081815a6b82d45a44',
          amount: '20126392269192379627',
        },
      ],
      claimRewardTransactions: [],
    },
    end: {
      stakingRewards: [
        {
          account: '0xa24ebe62c3e7167c87c6915081815a6b82d45a44',
          amount: '3170009099288838361',
          amountPerTokenPaid: '1056675831961347370',
        },
      ],
      stakingBalances: [
        {
          account: '0xa24ebe62c3e7167c87c6915081815a6b82d45a44',
          amount: '66540751583664992488',
        },
      ],
      claimRewardTransactions: [],
    },
  };

  const baseDataStart = {
    address: '0x881c72d1e6317f10a1cdcbe05040e7564e790c80',
    lastUpdateTime: 1597062435,
    periodFinish: 1597667235,
    rewardPerTokenStored: '951861401240759361',
    rewardRate: '24935027058662971',
    totalSupply: '120526799499544953668794',
  };

  const baseDataEnd = {
    address: '0x881c72d1e6317f10a1cdcbe05040e7564e790c80',
    lastUpdateTime: 1597666355,
    periodFinish: 1598271155,
    rewardPerTokenStored: '1140907073520116687',
    rewardRate: '24837868425614456',
    totalSupply: '40758291192807970578327',
  };

  const DATA = {
    oneStaker: {
      start: {
        stakingRewardsContracts: [
          {
            ...baseDataStart,
            stakingRewards: [...acct1.start.stakingRewards],
            stakingBalances: [...acct1.start.stakingBalances],
            claimRewardTransactions: [...acct1.start.claimRewardTransactions],
          },
        ],
      },
      end: {
        stakingRewardsContracts: [
          {
            ...baseDataEnd,
            stakingRewards: [...acct1.end.stakingRewards],
            stakingBalances: [...acct1.end.stakingBalances],
            claimRewardTransactions: [...acct1.end.claimRewardTransactions],
          },
        ],
      },
    },
    twoStakers: {
      start: {
        stakingRewardsContracts: [
          {
            ...baseDataStart,
            stakingRewards: [
              ...acct1.start.stakingRewards,
              ...acct2.start.stakingRewards,
            ],
            stakingBalances: [
              ...acct1.start.stakingBalances,
              ...acct2.start.stakingBalances,
            ],
            claimRewardTransactions: [
              ...acct1.start.claimRewardTransactions,
              ...acct2.start.claimRewardTransactions,
            ],
          },
        ],
      },
      end: {
        stakingRewardsContracts: [
          {
            ...baseDataEnd,
            stakingRewards: [
              ...acct1.end.stakingRewards,
              ...acct2.end.stakingRewards,
            ],
            stakingBalances: [
              ...acct1.end.stakingBalances,
              ...acct2.end.stakingBalances,
            ],
            claimRewardTransactions: [
              ...acct1.end.claimRewardTransactions,
              ...acct2.end.claimRewardTransactions,
            ],
          },
        ],
      },
    },
  };

  const mockFetchAllData = ({
    start,
    end,
  }: {
    start: any;
    end: any;
  }): ReturnType<typeof jest['spyOn']> => {
    const spy = jest.spyOn(mod, 'fetchAllData');

    spy.mockImplementation(async function* mock() {
      // It's assumed that the function is first called for the start
      // data, and then for the end data.
      yield start;
      yield end;
    });

    return spy;
  };

  const args = {
    fullOutput: true,
    token: {
      address: '0xba100000625a3754423978a60c9317c58a424e3d',
      symbol: 'BAL',
      decimals: 18,
    },
    allocations: {
      '0x881c72d1e6317f10a1cdcbe05040e7564e790c80': parseUnits('1000', 18),
    },
    poolAddresses: ['0x881c72d1e6317f10a1cdcbe05040e7564e790c80'],
    tranche: {
      number: 2,
      start: { timestamp: 1597062435, blockNumber: 0 },
      end: { timestamp: 1597666355, blockNumber: 0 },
    },
  };

  const pool = '0x881c72d1e6317f10a1cdcbe05040e7564e790c80';

  it('one staker', async () => {
    mockFetchAllData(DATA.oneStaker);

    jest.spyOn(mod, 'parseArgs').mockImplementation(async () => args);

    const {
      data: { mtaEarnings, rewards, totalRewards },
    } = (await generateReport()) as {
      data: PlatformEarningsReport;
    };

    expect(totalRewards).toEqual('1000.0');

    // Only one staker; should get all rewards
    expect(rewards[acct1.account]).toEqual('1000.0');

    const totalMtaEarningsPerPoolAtEnd = parseFloat(
      mtaEarnings.totalMtaEarningsPerPoolAtEnd[pool],
    );
    const totalMtaEarningsPerPoolAtStart = parseFloat(
      mtaEarnings.totalMtaEarningsPerPoolAtStart[pool],
    );
    const totalMtaEarningsForTranche =
      totalMtaEarningsPerPoolAtEnd - totalMtaEarningsPerPoolAtStart;

    expect(totalMtaEarningsForTranche.toFixed(6)).toEqual('246.869976');

    const acct1Earned =
      mtaEarnings.mtaEarningsPerStakerPerPool[pool][acct1.account];

    expect(acct1Earned).toEqual('246.869975664414364739');
  });

  it('two stakers', async () => {
    mockFetchAllData(DATA.twoStakers);

    const {
      data: { mtaEarnings, rewards },
    } = (await generateReport()) as {
      data: PlatformEarningsReport;
    };

    // Two stakers
    expect(rewards[acct1.account]).toEqual('909.755284255382779');
    expect(rewards[acct2.account]).toEqual('90.24471574461722');

    const acct1Earned =
      mtaEarnings.mtaEarningsPerStakerPerPool[pool][acct1.account];
    const acct2Earned =
      mtaEarnings.mtaEarningsPerStakerPerPool[pool][acct2.account];

    expect(acct1Earned).toEqual('246.869975664414364739');
    expect(acct2Earned).toEqual('24.48868521599227855');

    // Ratio should be the same, i.e. the rewards are distributed according to
    // the earned amount
    expect(
      (parseFloat(acct1Earned) / parseFloat(rewards[acct1.account])).toFixed(6),
    ).toEqual('0.271359');
    expect(
      (parseFloat(acct2Earned) / parseFloat(rewards[acct2.account])).toFixed(6),
    ).toEqual('0.271359');
  });
});

export {};
