import { useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { AllNetworks, ChainIds, useNetwork } from '../context/NetworkProvider'
import { useSelectedMassetName } from '../context/SelectedMassetNameProvider'
import { fetchCoingeckoPrices } from '../utils/fetchCoingeckoPrices'

interface PricesMap {
  [address: string]: number
}

// Quick and dirty, not a good pattern
let priceCache: PricesMap = {}

const usePrices = (tokens: string[]): number[] | undefined => {
  const [priceMap, setPriceMap] = useState<PricesMap>(priceCache)

  useEffectOnce(() => {
    if (!tokens.length) return

    const missing = tokens.filter(token => !priceMap[token])

    if (missing.length) {
      fetchCoingeckoPrices(missing)
        .then(result => {
          const fetchedPrices = missing.map(token => [token, result?.[token]?.usd]).filter(([, price]) => price) as [string, number][]

          const updatedPrices = fetchedPrices.reduce((prev, [token, price]) => ({ ...prev, [token]: price }), priceMap)

          priceCache = { ...priceCache, ...updatedPrices }

          setPriceMap(updatedPrices)
        })
        .catch(error => {
          console.warn('Error fetching CoinGecko prices', error)
        })
    }
  })

  return useMemo(() => {
    const prices = tokens.map(token => priceMap[token] ?? priceCache[token])
    // All or nothing
    return prices.length === tokens.length ? prices : undefined
  }, [tokens, priceMap])
}

export const useSavePrices = (): number[] | undefined => {
  const network = useNetwork()
  const addresses =
    network && network.chainId === ChainIds.EthereumMainnet
      ? [network.addresses?.MTA, (network as Extract<AllNetworks, { chainId: ChainIds.EthereumMainnet }>)?.addresses.ERC20.WBTC]
      : []
  return usePrices(addresses)
}

export const useWBTCPrice = (): number | undefined => {
  const network = useNetwork()
  const addresses =
    network && network.chainId === ChainIds.EthereumMainnet
      ? [(network as Extract<AllNetworks, { chainId: ChainIds.EthereumMainnet }>)?.addresses.ERC20.WBTC]
      : []
  return usePrices(addresses)?.[0]
}

export const useMtaPrice = (): number | undefined => {
  const network = useNetwork()
  return usePrices(network?.addresses.MTA ? [network.addresses.MTA] : [])?.[0]
}

export const useSelectedMassetPrice = (): number | undefined => {
  const massetName = useSelectedMassetName()
  const wbtcPrice = useWBTCPrice()
  // TODO support more mAssets, use mUSD price feed
  return massetName === 'mbtc' ? wbtcPrice : 1
}
