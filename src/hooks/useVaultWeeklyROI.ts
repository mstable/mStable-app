import { useMemo } from 'react';

import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { BigDecimal } from '../web3/BigDecimal';
import { useMtaPrice } from './useMtaPrice';

export const useVaultWeeklyROI = (): {
  fetching?: boolean;
  baseValue: number;
  boostedValue: number;
} => {
  const mtaPrice = useMtaPrice();

  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const rewardPerTokenStored = vault?.rewardPerTokenStored;
  const stakingTokenPrice = savingsContract?.latestExchangeRate?.rate.simple;

  return useMemo(() => {
    if (rewardPerTokenStored && stakingTokenPrice && mtaPrice) {
      const rewardPerTokenStoredSimple = new BigDecimal(rewardPerTokenStored)
        .simple;

      const baseValue =
        (rewardPerTokenStoredSimple * mtaPrice) / stakingTokenPrice;

      // TODO use user's boost
      return { baseValue, boostedValue: baseValue * 3 };
    }

    return { baseValue: 0, boostedValue: 0, fetching: true };
  }, [mtaPrice, rewardPerTokenStored, stakingTokenPrice]);
};
