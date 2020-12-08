import React, { createContext, FC, useContext, useMemo } from 'react';
import { pipe } from 'ts-pipe-compose';

import { Tokens, useTokensState } from '../TokensProvider';
import {
  BassetState,
  DataState,
  MassetState,
  SavingsContractState,
} from './types';
import { recalculateState } from './recalculateState';
import { transformRawData } from './transformRawData';
import { useBlockPollingSubscription } from './subscriptions';
import { useAccount } from '../UserProvider';
import {
  MassetsQueryResult,
  useMassetsLazyQuery,
} from '../../graphql/protocol';
import { useSelectedMasset } from '../SelectedMassetProvider';

const dataStateCtx = createContext<DataState>({});

const useRawData = (): [MassetsQueryResult['data'], Tokens] => {
  const { tokens } = useTokensState();

  const account = useAccount();
  const subscription = useBlockPollingSubscription(useMassetsLazyQuery, {
    variables: { account: account ?? '', hasAccount: !!account },
  });

  return [subscription.data, tokens];
};

export const DataProvider: FC = ({ children }) => {
  const data = useRawData();

  const dataState = useMemo<DataState>(
    () =>
      pipe<typeof data, DataState, DataState>(
        data,
        transformRawData,
        recalculateState,
      ),
    [data],
  );

  return (
    <dataStateCtx.Provider value={dataState}>{children}</dataStateCtx.Provider>
  );
};

export const useDataState = (): DataState => useContext(dataStateCtx);

export const useSelectedMassetState = (): MassetState | undefined => {
  const masset = useSelectedMasset();
  return useDataState()[masset];
};

export const useV1SavingsBalance = ():
  | Extract<SavingsContractState, { version: 1 }>['savingsBalance']
  | undefined => useSelectedMassetState()?.savingsContracts?.v1?.savingsBalance;

export const useBassetState = (address: string): BassetState | undefined =>
  useSelectedMassetState()?.bAssets[address];

export const useSelectedSaveV1Address = (): string | undefined => {
  const massetState = useSelectedMassetState();
  return massetState?.savingsContracts?.v1?.address;
};

export const useSelectedSaveV2Address = (): string | undefined => {
  const massetState = useSelectedMassetState();
  return massetState?.savingsContracts?.v2?.address;
};
