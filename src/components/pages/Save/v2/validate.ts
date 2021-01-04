import { SubscribedToken } from '../../../../types';
import { State, Reasons } from './types';

export const getInputToken = ({ exchange, massetState}: State): SubscribedToken | undefined => {
  const inputTokenAddress = exchange.input.token?.address;
  if (!inputTokenAddress || !massetState) return undefined;
  
  const { bAssets } = massetState;
  if (!bAssets[inputTokenAddress]) {
    if (inputTokenAddress === massetState.token.address) {
      return massetState.token;
    } if (inputTokenAddress === massetState.savingsContracts.v2?.token?.address) {
      return massetState.savingsContracts.v2?.token;
    }
    return undefined;
  } 
  return bAssets[inputTokenAddress].token
}

const validateInputToken = (state: State): boolean => {
  const { massetState, exchange } = state;
  const inputToken = getInputToken(state);
  const inputAmount = exchange.input.amount;
  
  if (!inputAmount || !massetState || !inputToken) return false;
  
  const massetAddress = massetState.address;
  return !(inputToken.allowances[massetAddress]?.exact.lt(inputAmount.exact));
}

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
  
  const inputToken = getInputToken(state);
  const inputAmount = exchange.input.amount;
  const outputAmount = exchange.output.amount;
  
  if (!inputToken) {
    return [false, Reasons.FetchingData];
  }
  
  if (
    !inputAmount || !outputAmount
  ) {
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
    exchange: {
      ...state.exchange,
      input: {
        ...state.exchange.input,
        needsUnlock: validateInputToken(state)
      }
    }
  };
};
