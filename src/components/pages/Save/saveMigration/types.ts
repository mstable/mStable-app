import { BigDecimal } from '../../../../web3/BigDecimal';

export interface State {
  state?: {
    withdraw: {
      isCompleted: boolean | undefined;
      isWithdrawPending: boolean;
    };
    approve: {
      isCompleted: boolean | undefined;
      isApprovePending: boolean;
    };
    deposit: {
      isCompleted: boolean | undefined;
      isDepostPending: boolean;
    };
  };
}

export interface Dispatch {
  withdrawTx(amount: BigDecimal): void;
  approveTx(spender: string, approveAmount: BigDecimal): void;
  depositTx(amount: BigDecimal, walletAddress: string): void;
}
