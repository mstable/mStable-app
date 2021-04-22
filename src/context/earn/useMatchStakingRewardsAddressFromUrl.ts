import { useMemo } from 'react'
import { utils } from 'ethers'

import { useStakingRewardsContracts } from './EarnDataProvider'

export const useMatchStakingRewardsAddressFromUrl = (slugOrAddress: string | undefined): string | false | undefined => {
  const stakingRewardsContracts = useStakingRewardsContracts()

  return useMemo(() => {
    if (!slugOrAddress) {
      return false
    }

    if (utils.isHexString(slugOrAddress)) {
      return slugOrAddress
    }

    if (Object.keys(stakingRewardsContracts).length === 0) {
      return undefined
    }

    const found = Object.values(stakingRewardsContracts).find(item => item.earnUrl.includes(slugOrAddress))

    return found?.address ?? false
  }, [slugOrAddress, stakingRewardsContracts])
}
