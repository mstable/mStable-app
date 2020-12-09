import { BigDecimal } from '../../../../web3/BigDecimal';

export interface State {
  state?: {
    withdraw: {
      isCompleted: boolean | undefined;
      isPending: boolean;
    };
    approve: {
      isCompleted: boolean | undefined;
      isPending: boolean;
    };
    deposit: {
      isCompleted: boolean | undefined;
      isPending: boolean;
    };
  };
  withdrawTx?(amount: BigDecimal): void;
  approveTx?(spender: string, approveAmount: BigDecimal): void;
  depositTx?(amount: BigDecimal, walletAddress: string): void;
}
