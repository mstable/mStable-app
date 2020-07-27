import { Contract } from 'ethers';
import { Filter } from 'ethers/providers';
import { HistoricTransaction, LogWithTransactionHash } from '../types';

/**
 * For a given contract, account and optional log filter, get historic
 * transactions with parsed logs.
 *
 * @param contract ethers.Contract instance
 * @param account Ethereum account address
 * @param topics Array of topic filters
 * @param filter Optional log filter (without `topics`)
 */
export const getHistoricTransactions = async (
  contract: Contract,
  account: string,
  topics: (string | null)[][],
  filter: Omit<Filter, 'topic'>,
): Promise<Record<string, HistoricTransaction>> => {
  // TODO later: This is probably not a scalable solution
  const allLogs = await Promise.all(
    topics.map(_topics =>
      contract.provider.getLogs({
        ...filter,
        topics: _topics as string[],
        address: contract.address,
      }),
    ),
  );

  const logs = allLogs.reduce(
    (flattened, _logs) => [...flattened, ..._logs],
    [],
  );

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
        receipts[index]?.from === account && receipts[index]?.status === 1,
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
          logs: logsMap[hash]
            .map(log => {
              let values: unknown[] = [];
              let name: string | undefined;
              // FIXME symptom-fighting: parse errors for swap (feeQuantity)
              try {
                ({ values, name } = contract.interface.parseLog(log));
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(log, error);
              }
              return { values, name }
            })
            .filter(({ name }) => !!name),
        },
      };
    }, {});
};
