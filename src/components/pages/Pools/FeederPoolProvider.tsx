import type { FC } from 'react'
import React, { createContext, useContext, useMemo } from 'react'
import type { BoostedSavingsVault, FeederPool, FeederWrapper } from '@mstable/protocol/types/generated'
import { BoostedSavingsVault__factory, FeederPool__factory, FeederWrapper__factory } from '@mstable/protocol/types/generated'

import type { AddressOption } from '../../../types'
import type { FeederPoolState, MassetState } from '../../../context/DataProvider/types'
import { useFeederPool, useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { useSigner } from '../../../context/AccountProvider'
import { useNetworkAddresses } from '../../../context/NetworkProvider'
import { useTokenSubscription } from '../../../context/TokensProvider'
import { UseBigDecimalInputsArg } from '../../../hooks/useBigDecimalInputs'

interface PoolState {
  poolAddress: string
  vaultAddress: string
  contracts?: {
    feederPool: FeederPool
    vault: BoostedSavingsVault
    feederWrapper: FeederWrapper
  }
}

const ctx = createContext<PoolState>(null as never)

export const useSelectedFeederPoolAddress = (): string => {
  return useContext(ctx).poolAddress
}

export const useSelectedFeederPoolState = (): FeederPoolState => {
  const { poolAddress } = useContext(ctx)
  // Should be mounted below a check for this state
  return useFeederPool(poolAddress) as FeederPoolState
}

export const useSelectedFeederPoolContracts = (): PoolState['contracts'] => useContext(ctx).contracts

export const useSelectedFeederPoolContract = (): FeederPool | undefined => {
  return useContext(ctx)?.contracts?.feederPool
}

export const useSelectedFeederPoolVaultContract = (): BoostedSavingsVault | undefined => {
  return useContext(ctx)?.contracts?.vault
}

export const useFPAssetAddressOptions = (includeFpToken?: boolean): AddressOption[] => {
  const { bAssets } = useSelectedMassetState() as MassetState
  const { fasset, masset, token } = useSelectedFeederPoolState()
  return useMemo(
    () => [
      masset.token,
      fasset.token,
      ...Object.values(bAssets).map(b => b.token),
      ...(includeFpToken
        ? [
            {
              ...token,
              custom: true,
              label: `Pool`,
              tip: `${token.symbol} Pool`,
            },
          ]
        : []),
    ],
    [bAssets, fasset.token, includeFpToken, masset.token, token],
  )
}

export const useFPVaultAddressOptions = (): AddressOption[] => {
  const { token, vault } = useSelectedFeederPoolState()
  return useMemo(
    () => [
      {
        custom: true,
        label: `Vault`,
        address: vault.address,
        symbol: `vault`,
        balance: vault.account?.rawBalance,
        tip: `${token.symbol} Pool Vault`,
      },
      {
        address: token.address,
        label: `Pool`,
        custom: true,
        symbol: token.symbol,
        balance: token?.balance,
        tip: `${token.symbol} Pool`,
      },
    ],
    [vault, token],
  )
}

export const useSelectedFeederPoolAssets = (): UseBigDecimalInputsArg => {
  const feederPool = useSelectedFeederPoolState()
  return useMemo(
    () => Object.fromEntries([feederPool.masset.token, feederPool.fasset.token].map(({ address, decimals }) => [address, { decimals }])),
    [feederPool],
  )
}

export const FeederPoolProvider: FC<{ poolAddress: string }> = ({ poolAddress, children }) => {
  // Should be mounted below a check for this state
  const feederPool = useFeederPool(poolAddress) as FeederPoolState
  const vaultAddress = feederPool.vault.address

  // Subscribe at provider level so we can rely on the data being there
  // in child components
  useTokenSubscription(poolAddress)
  useTokenSubscription(feederPool.masset.address)
  useTokenSubscription(feederPool.fasset.address)

  const signer = useSigner()
  const networkAddresses = useNetworkAddresses()

  const poolState = useMemo<PoolState>(
    () => ({
      poolAddress,
      vaultAddress,
      contracts:
        signer && networkAddresses
          ? {
              feederPool: FeederPool__factory.connect(poolAddress, signer),
              feederWrapper: FeederWrapper__factory.connect(networkAddresses.FeederWrapper, signer),
              vault: BoostedSavingsVault__factory.connect(vaultAddress, signer),
            }
          : undefined,
    }),
    [poolAddress, vaultAddress, signer, networkAddresses],
  )

  return <ctx.Provider value={poolState}>{children}</ctx.Provider>
}
