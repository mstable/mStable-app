import { State, Reasons } from './types';

const validateSave = ({
  massetState,
}: State): [false, Reasons] | [true] => {
  if (!(massetState && massetState.savingsContracts.v1)) {
    return [false, Reasons.FetchingData];
  }
  // TODO 
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
