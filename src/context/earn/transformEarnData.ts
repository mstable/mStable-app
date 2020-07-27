import { BigNumber } from 'ethers/utils';
import {
  EarnData,
  RawEarnData,
  StakingRewardsContract,
  SyncedEarnData,
} from './types';
import { BigDecimal } from '../../web3/BigDecimal';
import { annualiseValue } from '../../web3/hooks';
import { StakingRewardsContractType } from '../../graphql/mstable';
import { Platforms } from '../../types';

const getStakingRewardsContractsMap = (
  {
    normalizedPoolsMap,
    // normalizedPoolsMap24hAgo,
    block24hAgo,
    tokenPricesMap,
  }: SyncedEarnData,
  { rawStakingRewardsContracts24hAgo, rawStakingRewardsContracts }: RawEarnData,
): EarnData['stakingRewardsContractsMap'] =>
  rawStakingRewardsContracts.reduce<EarnData['stakingRewardsContractsMap']>(
    (
      _state: EarnData['stakingRewardsContractsMap'],
      {
        duration,
        id: address,
        periodFinish,
        lastUpdateTime,
        platformRewardPerTokenStored,
        platformRewardRate,
        platformRewards: [platformReward],
        platformToken,
        rewardPerTokenStored,
        rewardRate,
        rewardsToken,
        stakingBalances: [stakingBalance],
        stakingRewards: [stakingReward],
        stakingToken,
        totalPlatformRewards,
        totalStakingRewards,
        totalSupply,
        type,
      },
    ) => {
      const {
        rewardPerTokenStored: rewardPerTokenStored24hAgo,
        platformRewardPerTokenStored: platformRewardPerTokenStored24hAgo,
      } =
        rawStakingRewardsContracts24hAgo?.find(item => item.id === address) ||
        {};

      const pool = normalizedPoolsMap[stakingToken.address];
      const pool24hAgo = normalizedPoolsMap[stakingToken.address];
      // TODO restore
      // const pool24hAgo = normalizedPoolsMap24hAgo[stakingToken.address];

      const result: StakingRewardsContract = {
        address,
        earnUrl: `/earn/${pool.platform.toLowerCase()}-${pool.tokens
          .map(token => token.symbol.toLowerCase())
          .sort()
          .join('-')}`,
        title: `${pool.platform} ${pool.tokens
          .map(token => token.symbol)
          .join('/')}`,
        pool,
        pool24hAgo,
        type,
        duration,
        lastUpdateTime,
        periodFinish,
        stakingToken: {
          ...stakingToken,
          totalSupply: BigDecimal.parse(
            stakingToken.totalSupply,
            stakingToken.decimals,
          ),
          price: tokenPricesMap[stakingToken.address],
        },
        rewardsToken: {
          ...rewardsToken,
          price: tokenPricesMap[rewardsToken.address],
        },
        rewardRate: new BigNumber(rewardRate),
        rewardPerTokenStoredNow: new BigNumber(rewardPerTokenStored),
        rewardPerTokenStored24hAgo: new BigNumber(
          rewardPerTokenStored24hAgo || rewardPerTokenStored,
        ),
        totalSupply: new BigDecimal(totalSupply, stakingToken.decimals),
        totalStakingRewards: new BigDecimal(
          totalStakingRewards,
          rewardsToken.decimals,
        ),
        stakingBalance: new BigDecimal(
          stakingBalance?.amount || 0,
          stakingToken.decimals,
        ),
        stakingReward: {
          amount: new BigDecimal(
            stakingReward?.amount || 0,
            rewardsToken.decimals,
          ),
          amountPerTokenPaid: new BigDecimal(
            stakingReward?.amountPerTokenPaid || 0,
            rewardsToken.decimals,
          ),
        },
        ...(type ===
          StakingRewardsContractType.StakingRewardsWithPlatformToken &&
        platformToken &&
        platformRewardRate &&
        platformRewardPerTokenStored &&
        platformRewardPerTokenStored24hAgo &&
        totalPlatformRewards
          ? {
              platformRewards: {
                platformToken: {
                  ...platformToken,
                  price: tokenPricesMap[platformToken.address],
                },
                platformRewardPerTokenStoredNow: new BigNumber(
                  platformRewardPerTokenStored,
                ),
                platformRewardPerTokenStored24hAgo: new BigNumber(
                  platformRewardPerTokenStored24hAgo,
                ),
                platformRewardRate: new BigNumber(platformRewardRate),
                platformReward: {
                  amount: new BigDecimal(
                    platformReward?.amount || 0,
                    platformToken.decimals,
                  ),
                  amountPerTokenPaid: new BigDecimal(
                    platformReward?.amountPerTokenPaid || 0,
                    platformToken.decimals,
                  ),
                },
                totalPlatformRewards: new BigDecimal(
                  totalPlatformRewards,
                  platformToken.decimals,
                ),
              },
            }
          : undefined),
      };

      const rewardsPaidOut = new BigDecimal(
        result.rewardPerTokenStoredNow
          .sub(result.rewardPerTokenStored24hAgo)
          .mul(stakingToken.decimals),
        result.rewardsToken.decimals,
      );

      const platformRewardsPaidOut = result.platformRewards
        ? new BigDecimal(
            result.platformRewards.platformRewardPerTokenStored24hAgo
              .sub(result.platformRewards.platformRewardPerTokenStored24hAgo)
              .mul(stakingToken.decimals),
            result.platformRewards.platformToken.decimals,
          )
        : undefined;

      const combinedRewardsPaidOut = rewardsPaidOut
        ? platformRewardsPaidOut
          ? rewardsPaidOut.add(platformRewardsPaidOut)
          : rewardsPaidOut
        : undefined;

      let profitsGainedFromStakingToken: BigDecimal | undefined;

      // Percentage gained in swap fees over the past 24h
      if (pool.platform === Platforms.Balancer) {
        const { totalSwapVolume, swapFee } = pool[
          Platforms.Balancer
        ] as NonNullable<typeof pool[Platforms.Balancer]>;
        const { totalSwapVolume: totalSwapVolume24hAgo } = pool24hAgo[
          Platforms.Balancer
        ] as NonNullable<typeof pool24hAgo[Platforms.Balancer]>;

        profitsGainedFromStakingToken = totalSwapVolume
          .sub(totalSwapVolume24hAgo)
          .mulTruncate(swapFee.exact)
          .setDecimals(16);
      }

      const stakingTokenIncrease =
        profitsGainedFromStakingToken && tokenPricesMap[stakingToken.address]
          ? profitsGainedFromStakingToken.divPrecisely(
              tokenPricesMap[stakingToken.address],
            )
          : undefined;

      const stakingTokenApy =
        block24hAgo && stakingTokenIncrease
          ? annualiseValue(
              stakingTokenIncrease,
              block24hAgo.timestamp,
            ).setDecimals(16)
          : undefined;

      const combinedRewardsTokensApy =
        block24hAgo && combinedRewardsPaidOut
          ? annualiseValue(
              combinedRewardsPaidOut,
              block24hAgo.timestamp,
            ).setDecimals(16)
          : undefined;

      return {
        ..._state,
        [address]: { ...result, stakingTokenApy, combinedRewardsTokensApy },
      };
    },
    {},
  );

export const transformEarnData = (
  syncedEarnData: SyncedEarnData,
  rawEarnData: RawEarnData,
): EarnData => ({
  stakingRewardsContractsMap: getStakingRewardsContractsMap(
    syncedEarnData,
    rawEarnData,
  ),
  tokenPricesMap: syncedEarnData.tokenPricesMap,
  block24hAgo: syncedEarnData.block24hAgo,
});
