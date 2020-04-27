import { FC } from 'react';
import { TransactionResponse, Log } from 'ethers/providers';
import { BigNumber, LogDescription } from 'ethers/utils';
import { Connectors } from 'use-wallet';

import { IERC20 } from './typechain/IERC20.d';
import { IMasset } from './typechain/IMasset.d';
import { ISavingsContract } from './typechain/ISavingsContract.d';

export interface Transaction {
  hash: string;
  response: TransactionResponse;
  blockNumberChecked?: number;
  fn: string;
  status: number | null;
  timestamp: number;
  args: unknown[];
  purpose: string | null;
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
}

export interface Instances {
  // [Interfaces.ForgeRewards]: IForgeRewards;
  [Interfaces.Masset]: IMasset;
  // [Interfaces.Systok]: ISystok;
  [Interfaces.ERC20]: IERC20;
  [Interfaces.SavingsContract]: ISavingsContract;
}

/**
 * Manifest for sending a transaction.
 *
 * @param iface: The contract interface, e.g. an instance of `IERC20`
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
}

export interface TokenDetails {
  address: string | null;
  decimals: number | null;
  symbol: string | null;
}

export interface Amount {
  simple: number | null;
  exact: BigNumber | null;
}

export interface TokenQuantity {
  formValue: string | null;
  amount: Amount;
  token: TokenDetails;
}

export interface InjectedEthereum {
  enable(): Promise<string[]>;
  on(event: 'networkChanged', listener: (chainId: number) => void): void;
  autoRefreshOnNetworkChange: boolean;
  removeListener(event: 'networkChanged', listener: Function): void;
}

export interface Connector {
  id: keyof Connectors;
  label: string;
  icon?: FC;
}
