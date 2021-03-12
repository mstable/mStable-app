import { useEffect, useMemo, useState } from 'react';
import { ERC20__factory } from '@mstable/protocol/types/generated/factories/ERC20__factory';

import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { useSignerOrInfuraProvider } from '../context/OnboardProvider';
import { useMtaPrice } from './usePrice';

export const useVaultWeeklyROI = (): {
  fetching?: boolean;
  baseValue: number;
  boostedValue: number;
} => {
  // TODO add this field to the Subgraph
  const [totalStaked, setTotalStaked] = useState<number | undefined>();
  const provider = useSignerOrInfuraProvider();

  const mtaPrice = useMtaPrice();

  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const saveAddress = savingsContract?.address;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const totalStakingRewards = vault?.totalStakingRewards.simple;
  const stakingTokenPrice = savingsContract?.latestExchangeRate?.rate.simple;
  const boostMultiplier = vault?.account?.boostMultiplier;

  useEffect(() => {
    if (saveAddress && vaultAddress && !totalStaked) {
      ERC20__factory.connect(saveAddress, provider)
        .balanceOf(vaultAddress)
        .then(balance => {
          setTotalStaked(parseInt(balance.toString(), 10) / 1e18);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [provider, vaultAddress, saveAddress, totalStaked]);

  return useMemo(() => {
    if (totalStakingRewards && stakingTokenPrice && mtaPrice && totalStaked) {
      const mtaPerWeekInUsd = totalStakingRewards * mtaPrice;
      const totalStakedInUsd = stakingTokenPrice * totalStaked;
      const baseValue = (mtaPerWeekInUsd / totalStakedInUsd) * 100;

      return {
        baseValue,
        boostedValue: boostMultiplier ? baseValue * boostMultiplier : baseValue,
      };
    }

    return { baseValue: 0, boostedValue: 0, fetching: true };
  }, [
    boostMultiplier,
    mtaPrice,
    stakingTokenPrice,
    totalStaked,
    totalStakingRewards,
  ]);
};
