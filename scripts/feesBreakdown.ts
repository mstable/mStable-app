import './utils/init';
import { getApolloClient } from './utils/getApolloClient';
import { fetchAllData } from './utils/fetchAllData';
import { FeesDocument, FeesQueryResult } from '../src/graphql/scripts';
import { BigDecimal } from '../src/web3/BigDecimal';

const shouldFetchMore = (data: FeesQueryResult['data']): boolean =>
  data?.feePaidTransactions.length === 500;

const getTotalFees = async () => {
  const client = getApolloClient();

  let result = new BigDecimal(0, 18);
  let n = 0;

  for await (const data of fetchAllData(
    client,
    FeesDocument,
    {},
    shouldFetchMore,
  )) {
    n = data.feePaidTransactions.reduce(
      (prev, current) => prev + parseFloat(current.mAssetUnits),
      n,
    );
    result = data.feePaidTransactions.reduce(
      (prev, current) => prev.add(BigDecimal.parse(current.mAssetUnits, 18)),
      result,
    );
  }

  return result;
};

export const main = async () => {
  const totalFees = await getTotalFees();

  console.log(`${totalFees.format()} mUSD in fees paid`);
};
