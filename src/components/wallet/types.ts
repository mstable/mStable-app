import BigNumber from 'bignumber.js';
import { HistoricTransactionsQueryResult } from '../../graphql/protocol';

export type HistoricTxsData = NonNullable<
  HistoricTransactionsQueryResult['data']
>;

export type HistoricTxsArr = Array<HistoricTxsData['transactions'][number]>;

export interface BaseHistoricTransaction {
  hash: string;
  timestamp: number;
  block: number;
  id: string;
  sender: string;
  type: string;
}

export interface RedeemTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigNumber;
  bassets: [
    {
      id: string;
    },
  ];
  bassetUnits: BigNumber[];
  recipient: string;
}

export interface RedeemMassetTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigNumber;
  recipient: string;
}

export interface MintMultiTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigNumber;
  bassets: [
    {
      id: string;
    },
  ];
  bassetUnits: BigNumber[];
}

export interface MintSingleTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigNumber;
  basset: {
    id: string;
  };
  bassetUnits: BigNumber;
}

export interface PaidFeeTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigNumber;
  basset: {
    id: string;
  };
  bassetUnits: BigNumber;
}

export interface SavingsContractDepositTransaction
  extends BaseHistoricTransaction {
  amount: BigNumber;
  savingsContract: {
    id: string;
  };
}
export interface SavingsContractWithdrawTransaction
  extends BaseHistoricTransaction {
  amount: BigNumber;
  savingsContract: {
    id: string;
  };
}

export interface SwapTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  inputBasset: {
    id: string;
  };
  outputBasset: {
    id: string;
  };
  massetUnits: BigNumber;
  recipient: string;
}

export type HistoricTransaction =
  | RedeemTransaction
  | RedeemMassetTransaction
  | MintMultiTransaction
  | MintSingleTransaction
  | PaidFeeTransaction
  | SavingsContractDepositTransaction
  | SavingsContractWithdrawTransaction
  | SwapTransaction;
