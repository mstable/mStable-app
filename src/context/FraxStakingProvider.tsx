import React, { FC, createContext, useEffect, useRef, useMemo, useContext } from 'react'
import { BigNumber } from 'ethers'

import { StakingRewardsDualV3FRAXIQ__factory, StakingRewardsDualV3FRAXIQ } from '../typechain'
import { FetchState, useFetchState } from '../hooks/useFetchState'
import { BigDecimal } from '../web3/BigDecimal'

import { EthereumMainnet, useNetworkAddresses } from './NetworkProvider'
import { useSignerOrProvider } from './AccountProvider'
import { useBlockNow } from './BlockProvider'

export interface StakeData {
  earned: { address: string; amount: BigDecimal }[]
  combinedWeight: BigNumber
  lockedLiquidity: BigDecimal
  lockedStakes: {
    kekId: string
    startTime: number
    endTime: number
    liquidity: BigDecimal
    lockMultiplier: BigDecimal
  }[]
}

interface StaticData {
  address: string
  lockMaxMultiplier: number
  lockTimeMax: number
  lockTimeMin: number
  // TODO probably more?
}

interface SubscribedData {
  // totalSupply: BigDecimal
  // TODO probably more?
  lastUpdate?: number
  accountData?: StakeData
  // TODO unlockedStakes?
}

interface State {
  addresses: EthereumMainnet['addresses']['FRAX/IQ']
  static: FetchState<StaticData>
  subscribed: FetchState<SubscribedData>
}

const contractCtx = createContext<StakingRewardsDualV3FRAXIQ | undefined>(null as never)
const stateCtx = createContext<State>(null as never)

export const useFraxStakingContract = (): StakingRewardsDualV3FRAXIQ | undefined => useContext(contractCtx)
export const useFraxStakingState = (): State => useContext(stateCtx)

export const FraxStakingProvider: FC = ({ children }) => {
  const addresses = useNetworkAddresses()
  const frax = (addresses as EthereumMainnet['addresses'])['FRAX/IQ']
  const signerOrProvider = useSignerOrProvider()
  // TODO: - Change
  const account = '0x33dcde3a53d901a39c0621f662065607ccd56b4a' // useAccount()
  const blockNumber = useBlockNow()

  const contract = useRef<StakingRewardsDualV3FRAXIQ>()
  const [staticData, setStaticData] = useFetchState<StaticData>()
  const [subscribedData, setSubscribedData] = useFetchState<SubscribedData>()

  // Set/reset on network/signer change
  useEffect(() => {
    if (frax) {
      const { stakingContract } = frax
      contract.current =
        stakingContract && signerOrProvider ? StakingRewardsDualV3FRAXIQ__factory.connect(stakingContract, signerOrProvider) : undefined
    } else {
      contract.current = undefined
      setStaticData.value()
      setSubscribedData.value()
    }
  }, [frax, signerOrProvider, setStaticData, setSubscribedData])

  // Initial contract calls (once only)
  useEffect(() => {
    if (!contract.current || staticData.fetching || staticData.value) return

    setStaticData.fetching()

    Promise.all([contract.current.lock_max_multiplier(), contract.current.lock_time_for_max_multiplier(), contract.current.lock_time_min()])
      .then(([lockMaxMultiplier, lockTimeMax, lockTimeMin]) => {
        if (!contract.current) return
        setStaticData.value({
          address: contract.current.address,
          lockMaxMultiplier: parseFloat(lockMaxMultiplier.toString()) / 1e18,
          lockTimeMax: parseInt(lockTimeMax.toString()),
          lockTimeMin: parseInt(lockTimeMin.toString()),
        })
      })
      .catch(setStaticData.error)
  }, [setStaticData, staticData.fetching, staticData.value, frax])

  // Contract calls on every block
  useEffect(() => {
    if (!frax || !contract.current || subscribedData.fetching) return

    Promise.all([
      account
        ? Promise.all([
            contract.current.earned(account),
            contract.current.combinedWeightOf(account),
            contract.current.lockedStakesOf(account),
            contract.current.lockedLiquidityOf(account),
          ])
        : undefined,
    ])
      .then(([[earned, combinedWeight, lockedStakes, lockedLiquidity] = []]) => {
        let accountData: SubscribedData['accountData']
        if (earned && combinedWeight && lockedStakes && lockedLiquidity) {
          accountData = {
            earned: earned.map((amount, index) => {
              const address = index === 0 ? frax.rewardsTokens[0] : frax.rewardsTokens[1]
              return {
                address,
                amount: new BigDecimal(amount), // Assumed 18 decimals (so far, we know it will be)
              }
            }),
            combinedWeight: BigNumber.from(combinedWeight),
            lockedLiquidity: new BigDecimal(lockedLiquidity),
            lockedStakes: lockedStakes.map(({ kek_id, start_timestamp, ending_timestamp, liquidity, lock_multiplier }) => ({
              kekId: kek_id,
              startTime: new Date(parseInt(start_timestamp.toString())).getTime() * 1000, // ms
              endTime: new Date(parseInt(ending_timestamp.toString())).getTime() * 1000,
              liquidity: new BigDecimal(liquidity),
              lockMultiplier: new BigDecimal(lock_multiplier),
            })),
          }
        }
        setSubscribedData.value({ accountData, lastUpdate: blockNumber })
      })
      .catch(setSubscribedData.error)
  }, [blockNumber, account, setSubscribedData, frax, subscribedData.fetching])

  return (
    <contractCtx.Provider value={contract.current}>
      <stateCtx.Provider
        value={useMemo(
          () => ({
            addresses: frax,
            static: staticData,
            subscribed: subscribedData,
          }),
          [frax, staticData, subscribedData],
        )}
      >
        {children}
      </stateCtx.Provider>
    </contractCtx.Provider>
  )
}
