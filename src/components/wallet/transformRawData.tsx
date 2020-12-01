import { HistoricTransactionsQueryResult } from '../../graphql/protocol';
import { HistoricTransaction } from './types';
import { DataState } from '../../context/DataProvider/types';
import { BigDecimal } from '../../web3/BigDecimal';
import { formatUnix } from './utils';
import { humanizeList } from '../../web3/strings';

export const transformRawData = (
  data: HistoricTransactionsQueryResult['data'],
  dataState?: DataState,
): HistoricTransaction[] => {
  if (!data || !dataState) {
    return [];
  }

  const { transactions } = data;
  const { mAsset, bAssets, removedBassets } = dataState as DataState;
  return transactions
    .map(({ hash, id, ...tx }) => {
      const timestamp = parseInt(tx.timestamp, 10);
      const formattedDate = formatUnix(timestamp);
      switch (tx.__typename) {
        case 'RedeemTransaction': {
          const bassetSymbols = tx.bassets.map(
            basset => (bAssets[basset.id] ?? removedBassets[basset.id])?.symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You redeemed ${massetUnits.format()} ${
              mAsset.symbol
            } into ${humanizeList(bassetSymbols)}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'RedeemMassetTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You redeemed ${massetUnits.format()} ${
              mAsset.symbol
            } proportionally into all assets`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'MintMultiTransaction': {
          const bassetSymbols = tx.bassets.map(
            basset => (bAssets[basset.id] ?? removedBassets[basset.id])?.symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You minted ${massetUnits.simple.toFixed(2)} ${
              mAsset.symbol
            } with ${humanizeList(bassetSymbols)}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'MintSingleTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          const bassetSymbol = (
            bAssets[tx.basset.id] ?? removedBassets[tx.basset.id]
          )?.symbol;
          return {
            description: `You minted ${massetUnits.format()} ${
              mAsset.symbol
            } with ${bassetSymbol}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'PaidFeeTransaction': {
          const basset = bAssets[tx.basset.id] ?? removedBassets[tx.basset.id];
          const bassetUnit = new BigDecimal(tx.bassetUnits, basset.decimals);
          return {
            description: `You paid ${bassetUnit.format()} ${
              basset.symbol
            } in fees`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'SavingsContractDepositTransaction': {
          const massetUnits = new BigDecimal(tx.amount, mAsset.decimals);
          return {
            description: `You deposited ${massetUnits.format()} ${
              mAsset.symbol
            } into SAVE`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'SavingsContractWithdrawTransaction': {
          const massetUnits = new BigDecimal(tx.amount, mAsset.decimals);
          return {
            description: `You withdrew ${massetUnits.format()} ${
              mAsset.symbol
            } from SAVE`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'SwapTransaction': {
          const inputBasset = (
            bAssets[tx.inputBasset.id] ?? removedBassets[tx.inputBasset.id]
          )?.symbol;
          const outputBasset = (
            bAssets[tx.outputBasset.id] ?? removedBassets[tx.outputBasset.id]
          )?.symbol;
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You swapped ${massetUnits.format()} ${inputBasset} for ${outputBasset}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        default:
          throw new Error('Unhandled transaction type');
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp) as HistoricTransaction[];
};
