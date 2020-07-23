/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string
    REACT_APP_FORGE_REWARDS_ADDRESS: string
    REACT_APP_GRAPHQL_ENDPOINT: string
    REACT_APP_GRAPHQL_ENDPOINT_WS: string
    REACT_APP_CHAIN_ID: string
    REACT_APP_PORTIS_DAPP_ID: string
    REACT_APP_FORTMATIC_API_KEY_ROPSTEN: string
    REACT_APP_FORTMATIC_API_KEY_MAINNET: string
    REACT_APP_SQUARELINK_CLIENT_ID: string
  }
}
