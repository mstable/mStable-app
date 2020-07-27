import { StakingRewardsContract } from '../../../context/earn/types';
import { Reasons, State, Tabs } from './types';

const getReasonMessage = (reason: Reasons | undefined): string | undefined => {
  switch (reason) {
    case Reasons.AmountExceedsApprovedAmount:
      return 'Amount exceeds approved amount';

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

      if (
        !(
          stakingToken?.balance &&
          stakingToken.allowances[address]?.exact
        )
      ) {
        return [false, Reasons.FetchingData];
      }

      if (stake.amount.exact.gt(stakingToken.balance.exact)) {
        return [false, Reasons.AmountExceedsBalance];
      }

      if (
        stake.amount.exact.gt(
          stakingToken.allowances[address].exact,
        )
      ) {
        return [false, Reasons.AmountExceedsApprovedAmount];
      }

      return [true];
    }

    default:
      return [true];
  }
};

const getValidationResult = (state: State): ValidationResult => {
  const ready = state.stake.touched && !!state.stakingRewardsContract;

  if (!ready) return [false];

  return validateActiveTab(state as State & { stakingRewardsContract: StakingRewardsContract });
};

export const validate = (state: State): State => {
  const [valid, reason] = getValidationResult(state);

  return state.activeTab === Tabs.Stake
    ? {
        ...state,
        stake: {
          ...state.stake,
          error: valid ? undefined : getReasonMessage(reason),
          needsUnlock: reason === Reasons.AmountExceedsApprovedAmount,
          valid,
        },
      }
    : state;
};
