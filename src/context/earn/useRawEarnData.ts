import { useBlockPollingSubscription } from '../DataProvider/subscriptions'
import { useAccount } from '../AccountProvider'
import { useStakingRewardsContractsLazyQuery } from '../../graphql/ecosystem'
import { RawEarnData } from './types'
import { useCurveBalances } from './CurveProvider'

export const useRawEarnData = (): RawEarnData => {
  const account = useAccount()

  const stakingRewardsContractsSub = useBlockPollingSubscription(useStakingRewardsContractsLazyQuery, {
    variables: { account: account ?? null },
    fetchPolicy: 'cache-and-network',
  })

  const curveBalances = useCurveBalances()

  return {
    curveBalances,
    rawStakingRewardsContracts: stakingRewardsContractsSub.data,
  }
}
