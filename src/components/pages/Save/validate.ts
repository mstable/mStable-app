import { State, Reasons, TransactionType } from './types';

const validateSave = ({
  dataState,
  amount,
  amountInCredits,
  transactionType,
}: State): [false, Reasons] | [true] => {
  if (!dataState) {
    return [false, Reasons.FetchingData];
  }

  const { mAsset, savingsContract } = dataState;

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
    if (amount.exact.gt(mAsset.balance.exact)) {
      return [false, Reasons.DepositAmountMustNotExceedTokenBalance];
    }

    if (savingsContract.mAssetAllowance.exact.lt(amount.exact)) {
      return [false, Reasons.MUSDMustBeApproved];
    }
  }

  if (transactionType === TransactionType.Withdraw) {
    if (
      !savingsContract.savingsBalance.credits ||
      !savingsContract.latestExchangeRate
    ) {
      return [false, Reasons.FetchingData];
    }

    if (
      amountInCredits?.exact.gt(savingsContract.savingsBalance.credits.exact)
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
