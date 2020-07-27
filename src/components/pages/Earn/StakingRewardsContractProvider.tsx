import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  useEffect,
} from 'react';
import useInterval from 'react-use/lib/useInterval';

import { StakingRewards } from '../../../typechain/StakingRewards.d';
import { BigDecimal } from '../../../web3/BigDecimal';
import { SCALE } from '../../../web3/constants';
import { useTokens } from '../../../context/DataProvider/TokensProvider';
import { useSignerContext } from '../../../context/SignerProvider';
import { StakingRewardsFactory } from '../../../typechain/StakingRewardsFactory';
import { SubscribedToken } from '../../../types';
import {
  useStakingRewardsContract,
  useTokenWithPrice,
} from '../../../context/earn/EarnDataProvider';
import { StakingRewardsContract } from '../../../context/earn/types';
import { Dispatch, Tabs, State, Actions } from './types';
import { reducer } from './reducer';

interface Props {
  address: string;
}

const initialState: State = {
  activeTab: Tabs.Stake,
  initialized: false,
  tokens: {},
  stake: {
    valid: false,
    touched: false,
    formValue: null,
    needsUnlock: false,
  },
};

const useRewardsEarnedInterval = (
  stakingRewardsContract?: StakingRewardsContract,
): { rewardsEarned?: BigDecimal; platformRewardsEarned?: BigDecimal } => {
  const [value, setValue] = useState<
    ReturnType<typeof useRewardsEarnedInterval>
  >({});

  useInterval(() => {
    if (!stakingRewardsContract) {
      return setValue({});
    }

    const {
      lastUpdateTime,
      periodFinish,
      platformRewards: {
        platformReward,
        platformRewardPerTokenStoredNow,
        platformRewardRate,
      } = {},
      rewardPerTokenStoredNow,
      rewardRate,
      stakingBalance,
      stakingReward,
      totalSupply: { exact: totalTokens },
    } = stakingRewardsContract;

    const rewardPerToken = (() => {
      if (totalTokens.eq(0)) {
        // If there is no StakingToken liquidity, avoid div(0)
        return { rewardPerTokenStoredNow, platformRewardPerTokenStoredNow };
      }

      const lastTimeRewardApplicable = Math.min(
        periodFinish,
        Math.floor(Date.now() / 1e3),
      );

      const timeSinceLastUpdate = lastTimeRewardApplicable - lastUpdateTime;

      // New reward units to distribute = rewardRate * timeSinceLastUpdate
      const rewardUnitsToDistribute = rewardRate.mul(timeSinceLastUpdate);
      const platformRewardUnitsToDistribute = platformRewardRate?.mul(
        timeSinceLastUpdate,
      );

      // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
      const unitsToDistributePerToken = rewardUnitsToDistribute
        .mul(SCALE)
        .div(totalTokens);
      const platformUnitsToDistributePerToken = platformRewardUnitsToDistribute
        ?.mul(SCALE)
        .div(totalTokens);

      return {
        rewardPerTokenStoredNow: rewardPerTokenStoredNow.add(
          unitsToDistributePerToken,
        ),
        platformRewardPerTokenStoredNow: platformRewardPerTokenStoredNow?.add(
          platformUnitsToDistributePerToken || 0,
        ),
      };
    })();

    // Current rate per token - rate user previously received
    const userRewardDelta = rewardPerToken.rewardPerTokenStoredNow.sub(
      stakingReward.amountPerTokenPaid.exact,
    );
    const platformUserRewardDelta = rewardPerToken.platformRewardPerTokenStoredNow?.sub(
      platformReward?.amountPerTokenPaid.exact || 0,
    );

    // New reward = staked tokens * difference in rate
    const userNewReward = stakingBalance.mulTruncate(userRewardDelta);
    const userNewPlatformReward = platformUserRewardDelta
      ? stakingBalance.mulTruncate(platformUserRewardDelta)
      : undefined;

    // Add to previous rewards
    const summedRewards = stakingReward.amount.add(userNewReward);
    const summedPlatformRewards =
      userNewPlatformReward && platformReward
        ? platformReward.amount.add(userNewPlatformReward)
        : undefined;

    return setValue({
      rewardsEarned: summedRewards,
      platformRewardsEarned: summedPlatformRewards,
    });
  }, 1e3);

  return value;
};

const dispatchCtx = createContext<Dispatch>({} as never);

const stateCtx = createContext<State>({} as never);

const rewardsEarnedCtx = createContext<{
  rewardsEarned?: BigDecimal;
  platformRewardsEarned?: BigDecimal;
}>({});

const contractCtx = createContext<StakingRewards | undefined>(undefined);

export const StakingRewardsContractProvider: FC<Props> = ({
  children,
  address,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const stakingRewardsContract = useStakingRewardsContract(address);

  const tokens = useTokens();

  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: { stakingRewardsContract, tokens },
    });
  }, [stakingRewardsContract, tokens, dispatch]);

  const setActiveTab = useCallback<Dispatch['setActiveTab']>(
    tab => {
      dispatch({ type: Actions.SetActiveTab, payload: tab });
    },
    [dispatch],
  );

  const setStakeAmount = useCallback<Dispatch['setStakeAmount']>(
    (name, amount) => {
      dispatch({ type: Actions.SetStakeAmount, payload: amount });
    },
    [dispatch],
  );

  const setMaxStakeAmount = useCallback<Dispatch['setMaxStakeAmount']>(() => {
    dispatch({ type: Actions.SetMaxStakeAmount });
  }, [dispatch]);

  const rewardsEarned = useRewardsEarnedInterval(state.stakingRewardsContract);

  const signer = useSignerContext();

  const contract = useMemo(
    () => (signer ? StakingRewardsFactory.connect(address, signer) : undefined),
    [address, signer],
  );

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({ setActiveTab, setMaxStakeAmount, setStakeAmount }),
        [setActiveTab, setMaxStakeAmount, setStakeAmount],
      )}
    >
      <stateCtx.Provider value={state}>
        <contractCtx.Provider value={contract}>
          <rewardsEarnedCtx.Provider value={rewardsEarned}>
            {children}
          </rewardsEarnedCtx.Provider>
        </contractCtx.Provider>
      </stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const useStakingRewardsContractState = (): State => useContext(stateCtx);

export const useStakingRewardContractDispatch = (): Dispatch =>
  useContext(dispatchCtx);

export const useCurrentStakingRewardsContractCtx = ():
  | StakingRewards
  | undefined => useContext(contractCtx);

export const useRewardsEarned = (): {
  rewardsEarned?: BigDecimal;
  platformRewardsEarned?: BigDecimal;
} => useContext(rewardsEarnedCtx);

export const useCurrentStakingRewardsContract = (): State['stakingRewardsContract'] =>
  useStakingRewardsContractState().stakingRewardsContract;

export const useCurrentRewardsToken = (): SubscribedToken | undefined => {
  const stakingRewards = useCurrentStakingRewardsContract();
  return useTokenWithPrice(stakingRewards?.rewardsToken.address);
};

export const useCurrentPlatformToken = (): SubscribedToken | undefined => {
  const stakingRewards = useCurrentStakingRewardsContract();
  return useTokenWithPrice(
    stakingRewards?.platformRewards?.platformToken.address,
  );
};

export const useCurrentStakingToken = (): SubscribedToken | undefined => {
  const stakingRewards = useCurrentStakingRewardsContract();
  return useTokenWithPrice(stakingRewards?.stakingToken.address);
};
