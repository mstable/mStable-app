import type { FC } from 'react'
import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { createStateContext, useEffectOnce, useInterval } from 'react-use'
import { providers } from 'ethers'
import type { Provider } from '@ethersproject/providers'

import { composedComponent } from '../utils/reactUtils'
import { FetchState, useFetchState } from '../hooks/useFetchState'

interface NetworkPrices {
  nativeToken?: number
  gas?: {
    slow: number
    standard: number
    fast: number
    instant: number
  }
}

interface CoreAddresses {
  MTA: string
  vMTA: string
  FeederWrapper: string
  SaveWrapper: string
  UniswapRouter02_Like: string
}

interface MstableGqlEndpoints extends Record<string, string> {
  protocol: string
  feeders: string
}

interface CoreGqlEndpoints extends MstableGqlEndpoints {
  blocks: string
}

export enum ChainIds {
  EthereumMainnet = 1,
  EthereumRopsten = 3,
  EthereumGoerli = 5,
  MaticMainnet = 137,
  MaticMumbai = 80001,
}

interface Network<TAddresses, TGqlEndpoints> {
  protocolName: string

  chainName: string

  isMetaMaskDefault: boolean

  isTestnet: boolean

  blockTime: number

  nativeToken: {
    decimals: number
    symbol: string
    parentChainAddress?: string
  }

  chainId: ChainIds

  parentChainId?: ChainIds

  coingeckoId: string

  rpcEndpoint: string

  gqlEndpoints: CoreGqlEndpoints & TGqlEndpoints

  addresses: CoreAddresses & { ERC20: { wMATIC?: string; WETH?: string } } & TAddresses

  gasStationEndpoint: string

  getExplorerUrl(entity?: string, type?: 'address' | 'transaction' | 'token' | 'account'): string
}

export interface EthereumMainnet
  extends Network<
    {
      Curve: { CurveV2: string }
      ERC20: {
        SUSHI: string
        BADGER: string
        CREAM: string
        renBTC: string
        WETH: string
        WBTC: string
      }
    },
    {
      ecosystem: string
      curve: string
      sushi: string
      balancer: string
      uniswap: string
    }
  > {
  chainId: ChainIds.EthereumMainnet
}

export interface EthereumRopsten extends Network<{ ERC20: { WETH: string } }, {}> {
  chainId: ChainIds.EthereumRopsten
}

export interface EthereumGoerli extends Network<{ ERC20: { WETH: string } }, {}> {
  chainId: ChainIds.EthereumGoerli
}

export interface MaticMainnet extends Network<{ ERC20: { wMATIC: string } }, {}> {
  chainId: ChainIds.MaticMainnet
  parentChainId: ChainIds.EthereumMainnet
  nativeToken: {
    symbol: string
    decimals: number
    parentChainAddress: string
  }
}

export interface MaticMumbai extends Network<{ ERC20: { wMATIC: string } }, {}> {
  chainId: ChainIds.MaticMumbai
  parentChainId: ChainIds.EthereumGoerli
  nativeToken: {
    symbol: string
    decimals: number
    parentChainAddress: string
  }
}

export type AllNetworks = EthereumMainnet | EthereumRopsten | EthereumGoerli | MaticMainnet | MaticMumbai

const etherscanUrl = (network?: string) => (data?: string, type?: 'account' | 'transaction' | 'address' | 'token'): string => {
  const prefix = `https://${network ? `${network}.` : ''}etherscan.io`

  if (!data) return prefix

  switch (type) {
    case 'transaction':
      return `${prefix}/tx/${data}`
    case 'token':
      return `${prefix}/token/${data}`
    case 'address':
    default:
      return `${prefix}/address/${data}`
  }
}

const maticExplorerUrl = (network?: 'mainnet' | 'mumbai') => (
  data?: string,
  type?: 'account' | 'transaction' | 'address' | 'token',
): string => {
  const prefix = `https://explorer-${network}.maticvigil.com`

  if (!data) return prefix

  switch (type) {
    case 'transaction':
      return `${prefix}/tx/${data}`
    case 'token':
      return `${prefix}/tokens/${data}`
    case 'address':
    default:
      return `${prefix}/address/${data}`
  }
}

const ETH_MAINNET: EthereumMainnet = {
  chainId: ChainIds.EthereumMainnet,
  protocolName: 'Ethereum',
  chainName: 'Mainnet',
  nativeToken: {
    symbol: 'ETH',
    decimals: 18,
  },
  isMetaMaskDefault: true,
  isTestnet: false,
  blockTime: 15e3,
  coingeckoId: 'ethereum',
  rpcEndpoint: 'https://mainnet.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe',
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-protocol-staging',
    feeders: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-feeder-pools',
    blocks: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    ecosystem: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-ecosystem',
    curve: 'https://api.thegraph.com/subgraphs/name/protofire/curve',
    sushi: 'https://api.thegraph.com/subgraphs/name/jiro-ono/sushiswap-v1-exchange',
    balancer: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
    uniswap: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
  },
  addresses: {
    MTA: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    vMTA: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    FeederWrapper: '0x7C1fD068CE739A4687BEe9F69e5FD2275C7372d4',
    SaveWrapper: '0x0CA7A25181FC991e3cC62BaC511E62973991f325',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    Curve: {
      CurveV2: '0x1aef73d49dedc4b1778d0706583995958dc862e6',
    },
    ERC20: {
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      BADGER: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
      CREAM: '0x2ba592F78dB6436527729929AAf6c908497cB200',
      renBTC: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
    },
  },
  getExplorerUrl: etherscanUrl(),
}

const ETH_ROPSTEN: EthereumRopsten = {
  ...ETH_MAINNET,
  isTestnet: true,
  parentChainId: ChainIds.EthereumMainnet,
  chainId: ChainIds.EthereumRopsten,
  chainName: 'Ropsten',
  rpcEndpoint: 'https://ropsten.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe',
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-protocol-ropsten',
    feeders: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-feeders-ropsten',
    blocks: 'https://api.thegraph.com/subgraphs/name/blocklytics/ropsten-blocks',
    ecosystem: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-ecosystem',
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    FeederWrapper: '',
    SaveWrapper: '',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  getExplorerUrl: etherscanUrl('ropsten'),
}

const ETH_GOERLI: EthereumGoerli = {
  ...ETH_MAINNET,
  isTestnet: true,
  parentChainId: ChainIds.EthereumMainnet,
  chainId: ChainIds.EthereumGoerli,
  chainName: 'Görli',
  rpcEndpoint: 'https://goerli.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe',
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-protocol-goerli',
    feeders: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-feeders-goerli',
    blocks: 'https://api.thegraph.com/subgraphs/name/blocklytics/goerli-blocks',
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5',
    SaveWrapper: '0x5047Ee646E3425264416bf7d2a651985E513Ff32',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  getExplorerUrl: etherscanUrl('goerli'),
}

const MATIC_MAINNET: MaticMainnet = {
  chainId: ChainIds.MaticMainnet,
  parentChainId: ChainIds.EthereumMainnet,
  protocolName: 'Polygon',
  chainName: 'Mainnet',
  nativeToken: {
    symbol: 'MATIC',
    decimals: 18,
    parentChainAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  },
  isMetaMaskDefault: false,
  isTestnet: false,
  blockTime: 2e3,
  coingeckoId: 'matic-network',
  rpcEndpoint: 'https://rpc-mainnet.maticvigil.com/v1/9014a595065319bb6d40417c45281c2608a943c7',
  gasStationEndpoint: 'https://gasstation-mainnet.matic.network',
  gqlEndpoints: {
    // TODO deploy
    protocol: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-protocol-matic',
    feeders: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-feeder-pools-matic',
    blocks: 'https://api.thegraph.com/subgraphs/name/elkfinance/matic-blocks',
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0', // Mainnet
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015', // Mainnet
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5', // Mainnet
    SaveWrapper: '',
    UniswapRouter02_Like: '0xFCB5348111665Cf95a777f0c4FCA768E05601760', // QuickSwap
    ERC20: {
      wMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    },
  },
  getExplorerUrl: maticExplorerUrl('mainnet'),
}

const MATIC_MUMBAI: MaticMumbai = {
  ...MATIC_MAINNET,
  isTestnet: true,
  chainId: ChainIds.MaticMumbai,
  parentChainId: ChainIds.EthereumGoerli,
  chainName: 'Mumbai',
  rpcEndpoint: 'https://rpc-mumbai.maticvigil.com/v1/9014a595065319bb6d40417c45281c2608a943c7',
  gasStationEndpoint: 'https://gasstation-mumbai.matic.today',
  gqlEndpoints: {
    protocol: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-protocol-polygon-mumbai',
    feeders: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-feeder-pools-mumbai',
    // This is for mainnet, no subgraph available for Mumbai
    blocks: 'https://api.thegraph.com/subgraphs/name/elkfinance/matic-blocks',
    ecosystem: 'https://api.thegraph.com/subgraphs/name/mstable/mstable-ecosystem', // fixme remove
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0', // Mainnet
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015', // Mainnet
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5', // Mainnet
    SaveWrapper: '0xFd257a60881678cF0E37179F1ECF317a6f29482B',
    UniswapRouter02_Like: '0xFCB5348111665Cf95a777f0c4FCA768E05601760', // QuickSwap
    ERC20: {
      wMATIC: '0x5B67676a984807a212b1c59eBFc9B3568a474F0a',
    },
  },
  getExplorerUrl: maticExplorerUrl('mumbai'),
}

export const NETWORKS = [ETH_MAINNET, ETH_GOERLI, ETH_ROPSTEN, MATIC_MAINNET, MATIC_MUMBAI]

export const getNetwork = (chainId: ChainIds | 0): Extract<AllNetworks, { chainId: typeof chainId }> => {
  switch (chainId) {
    case 0:
    case ChainIds.EthereumMainnet:
      return ETH_MAINNET

    case ChainIds.EthereumRopsten:
      return ETH_ROPSTEN

    case ChainIds.EthereumGoerli:
      return ETH_GOERLI

    case ChainIds.MaticMainnet:
      return MATIC_MAINNET

    case ChainIds.MaticMumbai:
      return MATIC_MUMBAI

    default:
      throw new Error('Unsupported chain ID')
  }
}

// TODO could still use an env var to define the default chain ID
// Or even domain matching (polygon.*)
const [useChainIdCtx, ChainIdProvider] = createStateContext<ChainIds | undefined>(ChainIds.EthereumMainnet)
export { useChainIdCtx }

const networkCtx = createContext<Network<unknown, unknown>>(null as never)

const networkPricesCtx = createContext<FetchState<NetworkPrices>>(null as never)

const jsonRpcCtx = createContext<{ provider: Provider; parentChainProvider?: Provider } | undefined>(undefined)

const NetworkConfigProvider: FC = ({ children }) => {
  const [chainId] = useChainIdCtx()

  const network = useMemo(() => getNetwork(chainId ?? ChainIds.EthereumMainnet), [chainId])

  return <networkCtx.Provider value={network}>{children}</networkCtx.Provider>
}

const NetworkPricesProvider: FC = ({ children }) => {
  const network = useContext(networkCtx)

  const [networkPrices, setNetworkPrices] = useFetchState<NetworkPrices>({})

  const fetchPrices = useCallback(async () => {
    if (!network) return

    setNetworkPrices.fetching()
    const gasStationResponse = await fetch(network.gasStationEndpoint)
    const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${network.coingeckoId}&vs_currencies=usd`)

    const [{ standard, instant, fast, fastest, safeLow, slow }, priceResult] = (await Promise.all([
      gasStationResponse.json(),
      priceResponse.json(),
    ])) as [
      {
        fast: number
        standard: number
        // Interface differences across endpoints
        fastest?: number
        instant?: number
        safeLow?: number
        slow?: number
      },
      Record<typeof network['coingeckoId'], { usd: number }>,
    ]

    const nativeToken = priceResult[network.coingeckoId].usd
    const gas = {
      standard,
      fast,
      slow: slow ?? (safeLow as number),
      instant: instant ?? (fastest as number),
    }

    setNetworkPrices.value({ nativeToken, gas })
  }, [network, setNetworkPrices])

  useEffectOnce(() => {
    fetchPrices().catch(setNetworkPrices.error)
  })

  useInterval(() => {
    fetchPrices().catch(setNetworkPrices.error)
  }, 5 * 60 * 1000)

  return <networkPricesCtx.Provider value={networkPrices}>{children}</networkPricesCtx.Provider>
}

const JsonRpcProvider: FC = ({ children }) => {
  const network = useContext(networkCtx)

  const value = useMemo(() => {
    if (!network) return undefined

    const { rpcEndpoint, parentChainId } = network
    const provider = new providers.JsonRpcProvider(rpcEndpoint)

    let parentChainProvider
    if (parentChainId) {
      const { rpcEndpoint: parentRpcEndpoint } = getNetwork(parentChainId)
      parentChainProvider = new providers.JsonRpcProvider(parentRpcEndpoint)
    }

    return { provider, parentChainProvider }
  }, [network])

  return <jsonRpcCtx.Provider value={value}>{children}</jsonRpcCtx.Provider>
}

export const useJsonRpcProviders = (): { provider: Provider; parentChainProvider?: Provider } | undefined => useContext(jsonRpcCtx)

export const useNetwork = (): Network<unknown, unknown> => useContext(networkCtx)

export const useNetworkPrices = (): FetchState<NetworkPrices> => useContext(networkPricesCtx)

export const useNetworkAddresses = (): AllNetworks['addresses'] => useContext(networkCtx).addresses as AllNetworks['addresses']

export const useGetExplorerUrl = (): Network<unknown, unknown>['getExplorerUrl'] => useNetwork().getExplorerUrl

export const NetworkProvider = composedComponent(ChainIdProvider, NetworkConfigProvider, NetworkPricesProvider, JsonRpcProvider)
