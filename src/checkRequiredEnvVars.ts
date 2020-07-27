const REQUIRED_ENV_VARS: (keyof typeof process.env)[] = [
  'REACT_APP_GRAPHQL_ENDPOINT_MSTABLE',
  'REACT_APP_GRAPHQL_ENDPOINT_BALANCER',
  'REACT_APP_GRAPHQL_ENDPOINT_UNISWAP',
  'REACT_APP_GRAPHQL_ENDPOINT_BLOCKS',
  'REACT_APP_CHAIN_ID',
  'REACT_APP_RPC_URL',
  'REACT_APP_SENTRY_DSN',
];

export const checkRequiredEnvVars = (): void => {
  REQUIRED_ENV_VARS.forEach(name => {
    if (typeof process.env[name] === 'undefined') {
      throw new Error(`Required env var "${name}"`);
    }
  });
};
