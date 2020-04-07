import { useCallback, useMemo, useReducer, Reducer } from 'react';
import { TokenQuantity, TokenDetails } from '../../../types';
import { parseAmounts } from '../../../web3/amounts';

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export enum TransactionType {
  Mint,
  Redeem,
}

enum Actions {
  SetError,
  SetToken,
  SetMUSD,
  SetQuantity,
  SetTransactionType,
  StartSubmission,
  EndSubmission,
}

export enum Reasons {
  AmountMustBeSet,
  AmountMustBeGreaterThanZero,
  AmountMustNotExceedBalance,
  AmountCouldNotBeParsed,
  TokenMustBeSelected,
  TokenMustBeUnlocked,
  FetchingData,
  ValidationFailed,
  BAssetNotAllowedInMint,
  MustBeBelowImplicitMaxWeighting,
  MustRedeemOverweightBAssets,
  BAssetsMustRemainUnderMaxWeight,
  BAssetsMustRemainAboveImplicitMinWeight,
  InputLengthShouldBeEqual,
}

type Action =
  | { type: Actions.SetError; payload: Reasons | null }
  | { type: Actions.StartSubmission }
  | { type: Actions.EndSubmission }
  | {
      type: Actions.SetToken;
      payload: {
        field: Fields;
      } & TokenDetails;
    }
  | {
      type: Actions.SetMUSD;
      payload: TokenDetails;
    }
  | {
      type: Actions.SetQuantity;
      payload: { field: Fields; simpleAmount: string | null };
    }
  | { type: Actions.SetTransactionType; payload: TransactionType };

interface State {
  values: {
    input: TokenQuantity;
    output: TokenQuantity;
  };
  mUSD: TokenDetails;
  transactionType: TransactionType;
  error: Reasons | null;
  submitting: boolean;
  // success: boolean // TODO?
}

interface Dispatch {
  setError(reason: Reasons | null): void;
  setToken(field: Fields, token: TokenDetails): void;
  setMUSD(token: TokenDetails): void;
  setQuantity(field: Fields, simpleAmount: string): void;
  startSubmission(): void;
  endSubmission(): void;
  swapTransactionType(): void;
}

const initialTokenQuantityField: TokenQuantity = Object.freeze({
  amount: {
    simple: null,
    exact: null,
    formatted: null,
  },
  token: {
    address: null,
    decimals: null,
    symbol: null,
  },
});

const initialState: State = Object.freeze({
  values: {
    input: initialTokenQuantityField,
    output: initialTokenQuantityField,
  },
  mUSD: {
    address: null,
    decimals: null,
    symbol: null,
  },
  error: null,
  submitting: false,
  transactionType: TransactionType.Mint,
});

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetError:
      return { ...state, error: action.payload };
    case Actions.SetMUSD: {
      return {
        ...state,
        mUSD: action.payload,
      };
    }
    case Actions.SetToken: {
      const { field, decimals, address, symbol } = action.payload;
      return {
        ...state,
        values: {
          ...state.values,
          [field]: parseAmounts({
            ...state.values[field],
            token: { decimals, address, symbol },
          }),
        },
      };
    }
    case Actions.SetQuantity: {
      const { field, simpleAmount } = action.payload;

      const otherField = field === Fields.Input ? Fields.Output : Fields.Input;
      const { [field]: tokenQ, [otherField]: otherTokenQ } = state.values;

      // TODO use `field` and `state.transactionType` to determine amounts
      // (i.e. add the fee for redeeming)
      return {
        ...state,
        values: {
          ...state.values,
          [field]: parseAmounts({
            ...tokenQ,
            amount: { ...tokenQ.amount, simple: simpleAmount },
          }),
          [otherField]: parseAmounts({
            ...otherTokenQ,
            amount: { ...otherTokenQ.amount, simple: simpleAmount },
          }),
        },
      };
    }
    case Actions.SetTransactionType: {
      const {
        values: { input, output },
        transactionType,
      } = state;

      // Do nothing if the type is the same
      if (transactionType === action.payload) return state;

      return {
        ...state,
        error: null,
        values: {
          ...state.values,
          input: output,
          output: input,
        },
        transactionType: action.payload,
      };
    }
    default:
      throw new Error('Unhandled action type');
  }
};

export const useSwapState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    transactionType,
    mUSD,
    values: { input, output },
  } = state;

  const swapTransactionType = useCallback(() => {
    dispatch({
      type: Actions.SetTransactionType,
      payload:
        transactionType === TransactionType.Mint
          ? TransactionType.Redeem
          : TransactionType.Mint,
    });
  }, [dispatch, transactionType]);

  const setError = useCallback<Dispatch['setError']>(
    payload => {
      dispatch({ type: Actions.SetError, payload });
    },
    [dispatch],
  );

  const setToken = useCallback(
    (
      field: Fields,
      payload: {
        decimals: number | null;
        address: string | null;
        symbol: string | null;
      },
    ) => {
      const otherField = field === Fields.Input ? Fields.Output : Fields.Input;
      const { [field]: tokenQ, [otherField]: otherTokenQ } = state.values;

      // Ignore no change
      if (payload.address === tokenQ.token?.address) return;

      // If the input token is set to the output token, change the type instead.
      if (payload.address === otherTokenQ.token?.address) {
        swapTransactionType();
        return;
      }

      // If neither token will be mUSD, set the other token to MUSD (change type)
      if (
        payload.address &&
        mUSD.address &&
        payload.address !== mUSD.address &&
        otherTokenQ.token.address !== mUSD.address
      ) {
        dispatch({
          type: Actions.SetToken,
          payload: {
            field: otherField,
            ...mUSD,
          },
        });
      }

      dispatch({
        type: Actions.SetToken,
        payload: { field, ...payload },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, input, output, swapTransactionType],
  );

  const setQuantity = useCallback(
    (field: Fields, simpleAmount: string) => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { simpleAmount, field },
      });
    },
    [dispatch],
  );

  const setMUSD = useCallback(
    (payload: TokenDetails) => {
      dispatch({ type: Actions.SetMUSD, payload });
      dispatch({
        type: Actions.SetToken,
        payload: { field: Fields.Output, ...payload },
      });
    },
    [dispatch],
  );

  const startSubmission = useCallback(() => {
    dispatch({ type: Actions.StartSubmission });
  }, [dispatch]);

  const endSubmission = useCallback(() => {
    dispatch({ type: Actions.EndSubmission });
  }, [dispatch]);

  return useMemo(
    () => [
      state,
      {
        swapTransactionType,
        setError,
        setToken,
        setMUSD,
        setQuantity,
        startSubmission,
        endSubmission,
      },
    ],
    [
      state,
      setMUSD,
      swapTransactionType,
      setError,
      setToken,
      setQuantity,
      startSubmission,
      endSubmission,
    ],
  );
};
