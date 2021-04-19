import type { BigDecimal } from '../../../../web3/BigDecimal';

export enum SaveRoutes {
  Save,
  Stake,
  SaveAndStake,
  MintAndSave,
  MintAndStake,
  BuyAndSave,
  BuyAndStake,
  SwapAndSave,
  SwapAndStake,
}

export enum SaveRoutesOut {
  Withdraw,
  VaultWithdraw,
}

export interface SaveOutput {
  amount: BigDecimal;
  amountOut?: BigDecimal;
  path?: [string, string];
}
