import { StakingRewardsContract } from '../../../context/earn/types';
import { Reasons, State, Tabs } from './types';

const getReasonMessage = (reason: Reasons | undefined): string | undefined => {
  switch (reason) {
    case Reasons.AmountExceedsApprovedAmount:
      return 'Amount exceeds approved amount; in order for this contract to spend your tokens, you first need to give it approval';

    case Reasons.FetchingData:
      return 'Fetching data';

    case Reasons.AmountMustBeSet:
      return 'Amount must be set';

    case Reasons.AmountMustBeGreaterThanZero:
      return 'Amount must be greater than zero';

    case Reasons.AmountExceedsBalance:
      return 'Amount exceeds balance';

    default:
      return undefined;
  }
};

type ValidationResult = [boolean] | [boolean, Reasons];

const validateActiveTab = (
  state: State & { stakingRewardsContract: StakingRewardsContract },
): ValidationResult => {
  const { activeTab } = state;
  switch (activeTab) {
    case Tabs.Stake: {
      const {
        stake,
        stakingRewardsContract: {
          address,
          stakingToken: { address: stakingTokenAddress },
        },
        tokens: { [stakingTokenAddress]: stakingToken },
      } = state;

      if (!stake.amount) {
        return [false, Reasons.AmountMustBeSet];
      }

      if (stake.amount.exact.lte(0)) {
        return [false, Reasons.AmountMustBeGreaterThanZero];
      }

      if (!(stakingToken?.balance && stakingToken.allowances[address]?.exact)) {
        return [false, Reasons.FetchingData];
      }

      if (stake.amount.exact.gt(stakingToken.balance.exact)) {
        return [false, Reasons.AmountExceedsBalance];
      }

      if (stake.amount.exact.gt(stakingToken.allowances[address].exact)) {
        return [false, Reasons.AmountExceedsApprovedAmount];
      }

      return [true];
    }
    case Tabs.Exit: {
      const {
        exit,
        stakingRewardsContract: { stakingBalance },
      } = state;

      if (!exit.amount) {
        return [false, Reasons.AmountMustBeSet];
      }

      if (exit.amount.exact.lte(0)) {
        return [false, Reasons.AmountMustBeGreaterThanZero];
      }

      if (!stakingBalance) {
        return [false, Reasons.FetchingData];
      }

      if (exit.amount.exact.gt(stakingBalance.exact)) {
        return [false, Reasons.AmountExceedsBalance];
      }

      return [true];
    }

    default:
      return [true];
  }
};

const getValidationResult = (state: State): ValidationResult => {
  const activeTab = state[state.activeTab];
  const ready = activeTab.touched && !!state.stakingRewardsContract;

  if (!ready) return [false];

  return validateActiveTab(
    state as State & { stakingRewardsContract: StakingRewardsContract },
  );
};

export const validate = (state: State): State => {
  const [valid, reason] = getValidationResult(state);
  const error = valid ? undefined : getReasonMessage(reason);

  switch (state.activeTab) {
    case Tabs.Stake:
      return {
        ...state,
        stake: {
          ...state.stake,
          error,
          needsUnlock: reason === Reasons.AmountExceedsApprovedAmount,
          valid,
        },
      };

    case Tabs.Exit:
      return {
        ...state,
        exit: {
          ...state.exit,
          error,
          valid,
        },
      };

    default:
      return state;
  }
};
