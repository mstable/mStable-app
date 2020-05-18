import { formatUnits } from 'ethers/utils';
import { Reducer } from 'react';
import { TokenQuantity } from '../../../types';
import { Action, Actions, Fields, Mode, State } from './types';
import { parseAmount } from '../../../web3/amounts';

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

export const initialState: State = Object.freeze({
  error: null,
  mAssetData: null,
  mode: Mode.Swap,
  values: {
    input: initialTokenQuantityField,
    output: initialTokenQuantityField,
    feeAmountSimple: null,
  },
});

const getOtherField = (field: Fields): Fields =>
  field === Fields.Input ? Fields.Output : Fields.Input;

const calculateSwapAmount = (
  field: Fields,
  tokenQ: TokenQuantity,
  otherTokenQ: TokenQuantity,
  swapFee: string | undefined,
): [string | null, string | null] => {
  if (
    !(
      swapFee &&
      tokenQ.amount.exact &&
      tokenQ.token.decimals &&
      (field === Fields.Input || otherTokenQ.token.decimals)
    )
  ) {
    return [null, null];
  }

  const feeAmount = tokenQ.amount.exact.mul(swapFee).div((1e18).toString());

  return [
    formatUnits(
      field === Fields.Input
        ? tokenQ.amount.exact.sub(feeAmount)
        : tokenQ.amount.exact.add(feeAmount),
      tokenQ.token.decimals,
    ),
    formatUnits(feeAmount, tokenQ.token.decimals),
  ];
};

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetError:
      return { ...state, error: action.payload };
    case Actions.SetToken: {
      const { field, decimals, address, symbol } = action.payload;
      const otherField = getOtherField(field);

      const {
        mAssetData,
        mode: prevMode,
        values: {
          [field]: prevTokenQ,
          [otherField]: prevOtherTokenQ,
          feeAmountSimple: prevFeeAmountSimple,
        },
      } = state;

      const { token: { address: massetAddress } = { address: null }, feeRate } =
        mAssetData || {};
      const isMasset = address && address === massetAddress;

      if (isMasset && field === Fields.Input) {
        // It it not possible to use massets as input (redeeming)
        return state;
      }

      const mode =
        field === Fields.Output
          ? isMasset
            ? Mode.MintSingle
            : Mode.Swap
          : prevMode;

      // TODO too complex
      const [otherAmountSimple, feeAmountSimple] = isMasset
        ? [prevOtherTokenQ.formValue, null]
        : prevMode === Mode.MintSingle && mode === Mode.Swap
        ? calculateSwapAmount(
            Fields.Input,
            prevOtherTokenQ,
            prevTokenQ,
            feeRate as string,
          )
        : [prevOtherTokenQ.formValue, prevFeeAmountSimple];

      // TODO bug: should set the amount to the other token quantity
      // (and apply the fee if needed) if this field's amount is not set
      const amountSimple = isMasset
        ? prevOtherTokenQ.formValue
        : prevTokenQ.formValue;

      const invertTokens = address && address === prevOtherTokenQ.token.address;

      return {
        ...state,
        mode,
        values: {
          ...state.values,
          [field]: {
            formValue: amountSimple,
            amount: parseAmount(amountSimple, decimals),
            token: invertTokens
              ? prevOtherTokenQ.token
              : { decimals, address, symbol },
          },
          [otherField]: {
            formValue: otherAmountSimple,
            amount: parseAmount(
              otherAmountSimple,
              prevOtherTokenQ.token.decimals,
            ),
            token: invertTokens ? prevTokenQ.token : prevOtherTokenQ.token,
          },
          feeAmountSimple,
        },
      };
    }
    case Actions.InvertDirection: {
      const {
        mAssetData,
        mode,
        values: { input, output, feeAmountSimple: prevFeeAmountSimple },
      } = state;

      // It should not be possible to invert the direction when minting
      if (mode === Mode.MintSingle) return state;

      const feeRate = mAssetData?.feeRate as string;

      const equalAmounts =
        input.amount.exact &&
        output.amount.exact &&
        input.amount.exact.eq(output.amount.exact);

      const [otherAmountSimple, feeAmountSimple] = equalAmounts
        ? calculateSwapAmount(Fields.Input, input, output, feeRate)
        : [input.formValue, prevFeeAmountSimple];

      return {
        ...state,
        error: null,
        values: {
          ...state.values,
          input: {
            // Usually, only the token should be changed for the input, because
            // the input amount will always be greater than the output amount.
            // Edge cases:
            // - If both fields have values, keep the input value.
            // - If input has a value, but output does not,
            //   remove the value.
            // - If input does not have a value, but output does,
            //   take the value of output.
            formValue: input.formValue
              ? output.formValue
                ? input.formValue
                : null
              : output.formValue,

            amount: parseAmount(input.formValue, output.token.decimals),
            token: output.token,
          },
          output: {
            // The output takes the input values, plus special handling for
            // the amount.
            ...input,
            // Edge cases (as above).
            formValue: output.formValue
              ? input.formValue
                ? output.formValue
                : null
              : input.formValue,

            amount: parseAmount(otherAmountSimple, input.token.decimals),
          },
          feeAmountSimple,
        },
      };
    }
    case Actions.SetQuantity: {
      const { field, formValue } = action.payload;

      const otherField = getOtherField(field);
      const {
        mAssetData,
        mode,
        values: { [field]: prevTokenQ, [otherField]: prevOtherTokenQ },
      } = state;
      const feeRate = mAssetData?.feeRate as string;

      const tokenQ = {
        ...prevTokenQ,
        formValue,
        amount: parseAmount(formValue, prevTokenQ.token.decimals),
      };

      // When swapping, the fee must be applied
      const [otherAmountSimple, feeAmountSimple] =
        mode === Mode.Swap
          ? calculateSwapAmount(field, tokenQ, prevOtherTokenQ, feeRate)
          : [formValue, null];

      const otherTokenQ = {
        ...prevOtherTokenQ,
        ...(prevOtherTokenQ.token.address
          ? {
              formValue: otherAmountSimple,
              amount: parseAmount(
                otherAmountSimple,
                prevOtherTokenQ.token.decimals,
              ),
            }
          : null),
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
    case Actions.UpdateMassetData: {
      return { ...state, mAssetData: action.payload };
    }
    default:
      throw new Error('Unhandled action type');
  }
};
