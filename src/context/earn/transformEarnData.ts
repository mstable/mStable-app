import { BigNumber } from 'ethers'

import type { EarnData, NormalizedPool, RawEarnData, StakingRewardsContract, StakingRewardsContractsMap, SyncedEarnData } from './types'
import { BigDecimal } from '../../web3/BigDecimal'
import { CURVE_MUSD_EARN_URL, CURVE_ADDRESSES } from './CurveProvider'
import { StakingRewardsContractType } from '../../graphql/ecosystem'
import { Platforms } from '../../types'

const BAL_ADDRESS = '0xba100000625a3754423978a60c9317c58a424e3d'
const BAL_REWARDS_EXCEPTIONS: Set<String> = new Set([
  '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4', // MTA/mUSD 95/5
])

const EXPIRED_POOLS: Set<string> = new Set([
  '0x25970282aac735cd4c76f30bfb0bf2bc8dad4e70', // MTA/mUSD 80/20
  '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4', // MTA/mUSD 95/5
  '0xf4a7d2d85f4ba11b5c73c35e27044c0c49f7f027', // MTA/mUSD 5/95
  '0x881c72d1e6317f10a1cdcbe05040e7564e790c80', // USDC/mUSD 50:50
  '0xe6e6e25efda5f69687aa9914f8d750c523a1d261', // Curve 3pool/mUSD
  '0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb', // Balancer WETH/mUSD
  '0x6de3a957b0344e6adeeab4648b02108f35651fb5', // Sushi mBTC/WETH
])

const currentTime = BigNumber.from(Math.floor(Date.now() / 1e3))

const getStakingRewardsContractsMap = (
  { pools, tokenPrices }: SyncedEarnData,
  { rawStakingRewardsContracts, curveBalances }: RawEarnData,
): StakingRewardsContractsMap => {
  const curvePool = Object.values(pools).find(p => p.platform === Platforms.Curve)

  return Object.fromEntries(
    (rawStakingRewardsContracts?.stakingRewardsContracts ?? [])
      .filter(item => pools[item.stakingToken.address] || (item.address === CURVE_ADDRESSES.MTA_STAKING_REWARDS && curvePool))
      .map(data => {
        const { duration, address, lastUpdateTime, periodFinish, rewardPerTokenStored, rewardRate } = data
        let { platformRewardPerTokenStored, platformRewardRate, platformToken, type, totalPlatformRewards } = data
        const isCurve = address === CURVE_ADDRESSES.MTA_STAKING_REWARDS
        const receivesBAL = BAL_REWARDS_EXCEPTIONS.has(address)

        const pool: NormalizedPool = isCurve ? (curvePool as NormalizedPool) : pools[data.stakingToken.address]

        // These pools receive BAL rewards, but are not
        // StakingRewardsWithPlatformToken contracts; however, they should be
        // displayed as if they were, so that it's clear that BAL rewards
        // will be received in these pools.
        if (receivesBAL) {
          platformToken = {
            symbol: 'BAL',
            address: BAL_ADDRESS,
            decimals: 18,
          } as typeof platformToken
        } else if (isCurve) {
          platformToken = {
            symbol: 'CRV',
            address: CURVE_ADDRESSES.CRV_TOKEN,
            decimals: 18,
          } as typeof platformToken
        }

        if (receivesBAL || isCurve) {
          type = StakingRewardsContractType.StakingRewardsWithPlatformToken
          platformRewardPerTokenStored = '0'
          platformRewardRate = '0'
          totalPlatformRewards = '0'
        }

        const stakingToken = {
          ...data.stakingToken,
          totalSupply: BigDecimal.fromMetric(data.stakingToken.totalSupply),
          price: tokenPrices[data.stakingToken.address],
        }

        const rewardsToken = {
          ...data.rewardsToken,
          totalSupply: BigDecimal.fromMetric(data.rewardsToken.totalSupply),
          price: tokenPrices[data.rewardsToken.address],
        }

        const stakingReward = {
          amount: new BigDecimal(data.stakingRewards[0]?.amount || 0, rewardsToken.decimals),
          amountPerTokenPaid: new BigDecimal(data.stakingRewards[0]?.amountPerTokenPaid || 0, rewardsToken.decimals),
        }

        const stakingBalance =
          isCurve && curveBalances.stakingBalance
            ? curveBalances.stakingBalance
            : new BigDecimal(data.stakingBalances[0]?.amount || 0, stakingToken.decimals)

        const totalSupply = new BigDecimal(data.totalSupply, stakingToken.decimals)

        const totalStakingRewards = new BigDecimal(data.totalStakingRewards, rewardsToken.decimals)
        const totalRemainingRewards = new BigDecimal(
          currentTime.gt(periodFinish) ? 0 : BigNumber.from(periodFinish).sub(currentTime).mul(rewardRate),
          rewardsToken.decimals,
        )

        const stakingBalancePercentage = BigDecimal.parse(
          (stakingBalance.exact.gt(0) && totalSupply.exact.gt(0) ? stakingBalance.simple / totalSupply.simple : 0).toFixed(20),
          stakingToken.decimals,
        )

        const earnUrl = isCurve
          ? CURVE_MUSD_EARN_URL
          : `/earn/${pool.platform.toLowerCase()}-${pool.tokens
              .map(token => `${token.symbol.toLowerCase()}${token.ratio ? `-${token.ratio}` : ''}`)
              .sort()
              .join('-')}`

        const title = `${pool.platform} ${pool.tokens.map(token => token.symbol).join('/')}${pool.tokens
          .filter(t => t.ratio)
          .map(token => token.ratio)
          .join('/')}`

        const expired = EXPIRED_POOLS.has(address)

        const curve = isCurve
          ? {
              rewardsEarned: curveBalances.claimableMTA,
              platformRewardsEarned: curveBalances.claimableCRV,
            }
          : undefined

        const result: StakingRewardsContract = {
          address,
          curve,
          earnUrl,
          title,
          pool,
          type,
          duration,
          lastUpdateTime,
          periodFinish,
          expired,
          stakingToken,
          rewardsToken,
          rewardRate: BigNumber.from(rewardRate),
          rewardPerTokenStoredNow: BigNumber.from(rewardPerTokenStored),
          totalSupply,
          totalStakingRewards,
          totalRemainingRewards,
          stakingBalance,
          stakingBalancePercentage,
          stakingReward,
          apy: {
            waitingForData: true,
          },
          ...(platformToken && platformRewardRate && platformRewardPerTokenStored && totalPlatformRewards
            ? {
                platformRewards: {
                  platformToken: {
                    ...platformToken,
                    totalSupply: BigDecimal.maybeFromMetric(platformToken.totalSupply) as BigDecimal,
                    price: tokenPrices[platformToken.address],
                  },
                  platformRewardPerTokenStoredNow: BigNumber.from(platformRewardPerTokenStored),
                  platformRewardRate: BigNumber.from(platformRewardRate),
                  platformReward: {
                    amount: new BigDecimal(data.platformRewards[0]?.amount || 0, platformToken.decimals),
                    amountPerTokenPaid: new BigDecimal(data.platformRewards[0]?.amountPerTokenPaid || 0, platformToken.decimals),
                  },
                  totalPlatformRewards: new BigDecimal(totalPlatformRewards, platformToken.decimals),
                  totalRemainingPlatformRewards: new BigDecimal(
                    currentTime.gt(periodFinish) ? 0 : BigNumber.from(periodFinish).sub(currentTime).mul(platformRewardRate),
                    platformToken.decimals,
                  ),
                },
              }
            : undefined),
        }

        const apyValue: number | undefined = (() => {
          const stakingTokenPrice = stakingToken?.price?.simple
          const rewardsTokenPrice = rewardsToken?.price?.simple

          // Prerequisites
          const hasPrerequisites = !!(stakingTokenPrice && rewardsTokenPrice)

          if (!hasPrerequisites || expired) {
            return undefined
          }

          const rewardPerDayPerToken = (parseInt(rewardRate) * 60 * 60 * 24 * rewardsTokenPrice) / totalSupply.simple
          return (rewardPerDayPerToken / stakingTokenPrice) * 365
        })()

        const value = typeof apyValue === 'number' ? new BigDecimal(apyValue.toString().split('.')[0], 18) : undefined

        const withApy = {
          ...result,
          apy: {
            value,
            waitingForData: !rewardPerTokenStored,
          },
        }

        return [address, withApy]
      }),
  )
}

export const transformEarnData = (syncedEarnData: SyncedEarnData, rawEarnData: RawEarnData): EarnData => ({
  stakingRewardsContractsMap: getStakingRewardsContractsMap(syncedEarnData, rawEarnData),
  tokenPricesMap: syncedEarnData.tokenPrices,
  merkleDrops: syncedEarnData.merkleDrops,
})
