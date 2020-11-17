import { HistoricTransactionsQueryResult } from '../../graphql/protocol';
import { HistoricTransaction } from './types';
import { DataState } from '../../context/DataProvider/types';
import { BigDecimal } from '../../web3/BigDecimal';
import { formatUnix } from './utils';

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
    .map(({ hash, ...tx }) => {
      const timestamp = parseInt(tx.timestamp, 10);
      const formattedDate = formatUnix(timestamp);
      switch (tx.__typename) {
        case 'RedeemTransaction': {
          const mappedBassets = tx.bassets.map(
            basset => bAssets[basset.id].symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You've redeemed ${massetUnits.simple.toFixed(2)} of ${
              mAsset.symbol
            } with ${mappedBassets}`,
            hash,
            timestamp,
          };
        }
        case 'RedeemMassetTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You've redeemed ${massetUnits.simple.toFixed(2)} of ${
              mAsset.symbol
            }`,
            hash,
            timestamp,
            formattedDate,
          };
        }
        case 'MintMultiTransaction': {
          const mappedBassets = tx.bassets.map(
            basset => bAssets[basset.id].symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You've minted ${massetUnits.simple.toFixed(2)} of ${
              mAsset.symbol
            } with ${mappedBassets}`,
            hash,
            timestamp,
            formattedDate,
          };
        }
        case 'MintSingleTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          const mappedBasset = bAssets[tx.basset.id].symbol;
          return {
            description: `You've minted ${massetUnits.simple.toFixed(2)} of ${
              mAsset.symbol
            } with ${mappedBasset}`,
            hash,
            timestamp,
            formattedDate,
          };
        }
        case 'PaidFeeTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          const mappedBasset = bAssets[tx.basset.id].symbol;
          return {
            description: `You've paid a fee of ${massetUnits.simple.toFixed(
              2,
            )} in ${mAsset.symbol} with ${mappedBasset}`,
            hash,
            timestamp,
            formattedDate,
          };
        }
        case 'SavingsContractDepositTransaction': {
          const massetUnits = new BigDecimal(tx.amount, mAsset.decimals);
          return {
            description: `You've deposited ${massetUnits.simple.toFixed(
              2,
            )} of ${mAsset.symbol}`,
            hash,
            timestamp,
            formattedDate,
          };
        }
        case 'SavingsContractWithdrawTransaction': {
          const massetUnits = new BigDecimal(tx.amount, mAsset.decimals);
          return {
            description: `You've withdrawn ${massetUnits.simple.toFixed(
              2,
            )} of ${mAsset.symbol}`,
            hash,
            timestamp,
            formattedDate,
          };
        }
        case 'SwapTransaction': {
          const massetUnits = new BigDecimal(tx.massetUnits, mAsset.decimals);
          return {
            description: `You've swapped ${tx.inputBasset} for ${tx.outputBasset} with the value of ${massetUnits} ${mAsset.symbol} `,
            hash,
            timestamp,
            formattedDate,
          };
        }
        default:
          throw new Error('Unhandled transaction type');
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp) as HistoricTransaction[];
};
