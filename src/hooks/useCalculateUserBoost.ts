import { useMemo } from 'react';
import { ADDRESSES } from '../constants';
import { BoostedSavingsVaultState } from '../context/DataProvider/types';
import { useTokenSubscription } from '../context/TokensProvider';
import { calculateBoost, calculateBoostImusd, getCoeffs } from '../utils/boost';

export const useCalculateUserBoost = (
  vault?: BoostedSavingsVaultState,
): number => {
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);

  const vMTABalance = vMTA?.balance;
  const rawBalance = vault?.account?.rawBalance;

  const boost = useMemo<number>(() => {
    if (!vault) return 1;
    const coeffs = getCoeffs(vault);
    const { isImusd } = vault;
    return isImusd || !coeffs
      ? calculateBoostImusd(rawBalance, vMTABalance)
      : calculateBoost(...coeffs, rawBalance, vMTABalance);
  }, [rawBalance, vMTABalance, vault]);

  // Fallback to 1x multiplier
  return boost ?? 1;
};
