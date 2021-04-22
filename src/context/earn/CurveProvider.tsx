import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react'

import {
  CurveDeposit__factory,
  GaugeController__factory,
  MusdGauge__factory,
  StableSwap__factory,
  StakingRewards__factory,
  TokenMinter__factory,
  CurveDeposit,
  GaugeController,
  MusdGauge,
  StableSwap,
  StakingRewards,
  TokenMinter,
} from '../../typechain'
import { useSignerOrProvider, useAccount } from '../AccountProvider'
import { useBlockNow } from '../BlockProvider'
import { BigDecimal } from '../../web3/BigDecimal'
import { ChainIds, useChainIdCtx } from '../NetworkProvider'

export const CURVE_MUSD_EARN_URL = '/earn/curve-musd-3pool'

export const CURVE_ADDRESSES = {
  CURVE_V2: '0x1aef73d49dedc4b1778d0706583995958dc862e6',
  GAUGE_CONTROLLER: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',

  CRV_TOKEN: '0xd533a949740bb3306d119cc777fa900ba034cd52',
  MUSD_TOKEN: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
  '3POOL_TOKEN': '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
  '3POOL_COINS': [
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  ],

  MTA_STAKING_REWARDS: '0xe6e6e25efda5f69687aa9914f8d750c523a1d261',

  TOKEN_MINTER: '0xd061d61a4d941c39e5453435b6345dc261c2fce0',

  MUSD_LP_TOKEN: '0x1aef73d49dedc4b1778d0706583995958dc862e6',
  MUSD_DEPOSIT: '0x78cf256256c8089d68cde634cf7cdefb39286470',
  MUSD_GAUGE: '0x5f626c30ec1215f4edcc9982265e8b1f411d1352',
  MUSD_SWAP: '0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6',
  '3POOL_SWAP': '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
}

export interface CurveContracts {
  mtaStakingRewards?: StakingRewards
  gaugeController?: GaugeController
  musdDeposit?: CurveDeposit
  musdGauge?: MusdGauge
  musdSwap?: StableSwap
  tokenMinter?: TokenMinter
}

export interface CurveBalances {
  claimableMTA?: BigDecimal
  claimableCRV?: BigDecimal
  stakingBalance?: BigDecimal
}

const contractsCtx = createContext<CurveContracts>({})
const balancesCtx = createContext<CurveBalances>({})

export const useCurveContracts = (): CurveContracts => useContext(contractsCtx)

export const useCurveBalances = (): CurveBalances => useContext(balancesCtx)

const CurveContractsProvider: FC = ({ children }) => {
  const provider = useSignerOrProvider()
  const [chainId] = useChainIdCtx()

  const contracts = useMemo<CurveContracts>(() => {
    if (!provider) return {}

    if (chainId === ChainIds.EthereumMainnet) {
      return {
        mtaStakingRewards: StakingRewards__factory.connect(CURVE_ADDRESSES.MTA_STAKING_REWARDS, provider),
        gaugeController: GaugeController__factory.connect(CURVE_ADDRESSES.GAUGE_CONTROLLER, provider),
        tokenMinter: TokenMinter__factory.connect(CURVE_ADDRESSES.TOKEN_MINTER, provider),
        musdDeposit: CurveDeposit__factory.connect(CURVE_ADDRESSES.MUSD_DEPOSIT, provider),
        musdGauge: MusdGauge__factory.connect(CURVE_ADDRESSES.MUSD_GAUGE, provider),
        musdSwap: StableSwap__factory.connect(CURVE_ADDRESSES.MUSD_SWAP, provider),
      }
    }
    return {}
  }, [chainId, provider])

  return <contractsCtx.Provider value={contracts}>{children}</contractsCtx.Provider>
}

const CurveBalancesProvider: FC = ({ children }) => {
  const account = useAccount()
  const blockNumber = useBlockNow()
  const [balances, setBalances] = useState<CurveBalances>({})
  const { musdGauge } = useCurveContracts()

  useEffect(() => {
    if (account && musdGauge) {
      Promise.all([
        musdGauge.claimed_rewards_for(account),
        musdGauge.claimable_reward(account),
        musdGauge.claimable_tokens(account),
        musdGauge.balanceOf(account),
        musdGauge.rewards_for(account),
      ]).then(([claimedReward, claimableReward, claimableCRV, balance]) => {
        setBalances({
          claimableMTA: new BigDecimal(claimableReward.sub(claimedReward), 18),
          claimableCRV: new BigDecimal(claimableCRV, 18),
          stakingBalance: new BigDecimal(balance, 18),
        })
      })
      return
    }

    setBalances({})
    // eslint-disable-next-line
  }, [blockNumber, account])

  return <balancesCtx.Provider value={balances}>{children}</balancesCtx.Provider>
}

export const CurveProvider: FC = ({ children }) => {
  return (
    <CurveContractsProvider>
      <CurveBalancesProvider>{children}</CurveBalancesProvider>
    </CurveContractsProvider>
  )
}
