import { useMemo } from 'react';
import type { ERC20 } from '@mstable/protocol/types/generated/ERC20';
import type { ISavingsContractV1 } from '@mstable/protocol/types/generated';
import {
  ERC20__factory,
  ISavingsContractV1__factory,
} from '@mstable/protocol/types/generated';

import { useSigner } from '../context/OnboardProvider';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { truncateAddress } from '../utils/strings';

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
