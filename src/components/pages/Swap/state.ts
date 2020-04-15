import { useCallback, useMemo, useReducer, Reducer } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
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
  SetFeeRate,
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
  | {
      type: Actions.SetError;
      payload: null | { reason: Reasons; field?: Fields };
    }
  | { type: Actions.StartSubmission }
  | { type: Actions.EndSubmission }
  | {
      type: Actions.SetToken;
      payload: {
        field: Fields;
        swapType?: boolean;
      } & TokenDetails;
    }
  | {
      type: Actions.SetMUSD;
      payload: TokenDetails;
    }
  | {
      type: Actions.SetFeeRate;
      payload: BigNumber;
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
  error: null | { reason: Reasons; field?: Fields };
  submitting: boolean;
  feeRate: BigNumber | null;
}

interface Dispatch {
  setError(reason: Reasons | null, field?: Fields): void;
  setToken(field: Fields, token: NonNullable<TokenDetails> | null): void;
  setMUSD(token: NonNullable<TokenDetails>): void;
  setFeeRate(feeRate: BigNumber): void;
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
  feeRate: null,
});

const getOtherTransactionType = (
  transactionType: TransactionType,
): TransactionType =>
  transactionType === TransactionType.Mint
    ? TransactionType.Redeem
    : TransactionType.Mint;

const getOtherField = (field: Fields): Fields =>
  field === Fields.Input ? Fields.Output : Fields.Input;

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
    case Actions.SetFeeRate: {
      return {
        ...state,
        feeRate: action.payload,
      };
    }
    case Actions.SetToken: {
      const { field, decimals, address, symbol, swapType } = action.payload;
      return {
        ...state,
        values: {
          ...state.values,
          [field]: parseAmounts({
            ...state.values[field],
            token: { decimals, address, symbol },
          }),
          ...(swapType
            ? {
                [getOtherField(field)]: parseAmounts({
                  ...state.values[field],
                  token: { ...state.mUSD },
                }),
              }
            : null),
        },
        ...(swapType
          ? {
              transactionType: getOtherTransactionType(state.transactionType),
            }
          : null),
      };
    }
    case Actions.SetQuantity: {
      const { field, simpleAmount } = action.payload;

      const otherField = getOtherField(field);
      const {
        feeRate,
        transactionType,
        values: { [field]: tokenQ, [otherField]: otherTokenQ },
      } = state;

      const newTokenQ = parseAmounts({
        ...tokenQ,
        amount: { ...tokenQ.amount, simple: simpleAmount },
      });

      let otherTokenSimpleAmount: string | null = null;
      if (transactionType === TransactionType.Mint) {
        otherTokenSimpleAmount = simpleAmount;
      } else if (
        transactionType === TransactionType.Redeem &&
        feeRate &&
        newTokenQ.amount.exact &&
        newTokenQ.token.decimals
      ) {
        // ethers BigNumber doesn't do scientific notation (1e18)
        const divisor = new BigNumber(10).pow(newTokenQ.token.decimals);

        const feeAmountExact = newTokenQ.amount.exact.mul(feeRate).div(divisor);

        const netAmountExact =
          field === Fields.Input
            ? newTokenQ.amount.exact.sub(feeAmountExact)
            // FIXME wrong calculation
            : newTokenQ.amount.exact.add(feeAmountExact);

        otherTokenSimpleAmount = formatUnits(
          netAmountExact,
          newTokenQ.token.decimals,
        );
      }

      return {
        ...state,
        values: {
          ...state.values,
          [field]: newTokenQ,
          [otherField]: parseAmounts({
            ...otherTokenQ,
            amount: {
              ...otherTokenQ.amount,
              simple: otherTokenSimpleAmount,
            },
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
      payload: getOtherTransactionType(transactionType),
    });
  }, [dispatch, transactionType]);

  const setError = useCallback<Dispatch['setError']>(
    (reason, field) => {
      dispatch({
        type: Actions.SetError,
        payload: reason === null ? null : { reason, field },
      });
    },
    [dispatch],
  );

  const setToken = useCallback(
    (
      field: Fields,
      payload: {
        decimals: number;
        address: string;
        symbol: string;
      } | null,
    ) => {
      const otherField = getOtherField(field);
      const { [field]: tokenQ, [otherField]: otherTokenQ } = state.values;

      // Handle unsetting the token
      if (payload === null) {
        dispatch({
          type: Actions.SetToken,
          payload: { field, address: null, symbol: null, decimals: null },
        });
        return;
      }

      // Ignore no change
      if (payload.address === tokenQ.token?.address) return;

      // If the input token is set to the output token, change the type instead.
      if (payload.address === otherTokenQ.token?.address) {
        swapTransactionType();
        return;
      }

      // If neither token will be mUSD, set the other token to MUSD (change type)
      const swapType = Boolean(
        payload.address &&
          mUSD.address &&
          payload.address !== mUSD.address &&
          otherTokenQ.token.address !== mUSD.address,
      );

      dispatch({
        type: Actions.SetToken,
        payload: { field, swapType, ...payload },
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

  const setFeeRate = useCallback<Dispatch['setFeeRate']>(
    feeRate => {
      dispatch({
        type: Actions.SetFeeRate,
        payload: feeRate,
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
        setFeeRate,
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
      setFeeRate,
      startSubmission,
      endSubmission,
    ],
  );
};
