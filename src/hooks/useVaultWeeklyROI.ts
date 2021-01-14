import { useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { fetchCoingeckoPrices } from '../utils/fetchCoingeckoPrices';
import { BigDecimal } from '../web3/BigDecimal';
import { ADDRESSES_BY_NETWORK } from '../constants';

export const useVaultWeeklyROI = (): {
  fetching?: boolean;
  baseValue: number;
  boostedValue: number;
} => {
  const [mtaPrice, setMtaPrice] = useState<number>();

  useEffectOnce(() => {
    fetchCoingeckoPrices([ADDRESSES_BY_NETWORK[1].MTA]).then(result => {
      const price = result?.[ADDRESSES_BY_NETWORK[1].MTA]?.usd;
      if (price) {
        setMtaPrice(price);
      }
    });
  });

  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const rewardPerTokenStored = vault?.rewardPerTokenStored;
  const stakingTokenPrice = savingsContract?.latestExchangeRate;

  return useMemo(() => {
    if (rewardPerTokenStored && stakingTokenPrice && mtaPrice) {
      const rewardPerTokenStoredSimple = new BigDecimal(rewardPerTokenStored)
        .simple;

      const baseValue =
        (rewardPerTokenStoredSimple * mtaPrice * 100) /
        stakingTokenPrice.rate.simple;

      // TODO use user's boost
      return { baseValue, boostedValue: baseValue * 3 };
    }

    return { baseValue: 0, boostedValue: 0, fetching: true };
  }, [mtaPrice, rewardPerTokenStored, stakingTokenPrice]);
};
