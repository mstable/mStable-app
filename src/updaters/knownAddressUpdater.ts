import { useEffect } from 'react';
import {
  useKnownAddress,
  useSetKnownAddress,
} from '../context/KnownAddressProvider';
import {
  CoreTokensQueryResult,
  useCoreTokensLazyQuery,
} from '../graphql/generated';
import { ContractNames } from '../types';
import { MUSDFactory } from '../typechain/MUSDFactory';
import { useSignerContext } from '../context/SignerProvider';

type Keys = keyof NonNullable<CoreTokensQueryResult['data']> & 'mUSDSavings';

const mapping: Record<Keys, ContractNames> = {
  mUSD: ContractNames.mUSD,
  mUSDSavings: ContractNames.mUSDSavings,
  // mGLD: ContractNames.mGLD,
  // mta: ContractNames.MTA,
};

// TODO remove this; it doesn't exist in the gql data yet,
// but the types are smart enough to see it's needed!
const musdSavings = [{ address: 'musd savings address' }];

/**
 * Updater for `KnownAddressProvider` state.
 * Lazy-fetches address data for named contracts from GraphQL and
 * then stores this data in context state.
 */
export const KnownAddressUpdater = (): null => {
  const set = useSetKnownAddress();
  const signer = useSignerContext();

  // Use a lazy query because this data should never change during a session
  // (caveat: if we support network switching without a refresh, this will
  // need to re-fetch then).
  const [fetch, { data: coreTokens }] = useCoreTokensLazyQuery();

  // Fetch core tokens once only.
  useEffect(fetch, [fetch]);

  // Fetch mUSDForgeValidator (should happen once)
  // This could possibly be included in the Subgraph...
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSDForgeValidatorAddress = useKnownAddress(
    ContractNames.mUSDForgeValidator,
  );
  useEffect(() => {
    if (signer && mUSDAddress && !mUSDForgeValidatorAddress) {
      const mUSD = MUSDFactory.connect(mUSDAddress, signer);
      mUSD.forgeValidator().then(address => {
        set(ContractNames.mUSDForgeValidator, address);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, mUSDAddress, mUSDForgeValidatorAddress]);

  // Update addresses when core tokens are fetched.
  useEffect(() => {
    if (coreTokens) {
      Object.keys(coreTokens).forEach(key => {
        const contractName = mapping[key as Keys];
        const [{ address }] = coreTokens[key as Keys] || musdSavings;
        set(contractName, address);
      });
    }
  }, [coreTokens, set]);

  return null;
};
