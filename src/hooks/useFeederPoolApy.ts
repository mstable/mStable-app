import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../context/TokensProvider';
import { calculateBoost, MAX_BOOST } from '../utils/boost';
import { calculateApy } from '../utils/calculateApy';
import { ADDRESSES } from '../constants';
import { useMtaPrice, useSelectedMassetPrice } from './usePrice';
import { FetchState } from './useFetchState';

export const useFeederPoolApy = (
  poolAddress: string,
): FetchState<{ base: number; maxBoost: number; userBoost: number }> => {
  const massetState = useSelectedMassetState();
  const massetPrice = useSelectedMassetPrice();
  const mtaPrice = useMtaPrice();
  const vMta = useTokenSubscription(ADDRESSES.vMTA);

  if (!massetState?.feederPools[poolAddress] || !massetPrice || !mtaPrice)
    return { fetching: true };

  const {
    price,
    vault: { rewardRate, totalSupply, account },
  } = massetState.feederPools[poolAddress];

  const stakingTokenPrice = price.simple * massetPrice;

  const base = calculateApy(
    stakingTokenPrice,
    mtaPrice,
    rewardRate,
    totalSupply,
  ) as number;

  const maxBoost = MAX_BOOST * base;

  let userBoost = base;

  if (account && vMta) {
    const boost = calculateBoost(account.rawBalance, vMta.balance);

    if (boost) {
      const boostedRewardRate = rewardRate.mul(boost);

      userBoost = calculateApy(
        stakingTokenPrice,
        mtaPrice,
        boostedRewardRate,
        totalSupply,
      ) as number;
    }
  }

  return {
    value: { base, userBoost, maxBoost },
  };
};
