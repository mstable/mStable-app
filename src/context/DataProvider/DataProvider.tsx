import React, { createContext, FC, useContext, useMemo, useState } from 'react'
import { pipe } from 'ts-pipe-compose'

import type { BoostedSavingsVaultState, DataState, FeederPoolState, MassetState, SavingsContractState } from './types'
import { Tokens, useTokensState } from '../TokensProvider'
import { recalculateState } from './recalculateState'
import { transformRawData } from './transformRawData'
import { useBlockPollingSubscription } from './subscriptions'
import { useAccount } from '../AccountProvider'
import { useBlockNow } from '../BlockProvider'
import { MassetsQueryResult, useMassetsLazyQuery } from '../../graphql/protocol'
import { FeederPoolsQueryResult, useFeederPoolsLazyQuery } from '../../graphql/feeders'
import { useSelectedMassetName } from '../SelectedMassetNameProvider'

type NonNullableRawData = [NonNullable<MassetsQueryResult['data']>, NonNullable<FeederPoolsQueryResult['data']>, Tokens]

const dataStateCtx = createContext<DataState>({})

const useRawData = (): [MassetsQueryResult['data'], FeederPoolsQueryResult['data'], Tokens] => {
  const blockNumber = useBlockNow()
  const { tokens } = useTokensState()

  const account = useAccount()
  const baseOptions = useMemo(
    () => ({
      variables: { account: account ?? '', hasAccount: !!account },
    }),
    [account],
  )

  const massetsSub = useBlockPollingSubscription(useMassetsLazyQuery, baseOptions)

  const feedersSub = useBlockPollingSubscription(useFeederPoolsLazyQuery, baseOptions)

  // Intentionally limit updates.
  // Given that the blockNumber and the subscription's loading state are what
  // drive updates to both the tokens state and the DataState, use these
  // as the deps to prevent creating new objects with the same underlying data.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => [massetsSub.data, feedersSub.data, tokens], [blockNumber, massetsSub.loading, feedersSub.loading, tokens])
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

export const DataProvider: FC = ({ children }) => {
  const rawData = useRawData()

  const [dataStatePrev, setDataStatePrev] = useState<DataState>({})

  const nextDataState = useMemo<DataState | undefined>(() => {
    // Since multiple data sources are used, wait for the data to be
    // present in both results
    if (rawData[0]?.massets && rawData[1]?.feederPools) {
      const result = pipe<NonNullableRawData, DataState, DataState>(rawData as NonNullableRawData, transformRawData, recalculateState)
      // Set the previous data state to this valid state
      setDataStatePrev(result)
      return result
    }
  }, [rawData])

  // Use the previous data state as a fallback; prevents re-renders
  // with missing data
  const value = nextDataState ?? dataStatePrev

  if (process.env.NODE_ENV === 'development') {
    ;(window as { dataState?: DataState }).dataState = value
  }

  return <dataStateCtx.Provider value={value}>{children}</dataStateCtx.Provider>
}
