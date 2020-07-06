import {
  LazyQueryHookOptions,
  QueryTuple,
} from '@apollo/react-hooks/lib/types';
import * as ApolloReactHooks from '@apollo/react-hooks';
import { QueryResult } from '@apollo/react-common';
import { useWallet } from 'use-wallet';
import { useEffect } from 'react';

import {
  CreditBalancesQueryResult,
  MassetQueryResult,
  SavingsContractQueryResult,
  useCreditBalancesLazyQuery,
  useMassetLazyQuery,
  useSavingsContractLazyQuery,
} from '../../graphql/generated';
import { ContractNames } from '../../types';
import { useKnownAddress } from './KnownAddressProvider';
import { useBlockNumber } from './BlockProvider';

export const useBlockPollingSubscription = <TData, TVariables>(
  lazyQuery: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    options?: LazyQueryHookOptions<TData, TVariables>,
  ) => QueryTuple<TData, TVariables>,
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TData, TVariables>,
  skip?: boolean,
): QueryResult<TData, TVariables> => {
  const blockNumber = useBlockNumber();
  const hasBlock = !!blockNumber;

  // We're using a long-polling query because subscriptions don't seem to be
  // re-run when derived or nested fields change.
  // See https://github.com/graphprotocol/graph-node/issues/1398
  const [run, query] = lazyQuery({
    fetchPolicy: 'cache-and-network',
    ...baseOptions,
  });

  // Long poll (15s interval) if the block number isn't available.
  useEffect(() => {
    let interval: number;

    if (!skip && !hasBlock) {
      run();
      interval = setInterval(() => {
        run();
      }, 15000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [skip, hasBlock, run]);

  // Run the query on every block when the block number is available.
  useEffect(() => {
    if (!skip && blockNumber) {
      run();
    }
  }, [skip, blockNumber, run]);

  return query;
};

export const useMusdSubscription = (): MassetQueryResult => {
  const address = useKnownAddress(ContractNames.mUSD);

  return useBlockPollingSubscription(
    useMassetLazyQuery,
    {
      variables: {
        id: address as string,
      },
    },
    !address,
  );
};

export const useMusdSavingsSubscription = (): SavingsContractQueryResult => {
  const address = useKnownAddress(ContractNames.mUSDSavings);

  return useBlockPollingSubscription(
    useSavingsContractLazyQuery,
    {
      variables: { id: address as string },
    },
    !address,
  );
};

export const useCreditBalancesSubscription = (): CreditBalancesQueryResult => {
  const { account } = useWallet();

  return useBlockPollingSubscription(
    useCreditBalancesLazyQuery,
    { variables: { account: account ? account.toLowerCase() : '' } },
    !account,
  );
};
