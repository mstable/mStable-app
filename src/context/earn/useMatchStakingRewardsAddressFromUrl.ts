import { useMemo } from 'react';
import { isHexString } from 'ethers/utils';

import { useStakingRewardsContracts } from './EarnDataProvider';

export const useMatchStakingRewardsAddressFromUrl = (
  slugOrAddress: string | undefined,
): string | false | undefined => {
  const stakingRewardsContracts = useStakingRewardsContracts();

  return useMemo(() => {
    if (!slugOrAddress) {
      return false;
    }

    if (isHexString(slugOrAddress)) {
      return slugOrAddress;
    }

    if (Object.keys(stakingRewardsContracts).length === 0) {
      return undefined;
    }

    const found = Object.values(stakingRewardsContracts).find(
      item => item.earnUrl === `/earn/${slugOrAddress}`,
    );

    return found?.address ?? false;
  }, [slugOrAddress, stakingRewardsContracts]);
};
