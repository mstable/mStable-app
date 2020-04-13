import { TransactionStatus } from '../types';

export const getTransactionStatus = <T extends { status?: number | null }>(
  tx: T,
): TransactionStatus =>
  tx.status === 1
    ? TransactionStatus.Success
    : tx.status === 0
    ? TransactionStatus.Error
    : TransactionStatus.Pending;
