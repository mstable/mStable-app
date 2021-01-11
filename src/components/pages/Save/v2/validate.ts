import { State, Reasons } from './types';

const validateSave = (state: State): [false, Reasons] | [true] => {
  const { massetState, exchange } = state;

  if (!(massetState && massetState.savingsContracts.v2)) {
    return [false, Reasons.FetchingData];
  }

  // All validation logic is on input side for now.
  // TODO - make validation for output side too.

  const inputTokenAddress = exchange.input.token?.address;

  if (!inputTokenAddress) {
    return [false, Reasons.FetchingData];
  }

  const inputToken = exchange.input.token;
  const inputAmount = exchange.input.amount;
  const outputAmount = exchange.output.amount;

  if (!inputToken) {
    return [false, Reasons.FetchingData];
  }

  if (!inputAmount || !outputAmount) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (inputAmount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (inputAmount.exact.gt(inputToken.balance.exact)) {
    return [false, Reasons.DepositAmountMustNotExceedTokenBalance];
  }

  // TODO - either show on deposit click or don't show error at all
  // if (!inputToken.allowances[massetAddress]?.exact.lt(inputAmount.exact)) {
  //   return [false, Reasons.MUSDMustBeApproved];
  // }

  // TODO - handle imUSD withdrawal balance

  return [true];
};

export const validate = (state: State): State => {
  const { touched, initialized } = state;
  const ready = touched && initialized;
  const [valid, error] = ready ? validateSave(state) : [false];
  return {
    ...state,
    error,
    valid,
  };
};
