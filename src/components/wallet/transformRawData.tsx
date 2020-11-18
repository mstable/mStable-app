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
  const { mAsset, bAssets } = dataState as DataState;
  return transactions
    .map(({ hash, id, ...tx }) => {
      const timestamp = parseInt(tx.timestamp, 10);
      const formattedDate = formatUnix(timestamp);
      switch (tx.__typename) {
        case 'RedeemTransaction': {
          const mappedBassets = tx.bassets.map(
            basset => bAssets[basset.id].symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You redeemed ${massetUnits.format()} ${
              mAsset.symbol
            } into ${humanizeList(mappedBassets)}`,
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
          const mappedBassets = tx.bassets.map(
            basset => bAssets[basset.id].symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You minted ${massetUnits.simple.toFixed(2)} ${
              mAsset.symbol
            } with ${humanizeList(mappedBassets)}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'MintSingleTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          const mappedBasset = bAssets[tx.basset.id].symbol;
          return {
            description: `You minted ${massetUnits.format()} ${
              mAsset.symbol
            } with ${mappedBasset}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'PaidFeeTransaction': {
          const mappedBasset = bAssets[tx.basset.id];
          const bassetUnit = new BigDecimal(
            tx.bassetUnits,
            mappedBasset.decimals,
          );
          return {
            description: `You paid ${bassetUnit.format()} ${
              mappedBasset.symbol
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
          const mappedInputBasset = bAssets[tx.inputBasset.id].symbol;
          const mappedOutputBasset = bAssets[tx.outputBasset.id].symbol;
          return {
            description: `You swapped ${mappedInputBasset} for ${mappedOutputBasset}`,
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
    .sort((a, b) => a.timestamp - b.timestamp) as HistoricTransaction[];
};
