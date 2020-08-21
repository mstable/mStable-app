import { ApolloClient, DocumentNode } from '@apollo/client';

const fetchDataWithLimit = async <
  TQuery extends DocumentNode,
  TData,
  TVariables
>(
  client: ApolloClient<any>,
  query: TQuery,
  variables: TVariables & { limit: number; offset: number },
): Promise<TData | undefined> => {
  console.log(`Fetching data:\n${JSON.stringify(variables, null, 2)}`);

  const { data } = (await client.query({
    query,
    variables,
  })) as { data: TData };

  return data;
};

export const fetchAllData = async function*<
  TQuery extends DocumentNode,
  TData,
  TVariables
>(
  client: ApolloClient<any>,
  query: TQuery,
  variables: TVariables,
  shouldFetchMore: (data: TData | undefined, limit: number) => boolean,
): AsyncIterable<TData> {
  const limit = 500;
  let offset = 0;

  let data = await fetchDataWithLimit<TQuery, TData, TVariables>(
    client,
    query,
    {
      ...variables,
      limit,
      offset,
    },
  );

  if (data) {
    yield data;
  }

  while (shouldFetchMore(data, limit)) {
    offset += limit;
    data = await fetchDataWithLimit<TQuery, TData, TVariables>(client, query, {
      ...variables,
      limit,
      offset,
    });

    if (data) {
      yield data;
    } else {
      return;
    }
  }
};
