import { BigNumber } from 'ethers/utils';
import { BigDecimal } from '../../../web3/BigDecimal';

const DAYS_IN_YEAR = 365;

export const calculateProfit = (
  amount: BigDecimal,
  apy: BigNumber | undefined,
  days: number,
): BigDecimal => {
  if (apy) {
    const BN = amount
      .mulTruncate(apy)
      .exact.mul(days)
      .div(DAYS_IN_YEAR);

    return new BigDecimal(BN, 18);
  }

  return new BigDecimal('0', 18);
};
