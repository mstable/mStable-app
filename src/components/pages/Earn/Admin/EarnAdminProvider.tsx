import React, {
  FC,
  Reducer,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { useStakingRewardsContracts } from '../../../../context/earn/EarnDataProvider';
import { useToken } from '../../../../context/DataProvider/TokensProvider';
import { SubscribedToken } from '../../../../types';
import {
  RewardsDistributor,
  useRewardsDistributorQuery,
} from '../../../../graphql/mstable';

interface State {
  data: {
    rewardsToken?: SubscribedToken;
    rewardsDistributor?: RewardsDistributor;
  };
  totalFunds?: BigDecimal;
  recipientAmounts: {
    [recipient: string]: {
      amount?: BigDecimal;
      formValue: string | null;
    };
  };
}

interface Dispatch {
  setRecipientAmount(recipient: string, amount: string | null): void;
}

enum Actions {
  Data,
  SetRecipientAmount,
}

type Action =
  | {
      type: Actions.Data;
      payload: {
        rewardsToken?: SubscribedToken;
        rewardsDistributor?: RewardsDistributor;
      };
    }
  | {
      type: Actions.SetRecipientAmount;
      payload: { recipient: string; amount: string | null };
    };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetRecipientAmount: {
      const { amount, recipient } = action.payload;

      const {
        data: { rewardsToken },
      } = state;

      if (!rewardsToken) {
        return state;
      }

      const recipientAmounts = {
        ...state.recipientAmounts,
        [recipient]: {
          amount: BigDecimal.maybeParse(amount, rewardsToken.decimals),
          formValue: amount,
        },
      };

      const totalRewards: BigDecimal = Object.values(recipientAmounts)
        .filter(({ amount: _amount }) => !!_amount)
        .reduce(
          (_totalRewards, { amount: _amount }) =>
            _totalRewards.add(_amount as BigDecimal),
          new BigDecimal(0, rewardsToken.decimals),
        );

      return {
        ...state,
        recipientAmounts,
        totalFunds: totalRewards,
      };
    }
    case Actions.Data: {
      return { ...state, data: action.payload };
    }
    default:
      throw new Error('Unhandled action');
  }
};

const initialState: State = {
  data: {},
  recipientAmounts: {},
};

const useFirstRewardsToken = (): SubscribedToken | undefined => {
  const stakingRewardsContracts = useStakingRewardsContracts();
  const first = Object.values(stakingRewardsContracts)[0];
  return useToken(first?.rewardsToken.address);
};

const dispatchCtx = createContext<Dispatch>({} as never);
const stateCtx = createContext<State>(initialState);

export const EarnAdminProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRecipientAmount = useCallback<Dispatch['setRecipientAmount']>(
    (recipient, amount) => {
      dispatch({
        type: Actions.SetRecipientAmount,
        payload: { recipient, amount },
      });
    },
    [dispatch],
  );

  // Get the first rewards token; if different rewards tokens are used in the
  // future, then group the staking contracts by rewards token and fund them
  // separately.
  const rewardsToken = useFirstRewardsToken();

  const rewardsDistributorQuery = useRewardsDistributorQuery();
  const rewardsDistributor =
    rewardsDistributorQuery.data?.rewardsDistributors?.[0];

  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: { rewardsToken, rewardsDistributor },
    });
  }, [dispatch, rewardsToken, rewardsDistributor]);

  return (
    <dispatchCtx.Provider
      value={useMemo(() => ({ setRecipientAmount }), [setRecipientAmount])}
    >
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const useEarnAdminDispatch = (): Dispatch => useContext(dispatchCtx);

export const useEarnAdminState = (): State => useContext(stateCtx);
