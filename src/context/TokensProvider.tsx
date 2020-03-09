import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

interface State {
  [token: string]: {
    subscribed: boolean;
    balance: string;
  };
}

interface Dispatch {
  subscribe(token: string): void;
  reset(): void;
  updateBalances(balances: Record<string, string>): void;
  unsubscribe(token: string): void;
}

enum Actions {
  Subscribe,
  Unsubscribe,
  Reset,
  UpdateBalances,
}

type Action =
  | { type: Actions.Subscribe; payload: string }
  | { type: Actions.Unsubscribe; payload: string }
  | { type: Actions.Reset }
  | { type: Actions.UpdateBalances; payload: Record<string, string> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([new Set(), {}] as any);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Subscribe: {
      const token = action.payload;
      return {
        ...state,
        [token]: { ...state[token], subscribed: true },
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

  const subscribe = useCallback(
    (token: string) => dispatch({ type: Actions.Subscribe, payload: token }),
    [dispatch],
  );

  const unsubscribe = useCallback(
    (token: string) => dispatch({ type: Actions.Unsubscribe, payload: token }),
    [dispatch],
  );

  const updateBalances = useCallback(
    (balances: Record<string, string>) =>
      dispatch({ type: Actions.UpdateBalances, payload: balances }),
    [dispatch],
  );

  const reset = useCallback(() => dispatch({ type: Actions.Reset }), [
    dispatch,
  ]);

  return (
    <context.Provider
      value={useMemo(
        () => [state, { subscribe, unsubscribe, updateBalances, reset }],
        [state, subscribe, unsubscribe, updateBalances, reset],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useTokensContext = (): [State, Dispatch] => useContext(context);
