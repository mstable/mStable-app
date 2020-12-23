import { SubscribedToken } from '../../../../types';
import { State, Reasons } from './types';

const validateSave = ({
  massetState,
  exchange
}: State): [false, Reasons] | [true] => {
  if (!(massetState && massetState.savingsContracts.v2)) {
    return [false, Reasons.FetchingData];
  }
  
  // All validation logic is on input side for now.
  // TODO - make validation for output side too.
  
  const { bAssets } = massetState;
  const inputTokenAddress = exchange.input.token?.address;
  
  if (!inputTokenAddress) {
    return [false, Reasons.FetchingData];
  }
  
  // TODO - doesn't handle imusd mapping.
  const getInputToken = (): SubscribedToken | undefined => {
    if (!bAssets[inputTokenAddress]) {
      if (inputTokenAddress === massetState.token.address) {
        return massetState.token;
      } if (inputTokenAddress === massetState.savingsContracts.v2?.token?.address) {
        return massetState.savingsContracts.v2?.token;
      }
    } else {
      return bAssets[inputTokenAddress].token
    }
  }
  
  const inputToken = getInputToken();
  
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

  // TODO - handle allowance.
  
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
