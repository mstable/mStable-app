import BigNumber from 'bignumber.js';
import { HistoricTransactionsQueryResult } from '../../graphql/protocol';
import { HistoricTransaction, HistoricTxsArr } from './types';

export const transformRawData = (
  data: HistoricTransactionsQueryResult['data'],
): HistoricTransaction[] => {
  if (!data) {
    return [];
  }

  const { transactions } = data;

  const historicTxsData = [...transactions].sort(
    (a, b) => parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10),
  ) as HistoricTxsArr;
  return historicTxsData.map(({ hash, block, sender, id, ...tx }) => {
    const timestamp = parseInt(tx.timestamp, 10);
    switch (tx.__typename) {
      case 'RedeemTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          bassets: tx.bassets.map(basset => {
            return basset.id;
          }),
          massetUnits: new BigNumber(tx.massetUnits),
          bassetsUnits: tx.bassetsUnits.map(bassetUnit => {
            return new BigNumber(bassetUnit);
          }),
        };
      case 'RedeemMassetTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigNumber(tx.massetUnits),
          recipient: tx.recipient,
        };
      case 'MintMultiTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigNumber(tx.massetUnits),
          bassets: tx.bassets.map(basset => {
            return basset.id;
          }),
          bassetsUnits: tx.bassetsUnits.map(bassetUnit => {
            return new BigNumber(bassetUnit);
          }),
        };
      case 'MintSingleTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigNumber(tx.massetUnits),
          basset: {
            id: tx.basset.id,
          },
          bassetsUnits: new BigNumber(tx.bassetUnits),
        };
      case 'PaidFeeTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigNumber(tx.massetUnits),
          basset: {
            id: tx.basset.id,
          },
          bassetsUnits: new BigNumber(tx.bassetUnits),
        };
      case 'SavingsContractDepositTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          amount: new BigNumber(tx.amount),
          savingsContract: {
            id: tx.savingsContract.id,
          },
        };
      case 'SavingsContractWithdrawTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          amount: new BigNumber(tx.amount),
          savingsContract: {
            id: tx.savingsContract.id,
          },
        };
      case 'SwapTransaction':
        return {
          type: tx.__typename,
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigNumber(tx.massetUnits),
          inputBasset: {
            id: tx.inputBasset.id,
          },
          outputBasset: {
            id: tx.inputBasset.id,
          },
        };
      default:
        throw new Error('Unhandled transaction type');
    }
  }) as HistoricTransaction[];
};
