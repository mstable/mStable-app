import { State } from './types';

const validate = ({ redemption, mAssetData }: State): string | undefined => {
  if (redemption.amount.exact && mAssetData?.token.balance) {
    if (redemption.amount.exact.gt(mAssetData.token.balance)) {
      return 'Insufficient balance';
    }
    if (redemption.amount.exact.eq(0)) {
      return 'Amount must be greater than zero';
    }
  }

  return undefined;
};

export const applyValidation = (state: State): State => {
  const { touched } = state;
  const error = touched ? validate(state) : undefined;
  return {
    ...state,
    error,
    valid: touched && !error,
  };
};
