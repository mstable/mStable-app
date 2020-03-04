import { TransactionReceipt, TransactionResponse } from 'ethers/providers';

export interface Transaction {
  response: TransactionResponse;
  receipt?: TransactionReceipt;
  blockNumberChecked?: number;
  fnName: string;
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
