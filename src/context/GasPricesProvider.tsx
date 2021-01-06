import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useInterval, useEffectOnce } from 'react-use';

interface POANetworkGasPriceResponse {
  health: boolean;
  block_number: number;
  block_time: number;
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}

interface CoingeckoPriceResponse {
  ethereum: {
    usd: number;
  };
}

interface Ctx {
  eth?: number;
  gas?: {
    standard: number;
    fast: number;
    instant: number;
    custom: undefined;
  };
}

const ctx = createContext<Ctx>({});

export const useGasPrices = (): Ctx => useContext(ctx);

export const GasPricesProvider: FC = ({ children }) => {
  const [prices, setPrices] = useState<Ctx>({});

  const fetchPrices = useCallback(async () => {
    const [gasPriceResponse, ethPriceResponse] = await Promise.all([
      fetch('https://gasprice.poa.network/'),
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      ),
    ]);

    const [
      { standard, fast, instant },
      {
        ethereum: { usd: eth },
      },
    ] = await Promise.all<POANetworkGasPriceResponse, CoingeckoPriceResponse>([
      gasPriceResponse.json(),
      ethPriceResponse.json(),
    ]);

    setPrices({ gas: { standard, fast, instant, custom: undefined }, eth });
  }, []);

  useEffectOnce(() => {
    fetchPrices().catch(err => {
      console.warn(err);
    });
  });

  useInterval(() => {
    fetchPrices().catch(err => {
      console.warn(err);
    });
  }, 5 * 60 * 1000);

  return <ctx.Provider value={prices}>{children}</ctx.Provider>;
};
