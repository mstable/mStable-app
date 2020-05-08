import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { BigNumber } from 'ethers/utils';
import { ContractNames } from '../types';
import {
  SavingsContractQuery,
  useMassetQuery,
  useSavingsContractQuery,
} from '../graphql/generated';
import { useToken } from './TokensProvider';

type State = Record<ContractNames, string | null>;

enum Actions {
  Set,
  Reset,
}

type Action =
  | {
      type: Actions.Set;
      payload: { address: string; contractName: ContractNames };
    }
  | { type: Actions.Reset };

interface Dispatch {
  set(contractName: ContractNames, address: string): void;
  reset(): void;
}

type Context = [State, Dispatch];

const initialState: State = {
  // [ContractNames.mGLD]: null,
  [ContractNames.mUSD]: null,
  [ContractNames.mUSDForgeValidator]: null,
  [ContractNames.mUSDSavings]: null,
  // [ContractNames.MTA]: null,
};

const context = createContext<Context>([initialState, {} as Dispatch]);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Set: {
      const { contractName, address } = action.payload;
      return { ...state, [contractName]: address };
    }
    case Actions.Reset:
      return initialState;
    default:
      throw new Error('Unhandled action type');
  }
};

/**
 * Provider for known contract addresses.
 * Provides the means to get the address of a named contract,
 * e.g. 'mUSD' or 'MTA'.
 */
export const KnownAddressProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const set = useCallback<Dispatch['set']>(
    (contractName, address) => {
      dispatch({ type: Actions.Set, payload: { contractName, address } });
    },
    [dispatch],
  );

  const reset = useCallback<Dispatch['reset']>(() => {
    dispatch({ type: Actions.Reset });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(() => [state, { set, reset }], [state, set, reset])}
    >
      {children}
    </context.Provider>
  );
};

export const useKnownAddressContext = (): Context => useContext(context);

export const useKnownAddressState = (): State => {
  const [state] = useKnownAddressContext();
  return state;
};

export const useKnownAddressDispatch = (): Dispatch => {
  const [, dispatch] = useKnownAddressContext();
  return dispatch;
};

export const useSetKnownAddress = (): Dispatch['set'] => {
  const { set } = useKnownAddressDispatch();
  return set;
};

export const useResetKnownAddresses = (): Dispatch['reset'] => {
  const { reset } = useKnownAddressDispatch();
  return reset;
};

export const useKnownAddress = (
  contractName: ContractNames,
): State[typeof contractName] => {
  const state = useKnownAddressState();
  return state[contractName];
};

export const useMUSD = (): ReturnType<typeof useMassetQuery> => {
  const address = useKnownAddress(ContractNames.mUSD);
  return useMassetQuery({
    variables: { id: address as string },
    skip: !address,
  });
};

export const useMUSDSavings = ():
  | (SavingsContractQuery['savingsContracts'][0] & {
      allowance: BigNumber | null;
    })
  | null => {
  const address = useKnownAddress(ContractNames.mUSDSavings);
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);

  const {
    data: { savingsContracts: [fromData] = [] } = {},
  } = useSavingsContractQuery({
    variables: { id: address || '' },
  });

  const { allowance } = useToken(address) || {};

  return fromData
    ? {
        ...fromData,
        allowance: allowance && mUSDAddress ? allowance[mUSDAddress] : null,
      }
    : null;
};
