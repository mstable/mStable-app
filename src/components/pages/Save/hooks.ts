import { createStakingRewardsContext } from '../../../hooks/createStakingRewardsContext'
import { createRewardsEarnedContext } from '../../../hooks/createRewardsEarnedContext'
import { createToggleContext } from '../../../hooks/createToggleContext'

export const [useOnboarding, OnboardingProvider] = createToggleContext(false)
export const [useStakingRewards, StakingRewardsProvider, stakingRewardsCtx] = createStakingRewardsContext()
export const [useRewardsEarned, RewardsEarnedProvider] = createRewardsEarnedContext(stakingRewardsCtx)
