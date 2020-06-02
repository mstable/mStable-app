import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { parseUnits } from 'ethers/utils';
import { pipe } from 'ts-pipe-compose';

import {
  useLatestExchangeRate,
  useMusdSavingsAllowance,
  useMusdTokenData,
  useSavingsBalance,
} from '../../../context/DataProvider/DataProvider';
import { useKnownAddress } from '../../../context/DataProvider/KnownAddressProvider';
import { ContractNames } from '../../../types';
import { parseAmount, parseExactAmount } from '../../../web3/amounts';
import { SCALE } from '../../../web3/constants';
import { Action, Actions, Dispatch, State, TransactionType } from './types';
import { applyValidation } from './validate';

const update = (state: State): State => pipe(state, applyValidation);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetData:
      return update({ ...state, data: action.payload });

    case Actions.SetQuantity: {
      const { exchangeRate } = state.data;
      const { formValue, isCreditAmount } = action.payload;

      const parsedFormValue = parseAmount(formValue, 18);

      const amount = isCreditAmount
        ? exchangeRate?.exchangeRate && parsedFormValue?.exact
          ? parseExactAmount(
              parsedFormValue.exact
                .mul(parseUnits(exchangeRate.exchangeRate))
                .div(SCALE),
              18,
            )
          : parseExactAmount(SCALE, 18)
        : parsedFormValue;

      const amountInCredits = isCreditAmount
        ? parsedFormValue?.exact
        : amount?.exact && exchangeRate?.exchangeRate
        ? amount.exact
            .add(1)
            .mul(SCALE)
            .div(parseUnits(exchangeRate.exchangeRate))
        : null;

      return update({
        ...state,
        touched: true,
        values: {
          ...state.values,
          input: {
            ...state.values.input,
            formValue: isCreditAmount
              ? amount?.simple
                ? amount.simple.toString()
                : null
              : formValue,
            amount,
            amountInCredits,
          },
        },
      });
    }

    case Actions.SetToken:
      return update({
        ...state,
        values: {
          ...state.values,
          input: {
            ...state.values.input,
            token:
              action.payload === null
                ? { address: null, symbol: null, decimals: null }
                : action.payload,
          },
        },
      });

    case Actions.SetTransactionType: {
      const { transactionType } = action.payload;
      return update({ ...state, values: { ...state.values, transactionType } });
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const initialState: State = Object.freeze({
  data: {},
  values: {
    transactionType: TransactionType.Deposit,
    input: {
      formValue: null,
      token: {
        address: null,
        decimals: null,
        symbol: null,
      },
      amount: {
        simple: null,
        exact: null,
      },
      amountInCredits: null,
    },
  },
  touched: false,
  valid: false,
});

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SaveProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setQuantity = useCallback<Dispatch['setQuantity']>(
    (formValue, isCreditAmount = false) => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, isCreditAmount },
      });
    },
    [dispatch],
  );

  const setToken = useCallback<Dispatch['setToken']>(
    tokenDetails => {
      dispatch({ type: Actions.SetToken, payload: tokenDetails });
    },
    [dispatch],
  );

  const setTransactionType = useCallback<Dispatch['setTransactionType']>(
    transactionType => {
      dispatch({
        type: Actions.SetTransactionType,
        payload: { transactionType },
      });
    },
    [dispatch],
  );

  const savingsBalance = useSavingsBalance();
  const exchangeRate = useLatestExchangeRate();
  const mUsdToken = useMusdTokenData();
  const savingsContractAddress =
    useKnownAddress(ContractNames.mUSDSavings) || undefined;
  const allowance = useMusdSavingsAllowance();

  useEffect(() => {
    dispatch({
      type: Actions.SetData,
      payload: {
        allowance,
        exchangeRate,
        mUsdToken,
        savingsBalance,
        savingsContractAddress,
      },
    });
  }, [
    allowance,
    dispatch,
    exchangeRate,
    mUsdToken,
    savingsBalance,
    savingsContractAddress,
  ]);

  useEffect(() => {
    // Set token output to mUSD
    if (!state.values.input.token.address && mUsdToken?.address) {
      setToken(mUsdToken);
    }
  }, [setToken, state.values.input.token.address, mUsdToken]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ setToken, setQuantity, setTransactionType }), [
          setToken,
          setQuantity,
          setTransactionType,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useSaveState = (): State => useContext(stateCtx);

export const useSaveDispatch = (): Dispatch => useContext(dispatchCtx);
