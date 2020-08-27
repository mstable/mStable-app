import { BigNumber } from 'ethers/utils';
import { BigDecimal } from '../../../web3/BigDecimal';

const DAYS_IN_YEAR = 365;

export const calculateEarnings = (
  amount: string | null,
  apy: BigNumber | undefined,
  days: number,
): BigNumber => {
  const amountBigDecimal = BigDecimal.maybeParse(amount, 18);

  if (amountBigDecimal && apy) {
    return amountBigDecimal
      .mulTruncate(apy)
      .exact.mul(days)
      .div(DAYS_IN_YEAR);
  }

  return new BigNumber('0');
};
