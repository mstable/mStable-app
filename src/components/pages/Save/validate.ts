import { State, Reasons, TransactionType } from './types';

const validateSave = ({
  massetState,
  amount,
  amountInCredits,
  transactionType,
}: State): [false, Reasons] | [true] => {
  if (!(massetState && massetState.savingsContracts.v1)) {
    return [false, Reasons.FetchingData];
  }

  if (
    !amount ||
    (transactionType === TransactionType.Withdraw && !amountInCredits)
  ) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (transactionType === TransactionType.Deposit) {
    if (amount.exact.gt(massetState.token.balance.exact)) {
      return [false, Reasons.DepositAmountMustNotExceedTokenBalance];
    }

    if (
      massetState.savingsContracts.v1.mAssetAllowance.exact.lt(amount.exact)
    ) {
      return [false, Reasons.MUSDMustBeApproved];
    }
  }

  if (transactionType === TransactionType.Withdraw) {
    if (
      !massetState.savingsContracts.v1.savingsBalance.credits ||
      !massetState.savingsContracts.v1.latestExchangeRate
    ) {
      return [false, Reasons.FetchingData];
    }

    if (
      amountInCredits?.exact.gt(
        massetState.savingsContracts.v1.savingsBalance.credits.exact,
      )
    ) {
      return [false, Reasons.WithdrawAmountMustNotExceedSavingsBalance];
    }
  }

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
