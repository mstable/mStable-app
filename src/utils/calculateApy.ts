import type { BigNumber } from 'ethers';

import type { BigDecimal } from '../web3/BigDecimal';

const SECONDS_IN_DAY = 60 * 60 * 24;

export const calculateApy = (
  stakingTokenPrice?: number,
  rewardsTokenPrice?: number,
  rewardRate?: BigNumber,
  totalSupply?: BigDecimal,
): number | undefined => {
  if (!(stakingTokenPrice && rewardsTokenPrice && rewardRate && totalSupply))
    return;

  const rewardRateSimple = parseInt(rewardRate.toString()) / 1e18;

  const rewardPerDayPerToken =
    (rewardRateSimple * SECONDS_IN_DAY * rewardsTokenPrice) /
    totalSupply.simple;

  return (rewardPerDayPerToken / stakingTokenPrice) * 365;
};
