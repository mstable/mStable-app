import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useInterval, useEffectOnce } from 'react-use';

import { BigDecimal } from '../web3/BigDecimal';
import { useBlockNumber } from './BlockProvider';
import { useSigner, useWalletAddress } from './OnboardProvider';

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

interface EthPrices {
  eth?: number;
  gas?: {
    standard: number;
    fast: number;
    instant: number;
    custom: undefined;
  };
}

type EthBalance = BigDecimal | undefined;

const ethPricesCtx = createContext<EthPrices>({});

const ethBalanceCtx = createContext<EthBalance>(undefined);

const EthBalanceProvider: FC = ({ children }) => {
  const [ethBalance, setEthBalance] = useState<EthBalance>();

  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const blockNumber = useBlockNumber();

  useEffect(() => {
    if (walletAddress && signer?.provider) {
      signer.provider.getBalance(walletAddress).then(balance => {
        setEthBalance(new BigDecimal(balance));
      });
    } else {
      setEthBalance(undefined);
    }
  }, [blockNumber, setEthBalance, signer, walletAddress]);

  return (
    <ethBalanceCtx.Provider value={ethBalance}>
      {children}
    </ethBalanceCtx.Provider>
  );
};

export const useGasPrices = (): EthPrices => useContext(ethPricesCtx);

export const useEthBalance = (): EthBalance => useContext(ethBalanceCtx);

export const EthProvider: FC = ({ children }) => {
  const [prices, setPrices] = useState<EthPrices>({});

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

  return (
    <EthBalanceProvider>
      <ethPricesCtx.Provider value={prices}>{children}</ethPricesCtx.Provider>
    </EthBalanceProvider>
  );
};
