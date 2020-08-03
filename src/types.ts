import { FC } from 'react';
import { TransactionResponse, Log } from 'ethers/providers';
import { BigNumber, LogDescription } from 'ethers/utils';
import { Connectors } from 'use-wallet';
import { Ierc20 } from './typechain/Ierc20.d';
import { ISavingsContract } from './typechain/ISavingsContract.d';
import { IMasset } from './typechain/IMasset.d';
import { StakingRewards as IStakingRewards } from './typechain/StakingRewards.d';
import { StakingRewardsWithPlatformToken as IStakingRewardsWithPlatformToken } from './typechain/StakingRewardsWithPlatformToken.d';
import { BigDecimal } from './web3/BigDecimal';
import { IRewardsVault } from './typechain/IRewardsVault.d';
import { RewardsDistributor as IRewardsDistributor } from './typechain/RewardsDistributor.d';

export interface Transaction {
  formId?: string;
  hash: string;
  response: TransactionResponse;
  blockNumberChecked?: number;
  fn: string;
  status: number | null;
  timestamp: number;
  args: unknown[];
  purpose: Purpose;
}

export interface Purpose {
  present: string | null;
  past: string | null;
}

export type LogWithTransactionHash = Omit<Log, 'transactionHash'> &
  Required<Pick<Log, 'transactionHash'>>;

export interface HistoricTransaction {
  hash: string;
  contractAddress: string;
  blockNumber: number;
  status: number;
  logs: LogDescription[];
}

export enum TransactionStatus {
  Success,
  Error,
  Pending,
}

export enum MassetNames {
  mUSD = 'mUSD',
  // mGLD = 'mGLD',
}

export enum ContractNames {
  mUSD = 'mUSD',
  mUSDForgeValidator = 'mUSDForgeValidator',
  // mGLD = 'mGLD',
  // MTA = 'MTA',
  mUSDSavings = 'mUSDSavings',
}

export enum Interfaces {
  // ForgeRewards,
  Masset,
  // Systok,
  ERC20,
  SavingsContract,
  StakingRewards,
  StakingRewardsWithPlatformToken,
  RewardsVault,
  RewardsDistibutor,
}

export interface Instances {
  // [Interfaces.ForgeRewards]: IForgeRewards;
  [Interfaces.Masset]: IMasset;
  // [Interfaces.Systok]: ISystok;
  [Interfaces.ERC20]: Ierc20;
  [Interfaces.SavingsContract]: ISavingsContract;
  [Interfaces.StakingRewards]: IStakingRewards;
  [Interfaces.StakingRewardsWithPlatformToken]: IStakingRewardsWithPlatformToken;
  [Interfaces.RewardsVault]: IRewardsVault;
  [Interfaces.RewardsDistibutor]: IRewardsDistributor;
}

/**
 * Manifest for sending a transaction.
 *
 * @param iface: The contract interface, e.g. an instance of `Ierc20`
 * @param fn: Name of the function on the contract interface.
 * @param args: Array of arguments for the function.
 */
export interface SendTxManifest<
  TIface extends Interfaces,
  TFn extends keyof Instances[TIface]['functions']
> {
  iface: Instances[TIface];
  fn: Extract<keyof Instances[TIface]['functions'], TFn> & string;
  args: Parameters<
    Extract<
      Instances[TIface]['functions'][TFn],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => any
    >
  >;
  formId?: string;
}

export interface Token {
  address: string;
  decimals: number;
  symbol: string;
  price?: BigDecimal;
}

export interface Allowances {
  [spender: string]: BigDecimal;
}

export interface SubscribedToken extends Token {
  balance: BigDecimal;
  allowances: Allowances;
}

export interface Amount {
  simple: number | null;
  exact: BigNumber | null;
}

export interface TokenQuantity {
  formValue: string | null;
  amount: Amount;
  token: {
    address: string | null;
    decimals: number | null;
    symbol: string | null;
  };
}

export interface InjectedEthereum {
  enable(): Promise<string[]>;
  on(event: 'chainChanged', listener: (chainId: number) => void): void;
  autoRefreshOnNetworkChange: boolean;
  removeListener(event: 'chainChanged', listener: Function): void;
  isMetaMask?: boolean;
  isBrave?: boolean;
  isTrust?: boolean;
  isDapper?: boolean;
}

export interface Connector {
  id: keyof Required<Connectors>;
  subType?: string;
  label: string;
  icon?: FC;
}

export enum Platforms {
  Balancer = 'Balancer',
  Uniswap = 'Uniswap',
}

export interface BlockTimestamp {
  blockNumber: number;
  timestamp: number;
}

export interface AccentColors {
  light: string;
  accent: string;
  base: string;
  text: string;
}
