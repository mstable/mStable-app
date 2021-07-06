import React, { FC, useEffect, createContext, useCallback, useContext, useMemo } from 'react'
import { createStateContext, useInterval } from 'react-use'
import { providers } from 'ethers'
import type { Provider } from '@ethersproject/providers'

import { composedComponent } from '../utils/reactUtils'
import { FetchState, useFetchState } from '../hooks/useFetchState'
import { LocalStorage } from '../localStorage'
import { DEAD_ADDRESS } from '../constants'
import { MassetName } from '../types'

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

type GraphQLEndpoints<T extends string> = Record<T, [string] | [string, string]>

type MstableGqlEndpoints = GraphQLEndpoints<'protocol' | 'feeders'>

type CoreGqlEndpoints = MstableGqlEndpoints & GraphQLEndpoints<'blocks'>

export enum ChainIds {
  EthereumMainnet = 1,
  EthereumRopsten = 3,
  EthereumGoerli = 5,
  MaticMainnet = 137,
  MaticMumbai = 80001,
}

export enum Networks {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
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

  rpcEndpoints: string[]

  gqlEndpoints: CoreGqlEndpoints & TGqlEndpoints

  addresses: CoreAddresses & { ERC20: { wMATIC?: string; WETH?: string; FXS?: string } } & TAddresses

  gasStationEndpoint: string

  getExplorerUrl(entity?: string, type?: 'address' | 'transaction' | 'token' | 'account'): string

  supportedMassets: MassetName[]
}

export interface EthereumMainnet
  extends Network<
    {
      ERC20: {
        WETH: string
        WBTC: string
      }
      // TODO remove, just for testing
      ['FRAX/IQ']: { stakingContract: string; stakingToken: string; rewardsTokens: [string, string] }
    },
    {}
  > {
  chainId: ChainIds.EthereumMainnet
}

export interface EthereumRopsten extends Network<{ ERC20: { WETH: string } }, {}> {
  chainId: ChainIds.EthereumRopsten
}

export interface EthereumGoerli extends Network<{ ERC20: { WETH: string } }, {}> {
  chainId: ChainIds.EthereumGoerli
}

export interface MaticMainnet extends Network<{ ERC20: { wMATIC: string } }, GraphQLEndpoints<'stakingRewards'>> {
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

const etherscanUrl = (network?: string, domain = 'etherscan.io') => (
  data?: string,
  type?: 'account' | 'transaction' | 'address' | 'token',
): string => {
  const prefix = `https://${network ? `${network}.` : ''}${domain}`

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

const GRAPH_API_KEY = '9bcd013940ae451d941a8e9f925546a2'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const graphMainnetEndpoint = (subgraphId: string, version: number): string =>
  `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${subgraphId}-${version}`

const graphHostedEndpoint = (orgName: string, subgraphName: string): string =>
  `https://api.thegraph.com/subgraphs/name/${orgName}/${subgraphName}`

const ETH_MAINNET: EthereumMainnet = {
  chainId: ChainIds.EthereumMainnet,
  protocolName: Networks.Ethereum,
  chainName: 'Mainnet',
  nativeToken: {
    symbol: 'ETH',
    decimals: 18,
  },
  isMetaMaskDefault: true,
  isTestnet: false,
  blockTime: 15e3,
  coingeckoId: 'ethereum',
  rpcEndpoints: ['https://mainnet.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe'],
  gasStationEndpoint: 'https://www.gasnow.org/api/v3/gas/price?utm_source=:mstable',
  gqlEndpoints: {
    protocol: [
      graphMainnetEndpoint('0x26cf67040678eb0f5654c9cbaad78dc1694cbafa', 0),
      graphHostedEndpoint('mstable', 'mstable-protocol-staging'),
    ],
    feeders: [graphHostedEndpoint('mstable', 'mstable-feeder-pools')],
    blocks: [graphHostedEndpoint('blocklytics', 'ethereum-blocks')],
  },
  addresses: {
    MTA: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    vMTA: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    FeederWrapper: '0x7C1fD068CE739A4687BEe9F69e5FD2275C7372d4',
    SaveWrapper: '0x0CA7A25181FC991e3cC62BaC511E62973991f325',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    },
    'FRAX/IQ': {
      stakingContract: '0xf37057823910653a554d996b49e3399dc87fae1b',
      rewardsTokens: ['0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0', '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9'],
      stakingToken: '0x853d955acef822db058eb8505911ed77f175b99e',
    },
  },
  getExplorerUrl: etherscanUrl(),
  supportedMassets: ['mbtc', 'musd'],
}

const ETH_ROPSTEN: EthereumRopsten = {
  ...ETH_MAINNET,
  isTestnet: true,
  parentChainId: ChainIds.EthereumMainnet,
  chainId: ChainIds.EthereumRopsten,
  chainName: 'Ropsten',
  rpcEndpoints: ['https://ropsten.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe'],
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-ropsten')],
    feeders: [graphHostedEndpoint('mstable', 'mstable-feeders-ropsten')],
    blocks: [graphHostedEndpoint('blocklytics', 'ropsten-blocks')],
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    FeederWrapper: DEAD_ADDRESS,
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
  rpcEndpoints: ['https://goerli.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe'],
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-goerli')],
    feeders: [graphHostedEndpoint('mstable', 'mstable-feeders-goerli')],
    blocks: [graphHostedEndpoint('blocklytics', 'goerli-blocks')],
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
  protocolName: Networks.Polygon,
  chainName: 'Mainnet',
  nativeToken: {
    symbol: 'MATIC',
    decimals: 18,
    parentChainAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  },
  isMetaMaskDefault: false,
  isTestnet: false,
  blockTime: 7e3, // Actually 2 seconds, but that means a lot of request volume
  coingeckoId: 'matic-network',
  rpcEndpoints: [
    'https://rpc-mainnet.maticvigil.com/v1/9014a595065319bb6d40417c45281c2608a943c7',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://rpc-mainnet.maticvigil.com',
  ],
  gasStationEndpoint: 'https://gasstation-mainnet.matic.network',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-polygon')],
    feeders: [graphHostedEndpoint('mstable', 'mstable-feeder-pools-polygon')],
    blocks: [graphHostedEndpoint('elkfinance', 'matic-blocks')],
    stakingRewards: [graphHostedEndpoint('mstable', 'mstable-staking-rewards-polygon')],
  },
  addresses: {
    MTA: '0xf501dd45a1198c2e1b5aef5314a68b9006d842e0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015', // Mainnet
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5', // Mainnet
    SaveWrapper: '0x299081f52738A4204C3D58264ff44f6F333C6c88',
    UniswapRouter02_Like: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', // QuickSwap
    ERC20: {
      wMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      FXS: '0x3e121107F6F22DA4911079845a470757aF4e1A1b',
    },
  },
  getExplorerUrl: etherscanUrl(undefined, 'polygonscan.com'),
  supportedMassets: ['musd'],
}

const MATIC_MUMBAI: MaticMumbai = {
  ...MATIC_MAINNET,
  isTestnet: true,
  chainId: ChainIds.MaticMumbai,
  parentChainId: ChainIds.EthereumGoerli,
  chainName: 'Mumbai',
  rpcEndpoints: ['https://rpc-mumbai.maticvigil.com/v1/9014a595065319bb6d40417c45281c2608a943c7'],
  gasStationEndpoint: 'https://gasstation-mumbai.matic.today',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-polygon-mumbai')],
    feeders: [graphHostedEndpoint('mstable', 'mstable-feeder-pools-mumbai')],
    // This is for mainnet, no subgraph available for Mumbai
    blocks: [graphHostedEndpoint('elkfinance', 'matic-blocks')],
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0', // Mainnet
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015', // Mainnet
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5', // Mainnet
    SaveWrapper: '0xeB2A92Cc1A9dC337173B10cAbBe91ecBc805C98B',
    UniswapRouter02_Like: '0xFCB5348111665Cf95a777f0c4FCA768E05601760', // QuickSwap
    ERC20: {
      wMATIC: '0x5B67676a984807a212b1c59eBFc9B3568a474F0a',
    },
  },
  getExplorerUrl: etherscanUrl('mumbai', 'polygonscan.com'),
}

export const NETWORKS = [ETH_MAINNET, ETH_GOERLI, ETH_ROPSTEN, MATIC_MAINNET, MATIC_MUMBAI]

export const getNetwork = (chainId: ChainIds | 0): Extract<AllNetworks, { chainId: typeof chainId }> => {
  switch (chainId) {
    case 0:
    case ChainIds.EthereumMainnet:
    default:
      return ETH_MAINNET

    case ChainIds.EthereumRopsten:
      return ETH_ROPSTEN

    case ChainIds.EthereumGoerli:
      return ETH_GOERLI

    case ChainIds.MaticMainnet:
      return MATIC_MAINNET

    case ChainIds.MaticMumbai:
      return MATIC_MUMBAI
  }
}

// TODO could still use an env var to define the default chain ID
// Or even domain matching (polygon.*)
const [useChainIdCtx, ChainIdProvider] = createStateContext<ChainIds | undefined>(
  LocalStorage.get('mostRecentChainId') ?? ChainIds.EthereumMainnet,
)
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

    const [{ data, standard, instant, fast, fastest, safeLow, slow }, priceResult] = (await Promise.all([
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
        data?: {
          slow: number
          fast: number
          standard: number
          rapid: number
        }
      },
      Record<typeof network['coingeckoId'], { usd: number }>,
    ]

    const gasNow = Object.fromEntries(
      Object.entries(data ?? {})
        .filter(([k]) => ['rapid', 'slow', 'standard', 'fast'].find(v => v === k))
        .map(([k, v]) => [k, v / 1e9]),
    )

    const nativeToken = priceResult[network.coingeckoId].usd
    const gas = {
      standard: standard ?? gasNow?.standard,
      fast: fast ?? gasNow?.fast,
      slow: slow ?? (safeLow as number) ?? gasNow?.slow,
      instant: instant ?? (fastest as number) ?? gasNow?.rapid,
    }

    setNetworkPrices.value({ nativeToken, gas })
  }, [network, setNetworkPrices])

  useEffect(() => {
    fetchPrices().catch(setNetworkPrices.error)
  }, [fetchPrices, network, setNetworkPrices.error])

  useInterval(() => {
    fetchPrices().catch(setNetworkPrices.error)
  }, 5 * 60 * 1000)

  return <networkPricesCtx.Provider value={networkPrices}>{children}</networkPricesCtx.Provider>
}

const JsonRpcProvider: FC = ({ children }) => {
  const network = useContext(networkCtx)

  const value = useMemo(() => {
    if (!network) return undefined

    const { rpcEndpoints, parentChainId } = network
    const provider = new providers.FallbackProvider(rpcEndpoints.map(e => new providers.JsonRpcProvider(e)))

    let parentChainProvider
    if (parentChainId) {
      const { rpcEndpoints: parentRpcEndpoints } = getNetwork(parentChainId)
      parentChainProvider = new providers.FallbackProvider(parentRpcEndpoints.map(e => new providers.JsonRpcProvider(e)))
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
