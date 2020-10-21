import React, {
  FC,
  Reducer,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { Erc20TokensQueryResult } from '../../graphql/mstable';
import { Allowances, SubscribedToken } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { CURVE_ADDRESSES } from '../earn/CurveProvider';

interface State {
  tokens: {
    [address: string]: SubscribedToken | undefined;
  };
  subscriptions: {
    [address: string]:
      | {
          balance: Set<string>;
          allowances: { [spender: string]: Set<string> };
        }
      | undefined;
  };
}

export type Tokens = State['tokens'];

type Fetched = NonNullable<Erc20TokensQueryResult['data']>['tokens'];

interface Dispatch {
  setFetched(fetched: Fetched): void;
  reset(): void;

  updateAllowances(allowancesMap: { [address: string]: Allowances }): void;
  updateBalances(balancesMap: { [address: string]: BigDecimal }): void;

  subscribeAllowance(address: string, spender: string, subId: string): void;
  subscribeBalance(address: string, subId: string): void;

  unsubscribeAllowance(address: string, spender: string, subId: string): void;
  unsubscribeBalance(address: string, subId: string): void;
}

enum Actions {
  Reset,
  SetFetched,
  SubscribeAllowance,
  SubscribeBalance,
  UnsubscribeAllowance,
  UnsubscribeBalance,
  UpdateAllowances,
  UpdateBalances,
}

type Action =
  | { type: Actions.SetFetched; payload: Fetched }
  | {
      type: Actions.SubscribeAllowance;
      payload: { address: string; spender: string; subId: string };
    }
  | {
      type: Actions.UnsubscribeAllowance;
      payload: { address: string; spender: string; subId: string };
    }
  | {
      type: Actions.SubscribeBalance;
      payload: { address: string; subId: string };
    }
  | {
      type: Actions.UnsubscribeBalance;
      payload: { address: string; subId: string };
    }
  | {
      type: Actions.UpdateAllowances;
      payload: { [address: string]: Allowances };
    }
  | {
      type: Actions.UpdateBalances;
      payload: { [address: string]: BigDecimal };
    }
  | { type: Actions.Reset };

const initialState: State = {
  tokens: {
    // TODO later: Remove hardcoded token when it's on the subgraph
    [CURVE_ADDRESSES.CRV_TOKEN]: {
      symbol: 'CRV',
      address: CURVE_ADDRESSES.CRV_TOKEN,
      decimals: 18,
      balance: new BigDecimal(0, 18),
      allowances: {},
    },
  },
  subscriptions: {},
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetFetched: {
      const fetched = action.payload;
      return {
        ...state,
        tokens: fetched.reduce(
          (_tokens, { address, decimals, symbol }) => ({
            ..._tokens,
            [address]: {
              address,
              decimals,
              symbol,
              balance: new BigDecimal(0, decimals),
              allowances: {},
              ..._tokens[address],
            },
          }),
          state.tokens,
        ),
      };
    }

    case Actions.SubscribeBalance: {
      const { address, subId } = action.payload;
      const sub = state.subscriptions[address];

      const balance = sub?.balance || new Set();

      if (balance.has(subId)) {
        return state;
      }

      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [address]: {
            ...(sub as NonNullable<typeof sub>),
            balance: balance.add(subId),
          },
        },
      };
    }

    case Actions.UnsubscribeBalance: {
      const { address, subId } = action.payload;
      const sub = state.subscriptions[address];

      const balance = sub?.balance || new Set();

      if (balance.has(subId)) {
        balance.delete(subId);
        return {
          ...state,
          subscriptions: {
            ...state.subscriptions,
            [address]: {
              ...(sub as NonNullable<typeof sub>),
              balance,
            },
          },
        };
      }

      return state;
    }

    case Actions.SubscribeAllowance: {
      const { address, spender, subId } = action.payload;
      const sub = state.subscriptions[address];

      const allowances = {
        ...sub?.allowances,
        [spender]: sub?.allowances?.[spender] || new Set(),
      };

      if (allowances[spender].has(subId)) {
        return state;
      }

      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [address]: {
            ...(sub as NonNullable<typeof sub>),
            allowances: {
              ...allowances,
              [spender]: allowances[spender].add(subId),
            },
          },
        },
      };
    }

    case Actions.UnsubscribeAllowance: {
      const { address, spender, subId } = action.payload;
      const sub = state.subscriptions[address];

      const allowances = {
        ...sub?.allowances,
        [spender]: sub?.allowances?.[spender] || new Set(),
      };

      if (allowances[spender].has(subId)) {
        allowances[spender].delete(subId);
        return {
          subscriptions: {
            ...state.subscriptions,
            [address]: {
              ...(sub as NonNullable<typeof sub>),
              allowances,
            },
          },
          tokens: state.tokens,
        };
      }

      return state;
    }

    case Actions.Reset:
      return {
        tokens: Object.keys(state.tokens).reduce(
          (_tokens, address) => ({
            ..._tokens,
            [address]: {
              ...(_tokens[address] as SubscribedToken),
              allowances: {},
              balance: new BigDecimal(
                0,
                (_tokens[address] as SubscribedToken).decimals,
              ),
            },
          }),
          state.tokens,
        ),
        subscriptions: {},
      };

    case Actions.UpdateBalances: {
      const balances = action.payload;
      return {
        subscriptions: state.subscriptions,
        tokens: Object.keys(balances).reduce(
          (_tokens, address) => ({
            ..._tokens,
            [address]: {
              ...(_tokens[address] as NonNullable<
                typeof _tokens[typeof address]
              >),
              balance: balances[address],
            },
          }),
          state.tokens,
        ),
      };
    }

    case Actions.UpdateAllowances: {
      const allowancesMap = action.payload;
      return {
        ...state,
        tokens: Object.keys(allowancesMap).reduce(
          (_tokens, address) => ({
            ..._tokens,
            [address]: {
              ...(_tokens[address] as NonNullable<
                typeof _tokens[typeof address]
              >),
              allowances: {
                ..._tokens[address]?.allowances,
                ...allowancesMap[address],
              },
            },
          }),
          state.tokens,
        ),
      };
    }

    default:
      throw new Error('Unexpected action type');
  }
};

/**
 * Provider for tracking balances for tokens for the current user.
 * Balances are re-fetched on each block with separate queries.
 */
export const TokensProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFetched = useCallback<Dispatch['setFetched']>(
    fetched => {
      dispatch({ type: Actions.SetFetched, payload: fetched });
    },
    [dispatch],
  );

  const subscribeBalance = useCallback<Dispatch['subscribeBalance']>(
    (address, subId) => {
      dispatch({ type: Actions.SubscribeBalance, payload: { address, subId } });
    },
    [dispatch],
  );

  const unsubscribeBalance = useCallback<Dispatch['unsubscribeBalance']>(
    (address, subId) => {
      dispatch({
        type: Actions.UnsubscribeBalance,
        payload: { address, subId },
      });
    },
    [dispatch],
  );

  const subscribeAllowance = useCallback<Dispatch['subscribeAllowance']>(
    (address, spender, subId) => {
      dispatch({
        type: Actions.SubscribeAllowance,
        payload: { address, spender, subId },
      });
    },
    [dispatch],
  );

  const unsubscribeAllowance = useCallback<Dispatch['unsubscribeAllowance']>(
    (address, spender, subId) => {
      dispatch({
        type: Actions.UnsubscribeAllowance,
        payload: { address, spender, subId },
      });
    },
    [dispatch],
  );

  const updateBalances = useCallback<Dispatch['updateBalances']>(
    balancesMap => {
      dispatch({ type: Actions.UpdateBalances, payload: balancesMap });
    },
    [dispatch],
  );

  const updateAllowances = useCallback<Dispatch['updateAllowances']>(
    allowancesMap => {
      dispatch({
        type: Actions.UpdateAllowances,
        payload: allowancesMap,
      });
    },
    [dispatch],
  );

  const reset = useCallback<Dispatch['reset']>(() => {
    dispatch({ type: Actions.Reset });
  }, [dispatch]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            reset,
            setFetched,
            subscribeAllowance,
            subscribeBalance,
            unsubscribeAllowance,
            unsubscribeBalance,
            updateAllowances,
            updateBalances,
          }),
          [
            reset,
            setFetched,
            subscribeAllowance,
            subscribeBalance,
            unsubscribeAllowance,
            unsubscribeBalance,
            updateAllowances,
            updateBalances,
          ],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useTokensState = (): State => useContext(stateCtx);

export const useTokens = (): Tokens => useTokensState().tokens;

export const useTokensDispatch = (): Dispatch => useContext(dispatchCtx);

export const useTokenSubscriptionsSerialized = (): string => {
  const { subscriptions } = useTokensState();
  return useMemo(
    () =>
      JSON.stringify(
        Object.keys(subscriptions).filter(
          // Either subscribed for balance or allowance
          address =>
            subscriptions[address]?.balance?.size ||
            Object.keys(subscriptions[address]?.allowances || {}).some(
              spender => subscriptions[address]?.allowances[spender]?.size,
            ),
        ),
      ),
    [subscriptions],
  );
};

export const useBalanceSubscriptionsSerialized = (): string => {
  const { tokens, subscriptions } = useTokensState();
  return useMemo(
    () =>
      JSON.stringify(
        Object.keys(subscriptions)
          .filter(
            address =>
              tokens[address]?.decimals &&
              subscriptions[address]?.balance?.size,
          )
          .map(address => ({
            address,
            decimals: (tokens[address] as NonNullable<
              typeof tokens[typeof address]
            >).decimals,
          })),
      ),
    [tokens, subscriptions],
  );
};

export const useAllowanceSubscriptionsSerialized = (): string => {
  const { tokens, subscriptions } = useTokensState();

  return useMemo(
    () =>
      JSON.stringify(
        Object.keys(subscriptions)
          .filter(
            address =>
              tokens[address]?.decimals &&
              Object.keys(subscriptions[address]?.allowances || {}).some(
                spender => subscriptions[address]?.allowances[spender]?.size,
              ),
          )
          .map(address => ({
            address,
            spenders: Object.keys(
              subscriptions[address]?.allowances || {},
            ).filter(
              spender => subscriptions[address]?.allowances[spender]?.size,
            ),
            decimals: (tokens[address] as NonNullable<
              typeof tokens[typeof address]
            >).decimals,
          })),
      ),
    [tokens, subscriptions],
  );
};

export const useToken = (
  address: string | null | undefined,
): SubscribedToken | undefined => {
  const id = useMemo(() => Math.random().toString(), []);

  const state = useTokensState();
  const { subscribeBalance, unsubscribeBalance } = useTokensDispatch();

  useEffect(() => {
    if (address) subscribeBalance(address, id);

    return () => {
      if (address) unsubscribeBalance(address, id);
    };
  }, [address, subscribeBalance, unsubscribeBalance, id]);

  return address ? state.tokens[address] : undefined;
};

export const useMetaToken = (): SubscribedToken | undefined =>
  useToken((process.env.REACT_APP_MTA_ADDRESS as string).toLowerCase());

export const useTokenAllowance = (
  address: string | undefined | null,
  spender: string | undefined | null,
): BigDecimal | undefined => {
  const id = useRef(Math.random().toString());

  const state = useTokensState();
  const { subscribeAllowance, unsubscribeAllowance } = useTokensDispatch();

  useEffect(() => {
    const subId = id.current;

    if (address && spender) subscribeAllowance(address, spender, subId);

    return () => {
      if (address && spender) unsubscribeAllowance(address, spender, subId);
    };
  }, [address, spender, subscribeAllowance, unsubscribeAllowance]);

  return address && spender
    ? state.tokens[address]?.allowances[spender]
    : undefined;
};
