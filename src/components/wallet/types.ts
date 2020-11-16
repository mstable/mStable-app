import { BigDecimal } from '../../web3/BigDecimal';
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
}

export interface RedeemTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigDecimal;
  bassets: [
    {
      id: string;
    },
  ];
  bassetUnits: BigDecimal[];
  recipient: string;
}

export interface RedeemMassetTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigDecimal;
  recipient: string;
}

export interface MintMultiTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigDecimal;
  bassets: [
    {
      id: string;
    },
  ];
  bassetUnits: BigDecimal[];
}

export interface MintSingleTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigDecimal;
  basset: {
    id: string;
  };
  bassetUnits: BigDecimal;
}

export interface PaidFeeTransaction extends BaseHistoricTransaction {
  masset: {
    id: string;
  };
  massetUnits: BigDecimal;
  basset: {
    id: string;
  };
  bassetUnits: BigDecimal;
}

export interface SavingsContractDepositTransaction
  extends BaseHistoricTransaction {
  amount: BigDecimal;
  savingsContract: {
    id: string;
  };
}
export interface SavingsContractWithdrawTransaction
  extends BaseHistoricTransaction {
  amount: BigDecimal;
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
  massetUnits: BigDecimal;
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
