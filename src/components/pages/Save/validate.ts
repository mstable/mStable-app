import { State, Reasons, TransactionType } from './types';

const validate = ({
  data: { exchangeRate, mUsdToken, savingsBalance, allowance },
  values: {
    input: {
      token: { address: inputAddress },
      amount: { exact: inputAmount },
      amountInCredits,
    },
    transactionType,
  },
}: State): string | undefined => {
  if (
    !inputAmount ||
    (transactionType === TransactionType.Withdraw && !amountInCredits)
  ) {
    return Reasons.AmountMustBeSet;
  }

  if (!inputAmount.gt(0)) {
    return Reasons.AmountMustBeGreaterThanZero;
  }

  if (!inputAddress) {
    return Reasons.TokenMustBeSelected;
  }

  if (!(mUsdToken?.balance && exchangeRate && savingsBalance?.creditsExact)) {
    return Reasons.FetchingData;
  }

  if (transactionType === TransactionType.Deposit) {
    if (inputAmount.gt(mUsdToken.balance)) {
      return Reasons.DepositAmountMustNotExceedTokenBalance;
    }

    if (!allowance || allowance?.lt(inputAmount)) {
      return Reasons.MUSDMustBeUnlocked;
    }
  }

  if (transactionType === TransactionType.Withdraw) {
    if (!savingsBalance?.creditsExact) {
      return Reasons.FetchingData;
    }

    if (amountInCredits?.gt(savingsBalance.creditsExact)) {
      return Reasons.WithdrawAmountMustNotExceedSavingsBalance;
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
