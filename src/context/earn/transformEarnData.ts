import { BigNumber } from 'ethers/utils';
import {
  EarnData,
  RawEarnData,
  StakingRewardsContract,
  SyncedEarnData,
} from './types';
import { BigDecimal } from '../../web3/BigDecimal';
import { StakingRewardsContractType } from '../../graphql/mstable';

const getStakingRewardsContractsMap = (
  { pools, block24hAgo, tokenPrices }: SyncedEarnData,
  { rawStakingRewardsContracts }: RawEarnData,
): EarnData['stakingRewardsContractsMap'] => {
  const currentTime = new BigNumber(Math.floor(Date.now() / 1e3));
  return (rawStakingRewardsContracts?.current || [])
    .filter(item => pools.current[item.stakingToken.address])
    .reduce<EarnData['stakingRewardsContractsMap']>(
      (_state: EarnData['stakingRewardsContractsMap'], data) => {
        const {
          duration,
          address,
          lastUpdateTime,
          periodFinish,
          platformRewardPerTokenStored,
          platformRewardRate,
          platformToken,
          rewardPerTokenStored,
          rewardRate,
          totalPlatformRewards,
          type,
        } = data;

        const stakingToken = {
          ...data.stakingToken,
          totalSupply: BigDecimal.parse(
            data.stakingToken.totalSupply,
            data.stakingToken.decimals,
          ),
          price: tokenPrices[data.stakingToken.address],
        };

        const rewardsToken = {
          ...data.rewardsToken,
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

        const stakingBalance = new BigDecimal(
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
          ).toFixed(6),
          stakingToken.decimals,
        );

        const {
          rewardPerTokenStored: rewardPerTokenStored24hAgo,
          platformRewardPerTokenStored: platformRewardPerTokenStored24hAgo,
        } =
          rawStakingRewardsContracts?.historic?.find(
            item => item.address === address,
          ) || {};

        const pool = pools.current[stakingToken.address];
        const pool24hAgo = pools.historic[stakingToken.address];

        const earnUrl = `/earn/${pool.platform.toLowerCase()}-${pool.tokens
          .map(token => `${token.symbol.toLowerCase()}-${token.ratio}`)
          .sort()
          .join('-')}`;

        const title = `${pool.platform} ${pool.tokens
          .map(token => token.symbol)
          .join('/')} ${pool.tokens.map(token => token.ratio).join('/')}`;

        const result: StakingRewardsContract = {
          address,
          earnUrl,
          title,
          pool,
          pool24hAgo,
          type,
          duration,
          lastUpdateTime,
          periodFinish,
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
          ...(type ===
            StakingRewardsContractType.StakingRewardsWithPlatformToken &&
          platformToken &&
          platformRewardRate &&
          platformRewardPerTokenStored &&
          totalPlatformRewards
            ? {
                platformRewards: {
                  platformToken: {
                    ...platformToken,
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

        const combinedRewardsTokensApy = (() => {
          const stakingTokenPrice = stakingToken?.price?.simple;
          const rewardsTokenPrice = rewardsToken?.price?.simple;
          const platformTokenPrice =
            result.platformRewards?.platformToken.price?.simple;

          // Prerequisites
          if (
            !(
              block24hAgo &&
              result.rewardPerTokenStored24hAgo &&
              stakingTokenPrice &&
              rewardsTokenPrice &&
              (type ===
              StakingRewardsContractType.StakingRewardsWithPlatformToken
                ? platformTokenPrice &&
                  result.platformRewards?.platformRewardPerTokenStored24hAgo
                : true)
            )
          ) {
            return undefined;
          }

          let gains = 0;
          let platformGains = 0;

          // deltaR = rewardPerTokenStored - rewardPerTokenStored24hAgo
          const deltaR = parseFloat(
            result.rewardPerTokenStoredNow
              .sub(result.rewardPerTokenStored24hAgo)
              .toString(),
          );

          // deltaT = currentTime - block24hAgo.timestamp
          const deltaT = currentTime.sub(block24hAgo.timestamp).toNumber();

          // gains = mtaPrice * deltaR
          gains = rewardsTokenPrice * deltaR;

          if (
            type === StakingRewardsContractType.StakingRewardsWithPlatformToken
          ) {
            const platformRewards = result.platformRewards as NonNullable<
              typeof result['platformRewards']
            >;

            // deltaPlatformR = platformRewardPerTokenStored - platformRewardPerTokenStored24hAgo
            const deltaPlatformR = parseFloat(
              platformRewards.platformRewardPerTokenStoredNow
                .sub(
                  platformRewards.platformRewardPerTokenStored24hAgo as BigNumber,
                )
                .toString(),
            );

            // gains = platformTokenPrice * deltaPlatformR
            platformGains = (platformTokenPrice as number) * deltaPlatformR;
          }

          // percentage = gains / stakingTokenPrice
          const percentage = (gains + platformGains) / stakingTokenPrice;

          // apy = percentage * (seconds in year / deltaT)
          return percentage * ((365 * 24 * 60 * 60) / deltaT);
        })();

        return {
          ..._state,
          [address]: {
            ...result,
            combinedRewardsTokensApy: combinedRewardsTokensApy
              ? new BigDecimal(combinedRewardsTokensApy.toString(), 18)
              : undefined,
          },
        };
      },
      {},
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
});
