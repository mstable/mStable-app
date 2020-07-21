import { FC } from 'react';
import { BigNumber } from 'ethers';
import { Connectors } from 'use-wallet';
import type { TransactionResponse, Log } from '@ethersproject/providers';
import type { LogDescription } from 'ethers/lib/utils';
import type { Masset } from './typechain/Masset.d';
import type { SavingsContract } from './typechain/SavingsContract.d';
import type { Erc20Detailed } from './typechain/Erc20Detailed.d';

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
  // eslint-disable-next-line no-shadow
  Masset,
  // Systok,
  ERC20,
  // eslint-disable-next-line no-shadow
  SavingsContract,
}

export interface Instances {
  // [Interfaces.ForgeRewards]: IForgeRewards;
  [Interfaces.Masset]: Masset;
  // [Interfaces.Systok]: ISystok;
  [Interfaces.ERC20]: Erc20Detailed;
  [Interfaces.SavingsContract]: SavingsContract;
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
  iface: Instances[TIface]
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
