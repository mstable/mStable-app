import { useEffect } from 'react';
import { useSetKnownAddress } from '../context/KnownAddressProvider';
import {
  CoreTokensQueryResult,
  // useCoreTokensLazyQuery,
} from '../graphql/generated';
import { ContractNames } from '../types';

type Keys = keyof NonNullable<CoreTokensQueryResult['data']> & 'mUSDSavings';

const mapping: Record<Keys, ContractNames> = {
  mGLD: ContractNames.mGLD,
  mUSD: ContractNames.mUSD,
  mta: ContractNames.MTA,
  mUSDSavings: ContractNames.mUSDSavings,
};

// TODO remove this; it doesn't exist in the gql data yet,
// but the types are smart enough to see it's needed!
const musdSavings = [{ address: 'musd savings address' }];

const fakeCoreTokensData = {
  mUSD: [
    {
      address: '0x1',
    },
  ],
};

// TODO re-enable fetching when subgraph is ready
const fetch = (): void => {};

/**
 * Updater for `KnownAddressProvider` state.
 * Lazy-fetches address data for named contracts from GraphQL and
 * then stores this data in context state.
 */
export const KnownAddressUpdater = (): null => {
  const set = useSetKnownAddress();

  // Use a lazy query because this data should never change during a session
  // (caveat: if we support network switching without a refresh, this will
  // need to re-fetch then).
  // const [fetch, { data: coreTokens }] = useCoreTokensLazyQuery();
  // TODO re-enable fetching when subgraph is ready
  const coreTokens = fakeCoreTokensData;

  // Fetch core tokens once only.
  useEffect(fetch, [fetch]);

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
