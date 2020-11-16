import { HistoricTransactionsQueryResult } from '../../graphql/protocol';
import { HistoricTransaction, HistoricTxsArr } from './types';
import { BigDecimal } from '../../web3/BigDecimal';

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
          massetUnits: new BigDecimal(tx.massetUnits, 18),
          bassetsUnits: tx.bassetsUnits.map(bassetUnit => {
            return parseInt(bassetUnit, 10);
          }),
        };
      case 'RedeemMassetTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigDecimal(tx.massetUnits, 18),
          recipient: tx.recipient,
        };
      case 'MintMultiTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigDecimal(tx.massetUnits, 18),
          bassets: tx.bassets.map(basset => {
            return basset.id;
          }),
          bassetsUnits: tx.bassetsUnits.map(bassetUnit => {
            return parseFloat(bassetUnit);
          }),
        };
      case 'MintSingleTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigDecimal(tx.massetUnits, 18),
          basset: {
            id: tx.basset.id,
          },
          bassetsUnits: parseFloat(tx.bassetUnits),
        };
      case 'PaidFeeTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigDecimal(tx.massetUnits, 18),
          basset: {
            id: tx.basset.id,
          },
          bassetsUnits: parseFloat(tx.bassetUnits),
        };
      case 'SavingsContractDepositTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          amount: parseFloat(tx.amount),
          savingsContract: {
            id: tx.savingsContract.id,
          },
        };
      case 'SavingsContractWithdrawTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          amount: new BigDecimal(tx.amount, 18),
          savingsContract: {
            id: tx.savingsContract.id,
          },
        };
      case 'SwapTransaction':
        return {
          hash,
          block,
          sender,
          timestamp,
          id,
          masset: {
            id: tx.masset.id,
          },
          massetUnits: new BigDecimal(tx.massetUnits, 18),
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
