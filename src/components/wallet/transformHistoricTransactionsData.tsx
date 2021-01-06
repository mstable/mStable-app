import { HistoricTransactionsQueryResult } from '../../graphql/protocol';
import { HistoricTransaction } from './types';
import { MassetState, DataState } from '../../context/DataProvider/types';
import { BigDecimal } from '../../web3/BigDecimal';
import { formatUnix } from '../../utils/time';
import { humanizeList } from '../../utils/strings';

export const transformHistoricTransactionsData = (
  data: HistoricTransactionsQueryResult['data'],
  dataState?: DataState,
): HistoricTransaction[] => {
  if (!data || !dataState) {
    return [];
  }

  const { transactions } = data;

  const massetsByAddress: {
    [address: string]: MassetState;
  } = Object.fromEntries(
    Object.values(dataState).map(massetState => [
      massetState.address,
      massetState,
    ]),
  );

  return transactions
    .map(({ hash, id, ...tx }) => {
      const timestamp = parseInt(tx.timestamp, 10);
      const formattedDate = formatUnix(timestamp);
      switch (tx.__typename) {
        case 'RedeemTransaction': {
          const { bAssets, removedBassets, token } = massetsByAddress[
            tx.masset.id
          ];
          const bassetSymbols = tx.bassets.map(
            basset =>
              (bAssets[basset.id] ?? removedBassets[basset.id])?.token.symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, token.decimals);
          return {
            description: `You redeemed ${massetUnits.format()} ${
              token.symbol
            } into ${humanizeList(bassetSymbols)}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'RedeemMassetTransaction': {
          const { token } = massetsByAddress[tx.masset.id];
          const massetUnits = new BigDecimal(tx.massetUnits, token.decimals);
          return {
            description: `You redeemed ${massetUnits.format()} ${
              token.symbol
            } proportionally into all assets`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'MintMultiTransaction': {
          const { bAssets, removedBassets, token } = massetsByAddress[
            tx.masset.id
          ];
          const bassetSymbols = tx.bassets.map(
            basset =>
              (bAssets[basset.id] ?? removedBassets[basset.id])?.token.symbol,
          );
          const massetUnits = new BigDecimal(tx.massetUnits, token.decimals);
          return {
            description: `You minted ${massetUnits.simple.toFixed(2)} ${
              token.symbol
            } with ${humanizeList(bassetSymbols)}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'MintSingleTransaction': {
          const { bAssets, removedBassets, token } = massetsByAddress[
            tx.masset.id
          ];
          const massetUnits = new BigDecimal(tx.massetUnits, token.decimals);
          const bassetSymbol = (
            bAssets[tx.basset.id] ?? removedBassets[tx.basset.id]
          )?.token.symbol;
          return {
            description: `You minted ${massetUnits.format()} ${
              token.symbol
            } with ${bassetSymbol}`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'PaidFeeTransaction': {
          const { bAssets, removedBassets } = massetsByAddress[tx.masset.id];
          const basset = bAssets[tx.basset.id] ?? removedBassets[tx.basset.id];
          const bassetUnit = new BigDecimal(
            tx.bassetUnits,
            basset?.token.decimals,
          );
          return {
            description: `You paid ${bassetUnit.format()}${
              basset ? ` ${basset.token.symbol}` : ''
            } in fees`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'SavingsContractDepositTransaction': {
          const { token } = massetsByAddress[tx.savingsContract.masset.id];
          const massetUnits = new BigDecimal(tx.amount, token.decimals);
          return {
            description: `You deposited ${massetUnits.format()} ${
              token.symbol
            } into SAVE`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'SavingsContractWithdrawTransaction': {
          const { token } = massetsByAddress[tx.savingsContract.masset.id];
          const massetUnits = new BigDecimal(tx.amount, token.decimals);
          return {
            description: `You withdrew ${massetUnits.format()} ${
              token.symbol
            } from SAVE`,
            hash,
            timestamp,
            formattedDate,
            id,
          };
        }
        case 'SwapTransaction': {
          const { bAssets, removedBassets, token } = massetsByAddress[
            tx.masset.id
          ];
          const inputBasset = (
            bAssets[tx.inputBasset.id] ?? removedBassets[tx.inputBasset.id]
          )?.token.symbol;
          const outputBasset = (
            bAssets[tx.outputBasset.id] ?? removedBassets[tx.outputBasset.id]
          )?.token.symbol;
          const massetUnits = new BigDecimal(tx.massetUnits, token.decimals);
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
