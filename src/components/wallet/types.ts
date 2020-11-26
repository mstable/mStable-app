import { HistoricTransactionsQueryResult } from '../../graphql/protocol';

export type HistoricTxsData = NonNullable<
  HistoricTransactionsQueryResult['data']
>;

export interface HistoricTransaction {
  hash: string;
  description: string;
  timestamp: number;
  formattedDate: string;
  id: string;
}
