import type { API, Wallet } from 'bnc-onboard/dist/src/interfaces'
import type { FC } from 'react'
import type { Provider, Web3Provider as EthersWeb3Provider } from '@ethersproject/providers'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createStateContext, useEffectOnce, useIdle, usePrevious } from 'react-use'
import Onboard from 'bnc-onboard'
import { ethers, Signer, utils } from 'ethers'

import { BigDecimal } from '../web3/BigDecimal'
import { composedComponent } from '../utils/reactUtils'
import { LocalStorage } from '../localStorage'
import { useAddErrorNotification, useAddInfoNotification } from './NotificationsProvider'
import { ChainIds, useChainIdCtx, useJsonRpcProviders, useNetwork, getNetwork } from './NetworkProvider'

export interface OnboardCtx {
  onboard?: API
  connect(): void
  reset(): void
  connected: boolean
  address?: string
  balance?: string
  wallet?: Wallet
}

interface UserAccountCtx {
  address?: string
  masqueradedAccount?: string
  idle: boolean
}

type Masquerade = (account?: string) => void

export const onboardCtx = createContext<OnboardCtx>(null as never)

const [useSignerCtx, SignerProvider] = createStateContext<
  | {
      provider: Provider
      parentChainProvider?: Provider
      signer?: Signer
    }
  | undefined
>(undefined)

export { useSignerCtx }

const masqueradeCtx = createContext<Masquerade>(null as never)

export const userAccountCtx = createContext<UserAccountCtx>({
  idle: false,
  address: undefined,
  masqueradedAccount: undefined,
})

export const nativeTokenBalanceCtx = createContext<BigDecimal | undefined>(undefined)

export const useWallet = (): OnboardCtx['wallet'] => useContext(onboardCtx).wallet

export const useProvider = (): Provider | undefined => useSignerCtx()[0]?.provider

export const useWalletAddress = (): OnboardCtx['address'] => useContext(onboardCtx).address

export const useConnect = (): OnboardCtx['connect'] => useContext(onboardCtx).connect

export const useSigner = (): Signer | undefined => useSignerCtx()[0]?.signer

export const useConnected = (): OnboardCtx['connected'] => useContext(onboardCtx).connected

export const useReset = (): OnboardCtx['reset'] => useContext(onboardCtx).reset

export const useSignerOrProvider = (): Signer | Provider | undefined => {
  const [signerProvider] = useSignerCtx()
  return signerProvider?.signer ?? signerProvider?.provider
}

export const useNativeTokenBalance = (): BigDecimal | undefined => useContext(nativeTokenBalanceCtx)

export const useMasquerade = (): Masquerade => useContext(masqueradeCtx)

export const useUserState = (): UserAccountCtx => useContext(userAccountCtx)

export const useIsIdle = (): UserAccountCtx['idle'] => useUserState().idle

export const useAccount = (): UserAccountCtx['masqueradedAccount'] | UserAccountCtx['address'] => {
  const { address, masqueradedAccount } = useUserState()
  return masqueradedAccount || address
}

export const useOwnAccount = (): UserAccountCtx['address'] => useUserState().address

export const useIsMasquerading = (): boolean => Boolean(useUserState().masqueradedAccount)

const OnboardProvider: FC<{
  chainId: ChainIds
  setInjectedChainId(chainId?: number): void
  setInjectedProvider(provider?: EthersWeb3Provider): void
}> = ({ children, chainId, setInjectedChainId, setInjectedProvider }) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [balance, setBalance] = useState<string | undefined>(undefined)
  const [connected, setConnected] = useState<boolean>(false)
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)

  const addInfoNotification = useAddInfoNotification()
  const addErrorNotification = useAddErrorNotification()

  const network = useNetwork()
  const rpcUrl = network.rpcEndpoint

  const onboard = useMemo(
    () =>
      Onboard({
        hideBranding: true,
        networkId: chainId,
        subscriptions: {
          address: account => {
            if (!account) {
              LocalStorage.removeItem('walletName')
              setWallet(undefined)
              setInjectedProvider(undefined)
              setConnected(false)
              onboard.walletReset()
              return
            }
            setAddress(account.toLowerCase())
          },
          network: setInjectedChainId,
          balance: setBalance,
          wallet: walletInstance => {
            if (!walletInstance.provider) {
              setWallet(undefined)
              setInjectedProvider(undefined)
              setConnected(false)
              return
            }

            setWallet(walletInstance)
            const ethersProvider = new ethers.providers.Web3Provider(walletInstance.provider, 'any')
            setInjectedProvider(ethersProvider)
            setConnected(true)

            if (walletInstance.name) {
              LocalStorage.set('walletName', walletInstance.name)
            } else {
              LocalStorage.removeItem('walletName')
            }
          },
        },
        walletSelect: {
          wallets: [
            { walletName: 'coinbase', preferred: true },
            { walletName: 'trust', preferred: true, rpcUrl },
            { walletName: 'metamask', preferred: true },
            { walletName: 'dapper' },
            {
              walletName: 'trezor',
              appUrl: window.location.hostname,
              email: 'info@mstable.org',
              rpcUrl,
              preferred: true,
            },
            {
              walletName: 'ledger',
              rpcUrl,
              preferred: true,
            },
            {
              walletName: 'lattice',
              rpcUrl,
              appName: 'mStable',
            },
            {
              walletName: 'fortmatic',
              apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
            },
            {
              walletName: 'portis',
              apiKey: process.env.REACT_APP_PORTIS_DAPP_ID,
            },
            {
              walletName: 'squarelink',
              apiKey: process.env.REACT_APP_SQUARELINK_CLIENT_ID,
            },
            { walletName: 'authereum' },
            {
              walletName: 'walletConnect',
              infuraKey: process.env.REACT_APP_RPC_API_KEY,
              preferred: true,
            },
            { walletName: 'opera' },
            { walletName: 'operaTouch' },
            { walletName: 'torus' },
            { walletName: 'status' },
            { walletName: 'unilogin' },
            { walletName: 'walletLink', rpcUrl, appName: 'mStable' },
            { walletName: 'imToken', rpcUrl },
            { walletName: 'meetone' },
            { walletName: 'mykey', rpcUrl },
            { walletName: 'huobiwallet', rpcUrl },
            { walletName: 'hyperpay' },
            { walletName: 'wallet.io', rpcUrl },
          ],
        },
        walletCheck: [{ checkName: 'derivationPath' }, { checkName: 'connect' }, { checkName: 'accounts' }, { checkName: 'network' }],
      }),
    [chainId, rpcUrl, setInjectedChainId, setInjectedProvider],
  )

  const connect = useCallback(
    async (walletName?: string) => {
      try {
        const selected = await onboard.walletSelect(walletName)
        if (selected) {
          await onboard.walletCheck()
          addInfoNotification(
            `Connected${typeof walletName === 'string' ? ` with ${walletName}` : ''}`,
            `${network.protocolName} (${network.chainName})`,
          )
          setConnected(true)
          if (walletName) LocalStorage.set('walletName', walletName)
          return
        }
      } catch (error) {
        console.error(error)
        return
      }

      LocalStorage.removeItem('walletName')
      onboard.walletReset()
      addErrorNotification('Unable to connect wallet')
      setConnected(false)
      setWallet(undefined)
      setInjectedProvider(undefined)
    },
    [onboard, addErrorNotification, setInjectedProvider, addInfoNotification, network],
  )

  const reset = useCallback(() => {
    onboard.walletReset()
    LocalStorage.removeItem('walletName')
    setWallet(undefined)
    setConnected(false)
    setInjectedProvider(undefined)
  }, [onboard, setInjectedProvider])

  useEffectOnce(() => {
    const previouslySelectedWallet = LocalStorage.get('walletName')

    if (previouslySelectedWallet && onboard.walletSelect) {
      connect(previouslySelectedWallet).catch(error => {
        console.error(error)
      })
    }
  })

  return (
    <onboardCtx.Provider
      value={useMemo(
        () => ({
          onboard,
          address,
          balance,
          wallet,
          connected,
          connect,
          reset,
        }),
        [onboard, address, balance, wallet, connected, connect, reset],
      )}
    >
      {children}
    </onboardCtx.Provider>
  )
}

const AccountState: FC = ({ children }) => {
  const address = useWalletAddress()
  const idle = useIdle()
  const [masqueradedAccount, masquerade] = useState<UserAccountCtx['masqueradedAccount']>()

  const state = useMemo<UserAccountCtx>(
    () => ({
      address,
      idle,
      masqueradedAccount: masqueradedAccount?.toLowerCase(),
    }),
    [address, idle, masqueradedAccount],
  )

  return (
    <masqueradeCtx.Provider value={masquerade}>
      <userAccountCtx.Provider value={state}>{children}</userAccountCtx.Provider>
    </masqueradeCtx.Provider>
  )
}

const OnboardConnection: FC = ({ children }) => {
  const [chainId, setChainId] = useChainIdCtx()
  const network = useNetwork()
  const jsonRpcProviders = useJsonRpcProviders()
  const [, setSigners] = useSignerCtx()

  const [injectedChainId, setInjectedChainId] = useState<number | undefined>()
  const [injectedProvider, setInjectedProvider] = useState<EthersWeb3Provider | undefined>(undefined)
  const previousInjectedChainId = usePrevious(injectedChainId)

  useEffect(() => {
    if (!chainId || !injectedChainId || !previousInjectedChainId) return

    // Change chainId when injectedChainId changes and doesn't match chainId
    if (injectedChainId !== chainId && previousInjectedChainId !== injectedChainId) {
      try {
        getNetwork(injectedChainId)
        setChainId(injectedChainId)
      } catch (error) {
        // TODO unsupported network, show in UI
        console.warn(error)
      }
    }
  }, [chainId, injectedChainId, previousInjectedChainId, setChainId])

  useEffect(() => {
    if (!injectedProvider || network.isMetaMaskDefault) return

    // For non-default chains and an injected provider, prompt to add the chain
    injectedProvider
      .send('wallet_addEthereumChain', [
        {
          chainId: utils.hexStripZeros(utils.hexlify(network.chainId)),
          chainName: `${network.protocolName} (${network.chainName})`,
          nativeCurrency: network.nativeToken,
          rpcUrls: [network.rpcEndpoint],
          blockExplorerUrls: [network.getExplorerUrl()],
        },
      ])
      .catch(error => {
        console.warn(error)
      })
  }, [injectedProvider, network])

  useEffect(() => {
    if (!jsonRpcProviders) return setSigners(undefined)

    setSigners({
      provider: injectedProvider ?? jsonRpcProviders.provider,
      parentChainProvider: jsonRpcProviders.parentChainProvider,
      signer: injectedProvider?.getSigner(),
    })
  }, [injectedProvider, jsonRpcProviders, setSigners])

  // Remount Onboard when the chainId changes
  // Necessitated by Onboard's design and internal state
  return (
    <OnboardProvider
      key={chainId}
      chainId={chainId ?? ChainIds.EthereumMainnet}
      setInjectedChainId={setInjectedChainId}
      setInjectedProvider={setInjectedProvider}
    >
      {children}
    </OnboardProvider>
  )
}

export const AccountProvider = composedComponent(SignerProvider, OnboardConnection, AccountState)
