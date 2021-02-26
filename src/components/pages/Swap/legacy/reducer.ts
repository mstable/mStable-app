import { BigNumber, BigNumberish, utils } from 'ethers';
import { Reducer } from 'react';
import { Fields, TokenQuantityV1 } from '../../../../types';
import { parseAmount } from '../../../../web3/amounts';
import { EXP_SCALE } from '../../../../constants';
import { Action, Actions, State } from './types';
import { applyValidation } from './validation';

const initialTokenQuantityField: TokenQuantityV1 = {
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
  feeRate: BigNumberish,
): [string, string] => {
  const feeAmount = amount.mul(feeRate).div(EXP_SCALE);

  return [
    utils.formatUnits(
      isInputField ? amount.sub(feeAmount) : amount.add(feeAmount),
      decimals,
    ),
    utils.formatUnits(feeAmount, decimals),
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
    massetState,
    values: {
      [field]: { token: prevToken, formValue: prevFormValue },
      [otherField]: { token: prevOtherToken, formValue: prevOtherFormValue },
      feeAmountSimple: prevFeeAmountSimple,
    },
  } = state;

  const { address: massetAddress, feeRate } = massetState || {};

  const outputAddress = state.values[Fields.Output].token.address;
  const prevIsMint = outputAddress && outputAddress === massetAddress;

  // If the data isn't there, changes can't be made
  if (!(feeRate && massetAddress)) {
    return state.values;
  }

  let tokenQ: TokenQuantityV1;
  let otherTokenQ: TokenQuantityV1;
  let feeAmountSimple: string | null = prevFeeAmountSimple;

  if (action.type === Actions.SetQuantity) {
    const { formValue } = action.payload;
    const isUnsetting = formValue === null;

    tokenQ = {
      formValue,
      amount: parseAmount(formValue as string, prevToken.decimals),
      token: prevToken,
    };

    // Control the fee amount and other form amount value
    let otherFormValue: string | undefined = prevOtherFormValue;
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
      amount: parseAmount(otherFormValue as string, prevOtherToken.decimals),
      token: prevOtherToken,
    };
  } else {
    const { address, symbol, decimals } = action.payload;

    // Unsetting this field
    const isUnsetting = address === null;

    // Setting this field from a basset to a masset
    const isMint = isInputField
      ? prevOtherToken.address === massetAddress
      : address === massetAddress;

    // Setting this field to the other token
    const isInvert = address === prevOtherToken.address;

    // It it not possible to use massets as input (redeeming)
    if (isInputField && address === massetAddress) {
      return state.values;
    }

    const token = isInvert ? prevOtherToken : { address, decimals, symbol };
    const otherToken = isInvert
      ? // If setting the token to the other token, and it was a mint,
        // unset the other token (because the masset can't be used for input).
        prevIsMint
        ? { address: null, decimals: null, symbol: null }
        : prevToken
      : prevOtherToken;

    // Control the fee amount and form amount values
    let formValue: string | undefined = prevFormValue;
    let otherFormValue: string | undefined = prevOtherFormValue;
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
      amount: parseAmount(formValue as string, token.decimals),
      token,
    };
    otherTokenQ = {
      formValue: otherFormValue,
      amount: parseAmount(otherFormValue as string, otherToken.decimals),
      token: otherToken,
    };
  }

  return {
    [Fields.Input]: isInputField ? tokenQ : otherTokenQ,
    [Fields.Output]: isInputField ? otherTokenQ : tokenQ,
    feeAmountSimple,
  };
};

const reduce: Reducer<State, Action> = (state, action) => {
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

    case Actions.Data:
      return applyValidation({ ...state, massetState: action.payload });

    default:
      throw new Error('Unhandled action type');
  }
};

// XXX Each reducer action is re-run because `applyValidation` sets
// `applySwapFee`, which is in turn checked by `calculateSwapValues`.
// TODO later: refactor to use an explicit pipeline
export const reducer: Reducer<State, Action> = (state, action) =>
  reduce(reduce(state, action), action);
