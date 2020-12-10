/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface SavingsContractInterface extends Interface {
  functions: {
    allowance: TypedFunctionDescription<{
      encode([owner, spender]: [string, string]): string;
    }>;

    approve: TypedFunctionDescription<{
      encode([spender, amount]: [string, BigNumberish]): string;
    }>;

    automateInterestCollectionFlag: TypedFunctionDescription<{
      encode([_enabled]: [boolean]): string;
    }>;

    balanceOf: TypedFunctionDescription<{
      encode([account]: [string]): string;
    }>;

    balanceOfUnderlying: TypedFunctionDescription<{
      encode([_user]: [string]): string;
    }>;

    claimReward: TypedFunctionDescription<{ encode([]: []): string }>;

    creditBalances: TypedFunctionDescription<{
      encode([_user]: [string]): string;
    }>;

    decimals: TypedFunctionDescription<{ encode([]: []): string }>;

    decreaseAllowance: TypedFunctionDescription<{
      encode([spender, subtractedValue]: [string, BigNumberish]): string;
    }>;

    deposit: TypedFunctionDescription<{
      encode([_underlying, _beneficiary]: [BigNumberish, string]): string;
    }>;

    depositInterest: TypedFunctionDescription<{
      encode([_amount]: [BigNumberish]): string;
    }>;

    depositSavings: TypedFunctionDescription<{
      encode([_underlying]: [BigNumberish]): string;
    }>;

    earned: TypedFunctionDescription<{ encode([_account]: [string]): string }>;

    exchangeRate: TypedFunctionDescription<{ encode([]: []): string }>;

    getRewardToken: TypedFunctionDescription<{ encode([]: []): string }>;

    increaseAllowance: TypedFunctionDescription<{
      encode([spender, addedValue]: [string, BigNumberish]): string;
    }>;

    lastTimeRewardApplicable: TypedFunctionDescription<{
      encode([]: []): string;
    }>;

    lastUpdateTime: TypedFunctionDescription<{ encode([]: []): string }>;

    name: TypedFunctionDescription<{ encode([]: []): string }>;

    nexus: TypedFunctionDescription<{ encode([]: []): string }>;

    notifyRewardAmount: TypedFunctionDescription<{
      encode([_reward]: [BigNumberish]): string;
    }>;

    periodFinish: TypedFunctionDescription<{ encode([]: []): string }>;

    redeem: TypedFunctionDescription<{
      encode([_credits]: [BigNumberish]): string;
    }>;

    redeemUnderlying: TypedFunctionDescription<{
      encode([_underlying]: [BigNumberish]): string;
    }>;

    rewardPerToken: TypedFunctionDescription<{ encode([]: []): string }>;

    rewardPerTokenStored: TypedFunctionDescription<{ encode([]: []): string }>;

    rewardRate: TypedFunctionDescription<{ encode([]: []): string }>;

    rewards: TypedFunctionDescription<{ encode([]: [string]): string }>;

    rewardsDistributor: TypedFunctionDescription<{ encode([]: []): string }>;

    rewardsToken: TypedFunctionDescription<{ encode([]: []): string }>;

    setRewardsDistribution: TypedFunctionDescription<{
      encode([_rewardsDistributor]: [string]): string;
    }>;

    symbol: TypedFunctionDescription<{ encode([]: []): string }>;

    totalSavings: TypedFunctionDescription<{ encode([]: []): string }>;

    totalSupply: TypedFunctionDescription<{ encode([]: []): string }>;

    transfer: TypedFunctionDescription<{
      encode([recipient, amount]: [string, BigNumberish]): string;
    }>;

    transferFrom: TypedFunctionDescription<{
      encode([sender, recipient, amount]: [
        string,
        string,
        BigNumberish
      ]): string;
    }>;

    userRewardPerTokenPaid: TypedFunctionDescription<{
      encode([]: [string]): string;
    }>;
  };

  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, spender, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    AutomaticInterestCollectionSwitched: TypedEventDescription<{
      encodeTopics([automationEnabled]: [null]): string[];
    }>;

    CreditsRedeemed: TypedEventDescription<{
      encodeTopics([redeemer, creditsRedeemed, savingsCredited]: [
        string | null,
        null,
        null
      ]): string[];
    }>;

    ExchangeRateUpdated: TypedEventDescription<{
      encodeTopics([newExchangeRate, interestCollected]: [
        null,
        null
      ]): string[];
    }>;

    RewardAdded: TypedEventDescription<{
      encodeTopics([reward]: [null]): string[];
    }>;

    RewardPaid: TypedEventDescription<{
      encodeTopics([user, reward]: [string | null, null]): string[];
    }>;

    SavingsDeposited: TypedEventDescription<{
      encodeTopics([saver, savingsDeposited, creditsIssued]: [
        string | null,
        null,
        null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;
  };
}

export class SavingsContract extends Contract {
  connect(signerOrProvider: Signer | Provider | string): SavingsContract;
  attach(addressOrName: string): SavingsContract;
  deployed(): Promise<SavingsContract>;

  on(event: EventFilter | string, listener: Listener): SavingsContract;
  once(event: EventFilter | string, listener: Listener): SavingsContract;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): SavingsContract;
  removeAllListeners(eventName: EventFilter | string): SavingsContract;
  removeListener(eventName: any, listener: Listener): SavingsContract;

  interface: SavingsContractInterface;

  functions: {
    allowance(owner: string, spender: string): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    automateInterestCollectionFlag(
      _enabled: boolean,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    balanceOf(account: string): Promise<BigNumber>;

    balanceOfUnderlying(_user: string): Promise<BigNumber>;

    claimReward(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    creditBalances(_user: string): Promise<BigNumber>;

    decimals(): Promise<number>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    deposit(
      _underlying: BigNumberish,
      _beneficiary: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    depositInterest(
      _amount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    depositSavings(
      _underlying: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    earned(_account: string): Promise<BigNumber>;

    exchangeRate(): Promise<BigNumber>;

    getRewardToken(): Promise<string>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    lastTimeRewardApplicable(): Promise<BigNumber>;

    lastUpdateTime(): Promise<BigNumber>;

    name(): Promise<string>;

    nexus(): Promise<string>;

    notifyRewardAmount(
      _reward: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    periodFinish(): Promise<BigNumber>;

    redeem(
      _credits: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    redeemUnderlying(
      _underlying: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    rewardPerToken(): Promise<BigNumber>;

    rewardPerTokenStored(): Promise<BigNumber>;

    rewardRate(): Promise<BigNumber>;

    rewards(arg0: string): Promise<BigNumber>;

    rewardsDistributor(): Promise<string>;

    rewardsToken(): Promise<string>;

    setRewardsDistribution(
      _rewardsDistributor: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    symbol(): Promise<string>;

    totalSavings(): Promise<BigNumber>;

    totalSupply(): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    userRewardPerTokenPaid(arg0: string): Promise<BigNumber>;
  };

  allowance(owner: string, spender: string): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  automateInterestCollectionFlag(
    _enabled: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  balanceOf(account: string): Promise<BigNumber>;

  balanceOfUnderlying(_user: string): Promise<BigNumber>;

  claimReward(overrides?: TransactionOverrides): Promise<ContractTransaction>;

  creditBalances(_user: string): Promise<BigNumber>;

  decimals(): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  deposit(
    _underlying: BigNumberish,
    _beneficiary: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  depositInterest(
    _amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  depositSavings(
    _underlying: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  earned(_account: string): Promise<BigNumber>;

  exchangeRate(): Promise<BigNumber>;

  getRewardToken(): Promise<string>;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  lastTimeRewardApplicable(): Promise<BigNumber>;

  lastUpdateTime(): Promise<BigNumber>;

  name(): Promise<string>;

  nexus(): Promise<string>;

  notifyRewardAmount(
    _reward: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  periodFinish(): Promise<BigNumber>;

  redeem(
    _credits: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  redeemUnderlying(
    _underlying: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  rewardPerToken(): Promise<BigNumber>;

  rewardPerTokenStored(): Promise<BigNumber>;

  rewardRate(): Promise<BigNumber>;

  rewards(arg0: string): Promise<BigNumber>;

  rewardsDistributor(): Promise<string>;

  rewardsToken(): Promise<string>;

  setRewardsDistribution(
    _rewardsDistributor: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  symbol(): Promise<string>;

  totalSavings(): Promise<BigNumber>;

  totalSupply(): Promise<BigNumber>;

  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  userRewardPerTokenPaid(arg0: string): Promise<BigNumber>;

  filters: {
    Approval(
      owner: string | null,
      spender: string | null,
      value: null
    ): EventFilter;

    AutomaticInterestCollectionSwitched(automationEnabled: null): EventFilter;

    CreditsRedeemed(
      redeemer: string | null,
      creditsRedeemed: null,
      savingsCredited: null
    ): EventFilter;

    ExchangeRateUpdated(
      newExchangeRate: null,
      interestCollected: null
    ): EventFilter;

    RewardAdded(reward: null): EventFilter;

    RewardPaid(user: string | null, reward: null): EventFilter;

    SavingsDeposited(
      saver: string | null,
      savingsDeposited: null,
      creditsIssued: null
    ): EventFilter;

    Transfer(from: string | null, to: string | null, value: null): EventFilter;
  };

  estimate: {
    allowance(owner: string, spender: string): Promise<BigNumber>;

    approve(spender: string, amount: BigNumberish): Promise<BigNumber>;

    automateInterestCollectionFlag(_enabled: boolean): Promise<BigNumber>;

    balanceOf(account: string): Promise<BigNumber>;

    balanceOfUnderlying(_user: string): Promise<BigNumber>;

    claimReward(): Promise<BigNumber>;

    creditBalances(_user: string): Promise<BigNumber>;

    decimals(): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish
    ): Promise<BigNumber>;

    deposit(
      _underlying: BigNumberish,
      _beneficiary: string
    ): Promise<BigNumber>;

    depositInterest(_amount: BigNumberish): Promise<BigNumber>;

    depositSavings(_underlying: BigNumberish): Promise<BigNumber>;

    earned(_account: string): Promise<BigNumber>;

    exchangeRate(): Promise<BigNumber>;

    getRewardToken(): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish
    ): Promise<BigNumber>;

    lastTimeRewardApplicable(): Promise<BigNumber>;

    lastUpdateTime(): Promise<BigNumber>;

    name(): Promise<BigNumber>;

    nexus(): Promise<BigNumber>;

    notifyRewardAmount(_reward: BigNumberish): Promise<BigNumber>;

    periodFinish(): Promise<BigNumber>;

    redeem(_credits: BigNumberish): Promise<BigNumber>;

    redeemUnderlying(_underlying: BigNumberish): Promise<BigNumber>;

    rewardPerToken(): Promise<BigNumber>;

    rewardPerTokenStored(): Promise<BigNumber>;

    rewardRate(): Promise<BigNumber>;

    rewards(arg0: string): Promise<BigNumber>;

    rewardsDistributor(): Promise<BigNumber>;

    rewardsToken(): Promise<BigNumber>;

    setRewardsDistribution(_rewardsDistributor: string): Promise<BigNumber>;

    symbol(): Promise<BigNumber>;

    totalSavings(): Promise<BigNumber>;

    totalSupply(): Promise<BigNumber>;

    transfer(recipient: string, amount: BigNumberish): Promise<BigNumber>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish
    ): Promise<BigNumber>;

    userRewardPerTokenPaid(arg0: string): Promise<BigNumber>;
  };
}