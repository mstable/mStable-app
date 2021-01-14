import { useMemo } from 'react';

import { useSigner } from '../context/OnboardProvider';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { Erc20DetailedFactory } from '../typechain/Erc20DetailedFactory';
import { MassetFactory } from '../typechain/MassetFactory';
import { SavingsContractFactory } from '../typechain/SavingsContractFactory';
import { SavingsContract } from '../typechain/SavingsContract.d';
import { Erc20Detailed } from '../typechain/Erc20Detailed.d';
import { Masset } from '../typechain/Masset.d';
import { truncateAddress } from '../utils/strings';

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

/**
 * @deprecated
 */
export const useErc20Contract = (
  address?: string | null,
): Erc20Detailed | undefined => {
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address
        ? Erc20DetailedFactory.connect(address, signer)
        : undefined,
    [address, signer],
  );
};

/**
 * @deprecated
 */
export const useSelectedMassetContract = (): Masset | undefined => {
  const massetState = useSelectedMassetState();
  const address = massetState?.address;
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address ? MassetFactory.connect(address, signer) : undefined,
    [address, signer],
  );
};

/**
 * @deprecated
 */
export const useSelectedSaveV1Contract = (): SavingsContract | undefined => {
  const massetState = useSelectedMassetState();
  const address = massetState?.savingsContracts.v1?.address;
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address
        ? SavingsContractFactory.connect(address, signer)
        : undefined,
    [address, signer],
  );
};
