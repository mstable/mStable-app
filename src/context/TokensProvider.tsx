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
import {
  TokenDetailsFragment,
  useErc20TokensQuery,
} from '../graphql/generated';

type TokenAddress = string;

interface Allowance {
  [spender: string]: BigNumber;
}

interface State {
  [token: string]: {
    subscribed: boolean;
    balance?: BigNumber;
    allowance: Allowance;
  };
}

interface Dispatch {
  subscribe(token: TokenAddress): void;
  reset(): void;
  updateAllowance(token: TokenAddress, allowance: Allowance): void;
  updateBalances(balances: Record<TokenAddress, BigNumber>): void;
  unsubscribe(token: TokenAddress): void;
}

enum Actions {
  Subscribe,
  Unsubscribe,
  Reset,
  UpdateBalances,
  UpdateAllowance,
}

type Action =
  | { type: Actions.Subscribe; payload: TokenAddress }
  | { type: Actions.Unsubscribe; payload: TokenAddress }
  | {
      type: Actions.UpdateAllowance;
      payload: { token: TokenAddress; allowance: Allowance };
    }
  | { type: Actions.Reset }
  | {
      type: Actions.UpdateBalances;
      payload: Record<TokenAddress, BigNumber>;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([new Set(), {}] as any);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Subscribe: {
      const token = action.payload;
      return {
        ...state,
        [token]: { ...state[token], subscribed: true, allowance: {} },
      };
    }
    case Actions.Unsubscribe: {
      const token = action.payload;
      return {
        ...state,
        [token]: { ...state[token], subscribed: false },
      };
    }
    case Actions.Reset:
      return {};
    case Actions.UpdateBalances: {
      const balances = action.payload;
      return Object.keys(balances).reduce(
        (_state, token) => ({
          ..._state,
          [token]: {
            ...state[token],
            balance: balances[token],
          },
        }),
        state,
      );
    }
    case Actions.UpdateAllowance: {
      const { token, allowance } = action.payload;
      return {
        ...state,
        [token]: {
          ...state[token],
          allowance: {
            ...state[token]?.allowance,
            ...allowance,
          },
        },
      };
    }
    default:
      throw new Error('Unexpected action type');
  }
};

const initialState: State = {};

/**
 * Provider for tracking balances for tokens for the current user.
 * Balances are re-fetched on each block with separate queries.
 */
export const TokensProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const subscribe = useCallback<Dispatch['subscribe']>(
    token => {
      dispatch({ type: Actions.Subscribe, payload: token });
    },
    [dispatch],
  );

  const unsubscribe = useCallback<Dispatch['unsubscribe']>(
    token => {
      dispatch({ type: Actions.Unsubscribe, payload: token });
    },
    [dispatch],
  );

  const updateBalances = useCallback<Dispatch['updateBalances']>(
    balances => {
      dispatch({ type: Actions.UpdateBalances, payload: balances });
    },
    [dispatch],
  );

  const updateAllowance = useCallback<Dispatch['updateAllowance']>(
    (token, allowance) => {
      dispatch({
        type: Actions.UpdateAllowance,
        payload: { token, allowance },
      });
    },
    [dispatch],
  );

  const reset = useCallback<Dispatch['reset']>(() => {
    dispatch({ type: Actions.Reset });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            subscribe,
            reset,
            updateAllowance,
            updateBalances,
            unsubscribe,
          },
        ],
        [state, subscribe, unsubscribe, updateAllowance, updateBalances, reset],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useTokensContext = (): [State, Dispatch] => useContext(context);

export const useTokensState = (): State => useTokensContext()[0];

export const useTokensDispatch = (): Dispatch => useTokensContext()[1];

export const useSubscribedTokens = (): string[] => {
  const state = useTokensState();
  return useMemo(
    () =>
      Object.keys(state)
        .filter(token => state[token].subscribed)
        .sort(),
    [state],
  );
};

export const useToken = (token: TokenAddress | null): State[string] | null => {
  const state = useTokensState();

  if (!token) return null;

  return state[token];
};

export const useTokenWithBalance = (
  token: TokenAddress | null,
): Partial<TokenDetailsFragment & State[keyof State]> => {
  const tokenFromState = useToken(token);
  const query = useErc20TokensQuery({
    variables: { addresses: [token] },
    skip: !token,
  });
  const tokenFromData = query.data?.tokens?.[0];
  return useMemo(
    () => ({
      ...tokenFromState,
      ...tokenFromData,
    }),
    [tokenFromState, tokenFromData],
  );
};
