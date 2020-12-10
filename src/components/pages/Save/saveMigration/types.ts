import { BigDecimal } from '../../../../web3/BigDecimal';

export interface StepProps {
  title: string;
  buttonTitle?: string;
  key: string;
  isCompleted: boolean;
  isPending: boolean;
  onClick(): void;
}

export type State = StepProps[];

export interface Dispatch {
  withdrawTx(amount: BigDecimal): void;
  approveTx(spender: string, approveAmount: BigDecimal): void;
  depositTx(amount: BigDecimal, walletAddress: string): void;
}
