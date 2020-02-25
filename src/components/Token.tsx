import React, { FunctionComponent } from 'react';
import {
  useTokenSubSubscription,
  TokenSubSubscriptionVariables,
} from '../graphql/generated';

export const Token: FunctionComponent<TokenSubSubscriptionVariables> = variables => {
  const { data, loading, error } = useTokenSubSubscription({ variables });
  return (
    <div>
      <p>Token {variables.id}</p>
      <p>{loading ? 'loading...' : null}</p>
      <p>{error ? 'error!' : null}</p>
      {data?.token ? <p>Symbol: {data.token.symbol}</p> : <p>not found</p>}
    </div>
  );
};
