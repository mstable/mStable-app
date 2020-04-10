import { Contract } from 'ethers';
import { Filter } from 'ethers/providers';
import { HistoricTransaction, LogWithTransactionHash } from '../types';

/**
 * For a given contract, account and optional log filter, get historic
 * transactions with parsed logs.
 *
 * @param contract ethers.Contract instance
 * @param account Ethereum account address
 * @param filter Optional log filter
 */
export const getHistoricTransactions = async (
  contract: Contract,
  account: string,
  filter?: Filter,
): Promise<Record<string, HistoricTransaction>> => {
  // TODO later: This is probably not a scalable solution
  const logs = await contract.provider.getLogs({
    ...filter,
    address: contract.address,
  });

  // Create a map of unique hashes to logs for lookups later
  const logsMap = (logs.filter(
    log => !!log.transactionHash,
  ) as LogWithTransactionHash[]).reduce<
    Record<string, LogWithTransactionHash[]>
  >(
    (_map, log) => ({
      ..._map,
      [log.transactionHash]: [...(_map[log.transactionHash] || []), log],
    }),
    {},
  );

  const hashes = Object.keys(logsMap);

  // Get all transaction receipts for the unique hashes, so that further
  // lookups can be reduced
  const receipts = await Promise.all(
    hashes.map(hash => contract.provider.getTransactionReceipt(hash)),
  );

  return hashes
    .filter(
      // Filter for successful transactions from the given account
      (_, index) =>
        receipts[index].from === account && receipts[index].status === 1,
    )
    .reduce((_map, hash, index) => {
      // Reduce into a map of hashes to transactions with logs (just the data needed)
      const { blockNumber, status } = receipts[index];
      return {
        ..._map,
        [hash]: {
          hash,
          contractAddress: contract.address,
          blockNumber,
          status,
          logs: logsMap[hash].map(log => {
            const { values, name } = contract.interface.parseLog(log);
            return { values, name };
          }),
        },
      };
    }, {});
};
