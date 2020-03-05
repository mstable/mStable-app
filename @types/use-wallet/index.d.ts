// eslint-disable-next-line spaced-comment
/// <reference types="node" />

declare module 'use-wallet' {
  import { ReactNode } from 'react';

  export interface Connectors {
    authereum: {};
    fortmatic: { apiKey: string };
    frame: {};
    injected: {};
    portis: { dAppId: string };
    squarelink: { clientId: string, options: object };
    torus: { chainId?: number, initOptions: object, constructorOptions: object };
    walletconnect: null;
    walletlink: { url: string, appName: string, appLogoUrl: string };
  }

  export interface Wallet<T> {
    account: string;
    activate(connectorId: keyof Connectors): void;
    activated: boolean;
    activating: boolean;
    balance: string;
    connected: boolean;
    connectors: Connectors;
    deactivate(): void;
    ethereum: T;
    getBlockNumber(): number;
    isContract: boolean;
    networkName: string;
  }

  interface UseWalletProviderProps {
    chainId: number;
    children: ReactNode;
    connectors?: Connectors;
    pollBalanceInterval?: number;
    pollBlockNumberInterval?: number;
  }

  interface UseWalletProps {
    pollBalanceInterval?: number;
    pollBlockNumberInterval?: number;
  }

  export function useWallet<T>(props?: UseWalletProps): Wallet<T>;

  export function UseWalletProvider(props: UseWalletProviderProps);
}
