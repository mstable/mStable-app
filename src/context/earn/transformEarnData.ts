import { BigNumber } from 'ethers/utils';
import {
  EarnData,
  NormalizedPool,
  RawEarnData,
  StakingRewardsContract,
  StakingRewardsContractsMap,
  SyncedEarnData,
} from './types';
import { BigDecimal } from '../../web3/BigDecimal';
import { CURVE_MUSD_EARN_URL, CURVE_ADDRESSES } from './CurveProvider';
import { StakingRewardsContractType } from '../../graphql/ecosystem';
import { BlockTimestamp, Platforms } from '../../types';

const BAL_ADDRESS = '0xba100000625a3754423978a60c9317c58a424e3d';
const BAL_REWARDS_EXCEPTIONS: string[] = [
  '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4', // MTA/mUSD 95/5
];

const EXPIRED_POOLS: string[] = [
  '0x25970282aac735cd4c76f30bfb0bf2bc8dad4e70', // MTA/mUSD 80/20
  '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4', // MTA/mUSD 95/5
];

const currentTime = new BigNumber(Math.floor(Date.now() / 1e3));

const getStakingRewardsContractsMap = (
  { pools, block24hAgo, tokenPrices, curveJsonData }: SyncedEarnData,
  { rawStakingRewardsContracts, curveBalances }: RawEarnData,
): StakingRewardsContractsMap => {
  const curvePool = Object.values(pools.current).find(
    p => p.platform === Platforms.Curve,
  );

  return Object.fromEntries(
    (rawStakingRewardsContracts?.current || [])
      .filter(
        item =>
          pools.current[item.stakingToken.address] ||
          (item.address === CURVE_ADDRESSES.MTA_STAKING_REWARDS && curvePool),
      )
      .map(data => {
        const {
          duration,
          address,
          lastUpdateTime,
          periodFinish,
          rewardPerTokenStored,
          rewardRate,
        } = data;
        let {
          platformRewardPerTokenStored,
          platformRewardRate,
          platformToken,
          type,
          totalPlatformRewards,
        } = data;
        const isCurve = address === CURVE_ADDRESSES.MTA_STAKING_REWARDS;
        const receivesBAL = BAL_REWARDS_EXCEPTIONS.includes(address);

        const pool: NormalizedPool = isCurve
          ? (curvePool as NormalizedPool)
          : pools.current[data.stakingToken.address];

        // These pools receive BAL rewards, but are not
        // StakingRewardsWithPlatformToken contracts; however, they should be
        // displayed as if they were, so that it's clear that BAL rewards
        // will be received in these pools.
        if (receivesBAL) {
          platformToken = {
            symbol: 'BAL',
            address: BAL_ADDRESS,
            decimals: 18,
          } as typeof platformToken;
        } else if (isCurve) {
          platformToken = {
            symbol: 'CRV',
            address: CURVE_ADDRESSES.CRV_TOKEN,
            decimals: 18,
          } as typeof platformToken;
        }

        if (receivesBAL || isCurve) {
          type = StakingRewardsContractType.StakingRewardsWithPlatformToken;
          platformRewardPerTokenStored = '0';
          platformRewardRate = '0';
          totalPlatformRewards = '0';
        }

        const stakingToken = {
          ...data.stakingToken,
          totalSupply: BigDecimal.fromMetric(data.stakingToken.totalSupply),
          price: tokenPrices[data.stakingToken.address],
        };

        const rewardsToken = {
          ...data.rewardsToken,
          totalSupply: BigDecimal.fromMetric(data.rewardsToken.totalSupply),
          price: tokenPrices[data.rewardsToken.address],
        };

        const stakingReward = {
          amount: new BigDecimal(
            data.stakingRewards[0]?.amount || 0,
            rewardsToken.decimals,
          ),
          amountPerTokenPaid: new BigDecimal(
            data.stakingRewards[0]?.amountPerTokenPaid || 0,
            rewardsToken.decimals,
          ),
        };

        const stakingBalance =
          isCurve && curveBalances.stakingBalance
            ? curveBalances.stakingBalance
            : new BigDecimal(
                data.stakingBalances[0]?.amount || 0,
                stakingToken.decimals,
              );

        const totalSupply = new BigDecimal(
          data.totalSupply,
          stakingToken.decimals,
        );

        const totalStakingRewards = new BigDecimal(
          data.totalStakingRewards,
          rewardsToken.decimals,
        );
        const totalRemainingRewards = new BigDecimal(
          currentTime.gt(periodFinish)
            ? 0
            : new BigNumber(periodFinish).sub(currentTime).mul(rewardRate),
          rewardsToken.decimals,
        );

        const stakingBalancePercentage = BigDecimal.parse(
          (stakingBalance.exact.gt(0) && totalSupply.exact.gt(0)
            ? stakingBalance.simple / totalSupply.simple
            : 0
          ).toFixed(20),
          stakingToken.decimals,
        );

        const {
          rewardPerTokenStored: rewardPerTokenStored24hAgo,
          platformRewardPerTokenStored: platformRewardPerTokenStored24hAgo,
        } =
          rawStakingRewardsContracts?.historic?.find(
            item => item.address === address,
          ) || {};

        const pool24hAgo = pools.historic?.[stakingToken.address];

        const earnUrl = isCurve
          ? CURVE_MUSD_EARN_URL
          : `/earn/${pool.platform.toLowerCase()}-${pool.tokens
              .map(
                token =>
                  `${token.symbol.toLowerCase()}${
                    token.ratio ? `-${token.ratio}` : ''
                  }`,
              )
              .sort()
              .join('-')}`;

        const title = `${pool.platform} ${pool.tokens
          .map(token => token.symbol)
          .join('/')}${pool.tokens
          .filter(t => t.ratio)
          .map(token => token.ratio)
          .join('/')}`;

        const expired = EXPIRED_POOLS.includes(address);

        const curve = isCurve
          ? {
              rewardsEarned: curveBalances.claimableMTA,
              platformRewardsEarned: curveBalances.claimableCRV,
            }
          : undefined;

        const result: StakingRewardsContract = {
          address,
          curve,
          earnUrl,
          title,
          pool,
          pool24hAgo,
          type,
          duration,
          lastUpdateTime,
          periodFinish,
          expired,
          stakingToken,
          rewardsToken,
          rewardRate: new BigNumber(rewardRate),
          rewardPerTokenStoredNow: new BigNumber(rewardPerTokenStored),
          rewardPerTokenStored24hAgo: rewardPerTokenStored24hAgo
            ? new BigNumber(rewardPerTokenStored24hAgo)
            : undefined,
          totalSupply,
          totalStakingRewards,
          totalRemainingRewards,
          stakingBalance,
          stakingBalancePercentage,
          stakingReward,
          apy: {
            waitingForData: true,
          },
          ...(platformToken &&
          platformRewardRate &&
          platformRewardPerTokenStored &&
          totalPlatformRewards
            ? {
                platformRewards: {
                  platformToken: {
                    ...platformToken,
                    totalSupply: BigDecimal.maybeFromMetric(
                      platformToken.totalSupply,
                    ) as BigDecimal,
                    price: tokenPrices[platformToken.address],
                  },
                  platformRewardPerTokenStoredNow: new BigNumber(
                    platformRewardPerTokenStored,
                  ),
                  platformRewardPerTokenStored24hAgo: platformRewardPerTokenStored24hAgo
                    ? new BigNumber(platformRewardPerTokenStored24hAgo)
                    : undefined,
                  platformRewardRate: new BigNumber(platformRewardRate),
                  platformReward: {
                    amount: new BigDecimal(
                      data.platformRewards[0]?.amount || 0,
                      platformToken.decimals,
                    ),
                    amountPerTokenPaid: new BigDecimal(
                      data.platformRewards[0]?.amountPerTokenPaid || 0,
                      platformToken.decimals,
                    ),
                  },
                  totalPlatformRewards: new BigDecimal(
                    totalPlatformRewards,
                    platformToken.decimals,
                  ),
                  totalRemainingPlatformRewards: new BigDecimal(
                    currentTime.gt(periodFinish)
                      ? 0
                      : new BigNumber(periodFinish)
                          .sub(currentTime)
                          .mul(platformRewardRate),
                    platformToken.decimals,
                  ),
                },
              }
            : undefined),
        };

        const apyValue: number | undefined = (() => {
          const stakingTokenPrice = stakingToken?.price?.simple;
          const rewardsTokenPrice = rewardsToken?.price?.simple;

          // Prerequisites
          const hasPrerequisites =
            block24hAgo &&
            result.rewardPerTokenStored24hAgo &&
            stakingTokenPrice &&
            rewardsTokenPrice;

          if (!hasPrerequisites) {
            return undefined;
          }

          // deltaR = rewardPerTokenStored - rewardPerTokenStored24hAgo
          const deltaR = parseFloat(
            result.rewardPerTokenStoredNow
              .sub(result.rewardPerTokenStored24hAgo as BigNumber)
              .toString(),
          );

          // deltaT = currentTime - block24hAgo.timestamp
          const deltaT = currentTime
            .sub((block24hAgo as BlockTimestamp).timestamp)
            .toNumber();

          // gains = mtaPrice * deltaR
          const gains = rewardsTokenPrice * deltaR;

          // percentage = gains / stakingTokenPrice
          const percentage = gains / stakingTokenPrice;

          // apy = percentage * (seconds in year / deltaT)
          return percentage * ((365 * 24 * 60 * 60) / deltaT);
        })();

        const withApy = {
          ...result,
          apy: {
            value: apyValue
              ? new BigDecimal(apyValue.toString(), 18)
              : undefined,
            waitingForData: !rewardPerTokenStored24hAgo,
            yieldApy:
              isCurve && curveJsonData?.yieldApy?.toString
                ? BigDecimal.maybeParse(curveJsonData.yieldApy.toString(), 18)
                : undefined,
          },
        };

        return [address, withApy];
      }),
  );
};

export const transformEarnData = (
  syncedEarnData: SyncedEarnData,
  rawEarnData: RawEarnData,
): EarnData => ({
  stakingRewardsContractsMap: getStakingRewardsContractsMap(
    syncedEarnData,
    rawEarnData,
  ),
  tokenPricesMap: syncedEarnData.tokenPrices,
  block24hAgo: syncedEarnData.block24hAgo,
  merkleDrops: syncedEarnData.merkleDrops,
});
