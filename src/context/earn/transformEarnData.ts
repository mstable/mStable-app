import { BigNumber } from 'ethers/utils';
import {
  EarnData,
  RawEarnData,
  StakingRewardsContract,
  SyncedEarnData,
} from './types';
import { BigDecimal } from '../../web3/BigDecimal';
import { annualiseSimple } from '../../web3/hooks';
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

        const rewardsPaidOut = result.rewardPerTokenStored24hAgo
          ? new BigDecimal(
              result.rewardPerTokenStoredNow
                .sub(result.rewardPerTokenStored24hAgo)
                .mul(stakingToken.decimals),
              result.rewardsToken.decimals,
            )
          : undefined;

        const platformRewardsPaidOut =
          result.platformRewards &&
          result.platformRewards.platformRewardPerTokenStored24hAgo
            ? new BigDecimal(
                result.platformRewards.platformRewardPerTokenStored24hAgo
                  .sub(
                    result.platformRewards.platformRewardPerTokenStored24hAgo,
                  )
                  .mul(stakingToken.decimals),
                result.platformRewards.platformToken.decimals,
              )
            : undefined;

        const combinedRewardsPaidOut = rewardsPaidOut
          ? platformRewardsPaidOut
            ? rewardsPaidOut.add(platformRewardsPaidOut)
            : rewardsPaidOut
          : undefined;

        // let profitsGainedFromStakingToken: BigDecimal | undefined;
        //
        // Percentage gained in swap fees over the past 24h
        // if (pool.platform === Platforms.Balancer) {
        //   const { totalSwapVolume, swapFee } = pool[
        //     Platforms.Balancer
        //   ] as NonNullable<typeof pool[Platforms.Balancer]>;
        //   const totalSwapVolume24hAgo =
        //     pool24hAgo?.[Platforms.Balancer]?.totalSwapVolume;
        //
        //   profitsGainedFromStakingToken = totalSwapVolume24hAgo
        //     ? totalSwapVolume
        //         .sub(totalSwapVolume24hAgo)
        //         .mulTruncate(swapFee.exact)
        //         .setDecimals(16)
        //     : undefined;
        // }
        //
        // const stakingTokenIncrease =
        //   profitsGainedFromStakingToken && tokenPricesMap[stakingToken.address]
        //     ? profitsGainedFromStakingToken.divPrecisely(
        //         tokenPricesMap[stakingToken.address],
        //       )
        //     : undefined;
        //
        // const stakingTokenApy =
        //   block24hAgo && stakingTokenIncrease
        //     ? BigDecimal.parse(
        //         annualiseSimple(
        //           stakingTokenIncrease.simple,
        //           block24hAgo.timestamp,
        //         ).toString(),
        //         16,
        //       )
        //     : undefined;

        const combinedRewardsTokensApy =
          block24hAgo && combinedRewardsPaidOut
            ? BigDecimal.parse(
                annualiseSimple(
                  combinedRewardsPaidOut.simple,
                  block24hAgo.timestamp,
                ).toString(),
                16,
              )
            : undefined;

        return {
          ..._state,
          [address]: {
            ...result,
            combinedRewardsTokensApy,
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
