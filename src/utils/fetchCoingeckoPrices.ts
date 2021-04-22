export interface CoingeckoPrices {
  [address: string]: { usd: number }
}

export const fetchCoingeckoPrices = async (addresses: string[]): Promise<CoingeckoPrices> => {
  const result = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(',')}&vs_currencies=USD`,
  )
  return result.json()
}
