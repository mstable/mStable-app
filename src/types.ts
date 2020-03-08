import { TransactionReceipt, TransactionResponse } from 'ethers/providers';
import { IForgeRewards } from './typechain/IForgeRewards.d';
import { IERC20 } from './typechain/IERC20.d';
import { IMasset } from './typechain/IMasset.d';
import { ISystok } from './typechain/ISystok.d';

export interface Transaction {
  response: TransactionResponse;
  receipt?: TransactionReceipt;
  blockNumberChecked?: number;
  fn: string;
  timestamp: number;
  args: unknown[];
}

export enum TransactionStatus {
  Success,
  Error,
  Pending,
}

export enum MassetNames {
  mUSD = 'mUSD',
  mGLD = 'mGLD',
}

export enum ContractNames {
  mUSD = 'mUSD',
  mGLD = 'mGLD',
  MTA = 'MTA',
  ERC20 = 'ERC20',
}

export enum Interfaces {
  ForgeRewards,
  Masset,
  Systok,
  ERC20,
}

export interface Instances {
  [Interfaces.ForgeRewards]: IForgeRewards;
  [Interfaces.Masset]: IMasset;
  [Interfaces.Systok]: ISystok;
  [Interfaces.ERC20]: IERC20;
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
  fn: Extract<keyof Instances[TIface]['functions'], TFn>;
  args: Parameters<
    Extract<
      Instances[TIface]['functions'][TFn],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => any
    >
  >;
}
