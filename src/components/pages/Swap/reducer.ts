import { BigNumber, formatUnits } from 'ethers/utils';
import { Reducer } from 'react';
import { TokenQuantity } from '../../../types';
import { parseAmount } from '../../../web3/amounts';
import { EXP_SCALE } from '../../../web3/constants';
import { Action, Actions, Fields, State } from './types';
import { applyValidation } from './validation';

const initialTokenQuantityField: TokenQuantity = {
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
};

export const initialState: State = {
  touched: false,
  valid: false,
  needsUnlock: false,
  applySwapFee: false,
  values: {
    input: initialTokenQuantityField,
    output: initialTokenQuantityField,
    feeAmountSimple: null,
  },
};

const getOtherField = (field: Fields): Fields =>
  field === Fields.Input ? Fields.Output : Fields.Input;

const calculateAmountAndFee = (
  isInputField: boolean,
  amount: BigNumber,
  decimals: number,
  feeRate: string,
): [string, string] => {
  const feeAmount = amount.mul(feeRate).div(EXP_SCALE);

  return [
    formatUnits(
      isInputField ? amount.sub(feeAmount) : amount.add(feeAmount),
      decimals,
    ),
    formatUnits(feeAmount, decimals),
  ];
};

const calculateSwapValues = (
  state: State,
  action: Extract<Action, { type: Actions.SetToken | Actions.SetQuantity }>,
): State['values'] => {
  const { field } = action.payload;
  const otherField = getOtherField(field);
  const isInputField = field === Fields.Input;

  const {
    applySwapFee,
    mAssetData,
    values: {
      [field]: { token: prevToken, formValue: prevFormValue },
      [otherField]: { token: prevOtherToken, formValue: prevOtherFormValue },
      feeAmountSimple: prevFeeAmountSimple,
    },
  } = state;

  const feeRate = mAssetData?.feeRate;
  const mAssetAddress = mAssetData?.token.address;
  const outputAddress = state.values[Fields.Output].token.address;
  const prevIsMint = outputAddress && outputAddress === mAssetAddress;

  // If the data isn't there, changes can't be made
  if (!(feeRate && mAssetAddress)) {
    return state.values;
  }

  let tokenQ: TokenQuantity;
  let otherTokenQ: TokenQuantity;
  let feeAmountSimple: string | null = prevFeeAmountSimple;

  if (action.type === Actions.SetQuantity) {
    const { formValue } = action.payload;
    const isUnsetting = formValue === null;

    tokenQ = {
      formValue,
      amount: parseAmount(formValue, prevToken.decimals),
      token: prevToken,
    };

    // Control the fee amount and other form amount value
    let otherFormValue: string | null = prevOtherFormValue;
    if (prevIsMint || !applySwapFee) {
      otherFormValue = formValue;
      feeAmountSimple = null;
    } else if (isUnsetting) {
      feeAmountSimple = null;
    } else if (
      tokenQ.amount.exact &&
      tokenQ.token.decimals &&
      prevOtherToken.decimals
    ) {
      // If both tokens are set, apply the fee with the entered amount.
      [otherFormValue, feeAmountSimple] = calculateAmountAndFee(
        isInputField,
        tokenQ.amount.exact,
        tokenQ.token.decimals,
        feeRate,
      );
    }

    otherTokenQ = {
      formValue: otherFormValue,
      amount: parseAmount(otherFormValue, prevOtherToken.decimals),
      token: prevOtherToken,
    };
  } else {
    const { address, symbol, decimals } = action.payload;

    // Unsetting this field
    const isUnsetting = address === null;

    // Setting this field from a bAsset to a mAsset
    const isMint = isInputField
      ? prevOtherToken.address === mAssetAddress
      : address === mAssetAddress;

    // Setting this field to the other token
    const isInvert = address === prevOtherToken.address;

    // It it not possible to use mAssets as input (redeeming)
    if (isInputField && address === mAssetAddress) {
      return state.values;
    }

    const token = isInvert ? prevOtherToken : { address, decimals, symbol };
    const otherToken = isInvert
      ? // If setting the token to the other token, and it was a mint,
        // unset the other token (because the mAsset can't be used for input).
        prevIsMint
        ? { address: null, decimals: null, symbol: null }
        : prevToken
      : prevOtherToken;

    // Control the fee amount and form amount values
    let formValue: string | null = prevFormValue;
    let otherFormValue: string | null = prevOtherFormValue;
    if (isUnsetting) {
      feeAmountSimple = null;
    } else if (isInvert) {
      // Leave form values and fee as-is
    } else if (isMint || !applySwapFee) {
      formValue = otherFormValue;
      feeAmountSimple = null;
    } else if (token.decimals && otherToken.decimals && !feeAmountSimple) {
      // If both tokens are set and a fee isn't applied, apply the fee with
      // the available form value.
      if (formValue) {
        [otherFormValue, feeAmountSimple] = calculateAmountAndFee(
          isInputField,
          parseAmount(formValue, token.decimals).exact as BigNumber,
          token.decimals,
          feeRate,
        );
      } else if (otherFormValue) {
        [formValue, feeAmountSimple] = calculateAmountAndFee(
          !isInputField,
          parseAmount(otherFormValue, token.decimals).exact as BigNumber,
          token.decimals,
          feeRate,
        );
      }
    }

    tokenQ = {
      formValue,
      amount: parseAmount(formValue, token.decimals),
      token,
    };
    otherTokenQ = {
      formValue: otherFormValue,
      amount: parseAmount(otherFormValue, otherToken.decimals),
      token: otherToken,
    };
  }

  return {
    [Fields.Input]: isInputField ? tokenQ : otherTokenQ,
    [Fields.Output]: isInputField ? otherTokenQ : tokenQ,
    feeAmountSimple,
  };
};

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetToken:
      return applyValidation({
        ...state,
        values: calculateSwapValues(state, action),
      });

    case Actions.SetQuantity:
      return applyValidation({
        ...state,
        touched: true,
        values: calculateSwapValues(state, action),
      });

    case Actions.UpdateMassetData:
      return applyValidation({ ...state, mAssetData: action.payload });

    default:
      throw new Error('Unhandled action type');
  }
};
