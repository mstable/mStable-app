import { createStakingRewardsContext } from '../../../hooks/createStakingRewardsContext'
import { createToggleContext } from '../../../hooks/createToggleContext'

const [useOnboarding, OnboardingProvider] = createToggleContext(false)

const [useStakingRewards, StakingRewardsProvider] = createStakingRewardsContext()

export { useOnboarding, useStakingRewards, OnboardingProvider, StakingRewardsProvider }
