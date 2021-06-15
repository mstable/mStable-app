import React, { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { pipe } from 'ts-pipe-compose'
import { Interface } from '@ethersproject/abi'

import type { MassetInterface } from '@mstable/protocol/types/generated/Masset'
import type { BoostedSavingsVaultState, DataState, FeederPoolState, MassetState, SavingsContractState } from './types'
import { Tokens, useTokensState } from '../TokensProvider'
import { recalculateState } from './recalculateState'
import { transformRawData } from './transformRawData'
import { useBlockPollingSubscription } from './subscriptions'
import { useAccount, useSignerOrProvider } from '../AccountProvider'
import { MassetsQueryResult, useMassetsLazyQuery } from '../../graphql/protocol'
import { FeederPoolsQueryResult, useFeederPoolsLazyQuery } from '../../graphql/feeders'
import { useSelectedMassetName } from '../MassetProvider'

export interface RawData {
  massets: MassetsQueryResult['data']
  feederPools: FeederPoolsQueryResult['data']
  tokens: Tokens
  vaultBalances: { [address: string]: string }
}

const dataStateCtx = createContext<DataState>({})

const useRawData = (): Pick<RawData, 'massets' | 'feederPools'> => {
  const account = useAccount()
  const baseOptions = useMemo(
    () => ({
      variables: { account: account ?? '', accountId: account ?? '', hasAccount: !!account },
    }),
    [account],
  )

  const massetsSub = useBlockPollingSubscription(useMassetsLazyQuery, baseOptions)

  const feedersSub = useBlockPollingSubscription(useFeederPoolsLazyQuery, baseOptions)

  return { massets: massetsSub.data, feederPools: feedersSub.data }
}

export const useDataState = (): DataState => useContext(dataStateCtx)

export const useSelectedMassetState = (): MassetState | undefined => {
  const masset = useSelectedMassetName()
  return useDataState()[masset]
}

export const useSelectedBoostedSavingsVault = (): BoostedSavingsVaultState | undefined => {
  const masset = useSelectedMassetState()
  return masset?.savingsContracts?.v2?.boostedSavingsVault
}

export const useV1SavingsBalance = (): Extract<SavingsContractState, { version: 1 }>['savingsBalance'] | undefined =>
  useSelectedMassetState()?.savingsContracts?.v1?.savingsBalance

export const useFeederPool = (address: string): FeederPoolState | undefined => {
  const massetState = useSelectedMassetState()
  return massetState?.feederPools[address]
}

const massetInterface = (() => {
  const abi = [
    {
      inputs: [],
      name: 'getBassets',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'addr',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'integrator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'hasTxFee',
              type: 'bool',
            },
            {
              internalType: 'enum MassetStructs.BassetStatus',
              name: 'status',
              type: 'uint8',
            },
          ],
          internalType: 'struct MassetStructs.BassetPersonal[]',
          name: 'personal',
          type: 'tuple[]',
        },
        {
          components: [
            {
              internalType: 'uint128',
              name: 'ratio',
              type: 'uint128',
            },
            {
              internalType: 'uint128',
              name: 'vaultBalance',
              type: 'uint128',
            },
          ],
          internalType: 'struct MassetStructs.BassetData[]',
          name: 'data',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]
  return (new Interface(abi) as unknown) as MassetInterface
})()

// While subgraph data for vault balances needs updating, fetch
// vault balances from the mAsset contracts
const useVaultBalances = (massets: MassetsQueryResult['data']): RawData['vaultBalances'] => {
  const provider = useSignerOrProvider()
  const massetAddressesStr = massets?.massets.map(m => m.id).join(',') ?? ''
  const vaultBalances = useRef<Record<string, string>>()

  useEffect(() => {
    // Only fetch once
    if (!provider || vaultBalances.current) return

    const promises = massetAddressesStr
      .split(',')
      .filter(Boolean)
      .map(async address => {
        const response = await provider.call({
          to: address,
          data: massetInterface.encodeFunctionData('getBassets'),
        })
        const { data, personal } = (massetInterface.decodeFunctionResult('getBassets', response) as unknown) as {
          personal: { addr: string }[]
          data: { vaultBalance: string }[]
        }
        return data.map(({ vaultBalance }, i) => [personal[i].addr.toLowerCase(), vaultBalance] as [string, string])
      })

    Promise.all(promises)
      .then(result => {
        vaultBalances.current = Object.fromEntries(result.flat())
      })
      .catch(console.error)
  }, [massetAddressesStr, provider])

  return useMemo(() => {
    if (massets) {
      return Object.fromEntries(
        massets.massets.flatMap(({ basket: { bassets } }) =>
          bassets.map(({ token: { address }, vaultBalance: { exact: fallback } }) => [
            address,
            vaultBalances.current?.[address] ?? fallback,
          ]),
        ),
      )
    }

    return {}
  }, [massets])
}

export const DataProvider: FC = ({ children }) => {
  const { massets, feederPools } = useRawData()
  const { tokens } = useTokensState()
  const vaultBalances = useVaultBalances(massets)

  const [dataStatePrev, setDataStatePrev] = useState<DataState>({})

  const nextDataState = useMemo<DataState | undefined>(() => {
    if (massets && feederPools) {
      const result = pipe<RawData, DataState, DataState>(
        { massets, feederPools, tokens, vaultBalances },
        transformRawData,
        recalculateState,
      )
      // Set the previous data state to this valid state
      setDataStatePrev(result)
      return result
    }
  }, [massets, feederPools, tokens, vaultBalances])

  // Use the previous data state as a fallback; prevents re-renders
  // with missing data
  const value = nextDataState ?? dataStatePrev

  if (process.env.NODE_ENV === 'development') {
    ;(window as { dataState?: DataState }).dataState = value
  }

  return <dataStateCtx.Provider value={value}>{children}</dataStateCtx.Provider>
}
