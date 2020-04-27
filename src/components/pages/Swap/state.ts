import { useCallback, useMemo, useReducer, Reducer } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import { TokenQuantity, TokenDetails } from '../../../types';
import { parseAmount } from '../../../web3/amounts';

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
      payload: { field: Fields; formValue: string | null };
    }
  | { type: Actions.SetTransactionType; payload: TransactionType };

interface State {
  values: {
    input: TokenQuantity;
    output: TokenQuantity;
    feeAmountSimple: string | null;
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
  setQuantity(field: Fields, formValue: string): void;
  startSubmission(): void;
  endSubmission(): void;
  swapTransactionType(): void;
}

const initialTokenQuantityField: TokenQuantity = Object.freeze({
  formValue: null,
  amount: {
    simple: null,
    exact: null,
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
    feeAmountSimple: null,
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

const calculateRedemptionAmount = (
  field: Fields,
  tokenQ: TokenQuantity,
  otherTokenQ: TokenQuantity,
  feeRate: BigNumber | null,
): {
  redemptionAmountSimple: string | null;
  feeAmountSimple: string | null;
} => {
  if (
    !(
      feeRate &&
      tokenQ.amount.exact &&
      tokenQ.token.decimals &&
      (field === Fields.Input || otherTokenQ.token.decimals)
    )
  ) {
    return { redemptionAmountSimple: null, feeAmountSimple: null };
  }

  const divisorDecimals =
    field === Fields.Input ? tokenQ.token.decimals : otherTokenQ.token.decimals;

  const divisor = new BigNumber(10).pow(
    divisorDecimals as NonNullable<typeof divisorDecimals>,
  );

  const feeAmount = tokenQ.amount.exact.mul(feeRate).div(divisor);

  return {
    redemptionAmountSimple: formatUnits(
      field === Fields.Input
        ? tokenQ.amount.exact.sub(feeAmount)
        : tokenQ.amount.exact.add(feeAmount),
      tokenQ.token.decimals,
    ),
    feeAmountSimple: formatUnits(feeAmount, tokenQ.token.decimals),
  };
};

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
      const { field, decimals, address, symbol } = action.payload;
      const {
        values: { [field]: prevTokenQ },
      } = state;

      return {
        ...state,
        values: {
          ...state.values,
          [field]: {
            ...prevTokenQ,
            amount: parseAmount(prevTokenQ.formValue, decimals),
            token: { decimals, address, symbol },
          },
        },
      };
    }
    case Actions.SetQuantity: {
      const { field, formValue } = action.payload;

      const otherField = getOtherField(field);
      const {
        feeRate,
        transactionType,
        values: { [field]: prevTokenQ, [otherField]: prevOtherTokenQ },
      } = state;

      const tokenQ = {
        ...prevTokenQ,
        formValue,
        amount: parseAmount(formValue, prevTokenQ.token.decimals),
      };

      // When redeeming, the fee must be applied
      const { redemptionAmountSimple: otherAmountSimple, feeAmountSimple } =
        transactionType === TransactionType.Redeem
          ? calculateRedemptionAmount(field, tokenQ, prevOtherTokenQ, feeRate)
          : { redemptionAmountSimple: formValue, feeAmountSimple: null };

      const otherTokenQ = {
        ...prevOtherTokenQ,
        formValue: otherAmountSimple,
        amount: parseAmount(otherAmountSimple, prevOtherTokenQ.token.decimals),
      };

      return {
        ...state,
        values: {
          ...state.values,
          [field]: tokenQ,
          [otherField]: otherTokenQ,
          feeAmountSimple,
        },
      };
    }
    case Actions.SetTransactionType: {
      const transactionType = action.payload;
      const {
        values: { input, output },
        transactionType: prevTransactionType,
        feeRate,
      } = state;

      // Do nothing if the type is the same
      if (transactionType === prevTransactionType) return state;

      // When the transaction type is being set to redeem, the fee
      // must be applied to the output amount; otherwise, use the input amount.
      const { redemptionAmountSimple: otherAmountSimple, feeAmountSimple } =
        transactionType === TransactionType.Redeem
          ? calculateRedemptionAmount(Fields.Input, output, input, feeRate)
          : {
              redemptionAmountSimple: input.formValue,
              feeAmountSimple: null,
            };

      return {
        ...state,
        error: null,
        values: {
          ...state.values,
          input: {
            // Only the token should be changed for the input, because the
            // input amount will always be greater than the output amount.
            ...input,
            amount: parseAmount(input.formValue, output.token.decimals),
            token: output.token,
          },
          output: {
            // The output takes the input values, plus special handling for
            // the amount.
            ...input,
            formValue: otherAmountSimple,
            amount: parseAmount(otherAmountSimple, input.token.decimals),
          },
          feeAmountSimple,
        },
        transactionType,
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
      if (payload.address === tokenQ.token.address) return;

      // If the input token is set to the output token, or field being set is
      // currently mUSD, change the type first.
      if (
        payload.address === otherTokenQ.token?.address ||
        tokenQ.token.address === mUSD.address
      ) {
        swapTransactionType();
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
    (field: Fields, formValue: string) => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, field },
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
