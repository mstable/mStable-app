import { useMemo } from 'react';
import { ERC20 } from '@mstable/protocol/types/generated/ERC20';
import { ISavingsContractV1 } from '@mstable/protocol/types/generated/ISavingsContractV1';
import { ERC20__factory } from '@mstable/protocol/types/generated/factories/ERC20__factory';
import { ISavingsContractV1__factory } from '@mstable/protocol/types/generated/factories/ISavingsContractV1__factory';

import { useSigner } from '../context/OnboardProvider';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { truncateAddress } from '../utils/strings';
import { LegacyMasset, LegacyMasset__factory } from '../typechain';

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

/**
 * @deprecated
 */
export const useErc20Contract = (
  address?: string | null,
): ERC20 | undefined => {
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address ? ERC20__factory.connect(address, signer) : undefined,
    [address, signer],
  );
};

/**
 * @deprecated
 */
export const useSelectedLegacyMassetContract = (): LegacyMasset | undefined => {
  const massetState = useSelectedMassetState();
  const address = massetState?.address;
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address
        ? LegacyMasset__factory.connect(address, signer)
        : undefined,
    [address, signer],
  );
};

/**
 * @deprecated
 */
export const useSelectedSaveV1Contract = (): ISavingsContractV1 | undefined => {
  const massetState = useSelectedMassetState();
  const address = massetState?.savingsContracts.v1?.address;
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address
        ? ISavingsContractV1__factory.connect(address, signer)
        : undefined,
    [address, signer],
  );
};
