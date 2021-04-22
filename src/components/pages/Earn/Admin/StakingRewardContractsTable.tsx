import React, { FC, useEffect, useMemo, useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ERC20__factory } from '@mstable/protocol/types/generated'
import type { ERC20 } from '@mstable/protocol/types/generated'

import { useStakingRewardsContracts } from '../../../../context/earn/EarnDataProvider'
import { PLATFORM_METADATA } from '../constants'
import { NumberFormat } from '../../../core/Amount'
import { TokenAmount } from '../../../core/TokenAmount'
import { Table } from '../../../core/Table'
import { AmountInput } from '../../../forms/AmountInput'
import { BigDecimal } from '../../../../web3/BigDecimal'
import { useEarnAdminDispatch, useEarnAdminState } from './EarnAdminProvider'
import { StakingRewardsContract } from '../../../../context/earn/types'
import { Token } from '../../../../types'
import { useSigner } from '../../../../context/AccountProvider'

enum Columns {
  StakingToken,
  Collateral,
  RemainingRewards,
  Airdrops,
  Period,
  AmountToFund,
}

const COLUMNS = [
  {
    key: Columns.StakingToken,
    title: 'Staking token',
  },
  {
    key: Columns.Collateral,
    title: 'Collateral',
  },
  {
    key: Columns.RemainingRewards,
    title: 'Remaining rewards',
  },
  {
    key: Columns.Airdrops,
    title: 'Airdrops',
  },
  {
    key: Columns.Period,
    title: 'Period',
  },
  {
    key: Columns.AmountToFund,
    title: 'Amount to fund',
  },
]

export const StakingRewardContractsTable: FC<{}> = () => {
  const signer = useSigner()
  const stakingRewardsContracts = useStakingRewardsContracts()
  const { setRecipientAmount } = useEarnAdminDispatch()
  const { recipientAmounts } = useEarnAdminState()

  const [airdropBalances, setAirdropBalances] = useState<{
    [address: string]: BigDecimal | undefined
  }>({})

  const airdroppableContracts = useMemo<{ address: string; contract?: ERC20; platformToken: Token }[]>(
    () =>
      Object.values(stakingRewardsContracts)
        .filter(item => item.platformRewards)
        .map(item => ({
          address: item.address,
          contract: signer ? ERC20__factory.connect(item.platformRewards?.platformToken.address as string, signer) : undefined,
          platformToken: (item.platformRewards as NonNullable<StakingRewardsContract['platformRewards']>).platformToken,
        })),
    [stakingRewardsContracts, signer],
  )

  useEffect(() => {
    Promise.all(
      airdroppableContracts.map(async ({ address, contract, platformToken }) => {
        const balance = await contract?.balanceOf(address)
        return {
          [address]: balance ? new BigDecimal(balance, platformToken.decimals) : undefined,
        }
      }),
    ).then(balances => {
      setAirdropBalances(
        balances.reduce(
          (_balances, balance) => ({
            ..._balances,
            ...balance,
          }),
          {},
        ),
      )
    })
  }, [airdroppableContracts, setAirdropBalances])

  const items = useMemo(
    () =>
      Object.values(stakingRewardsContracts)
        .filter(stakingRewardsContract => !stakingRewardsContract.expired)
        .map(stakingRewardsContract => {
          const { address: id, platformRewards, totalRemainingRewards, rewardsToken, pool, periodFinish } = stakingRewardsContract
          const { colors, getPlatformLink } = PLATFORM_METADATA[pool.platform]

          const periodFinishTime = periodFinish * 1e3

          return COLUMNS.reduce(
            (_item, { key }) => {
              const value = (() => {
                switch (key) {
                  case Columns.Airdrops: {
                    return (
                      <div>
                        {airdropBalances[id] && platformRewards ? (
                          <TokenAmount
                            symbol={platformRewards.platformToken.symbol}
                            format={NumberFormat.Abbreviated}
                            amount={airdropBalances[id]}
                          />
                        ) : (
                          '-'
                        )}
                      </div>
                    )
                  }
                  case Columns.Period: {
                    return <div>{`Period ends in ${formatDistanceToNow(periodFinishTime)}`}</div>
                  }
                  case Columns.AmountToFund: {
                    return (
                      <div>
                        <AmountInput value={recipientAmounts[id]?.formValue} onChange={formValue => setRecipientAmount(id, formValue)} />
                      </div>
                    )
                  }
                  case Columns.Collateral:
                    return (
                      <>
                        {pool.tokens.map(({ address, symbol, liquidity, price }) => (
                          <TokenAmount key={address} symbol={symbol} format={NumberFormat.Abbreviated} amount={liquidity} price={price} />
                        ))}
                      </>
                    )
                  case Columns.StakingToken:
                    return (
                      <TokenAmount
                        href={getPlatformLink(stakingRewardsContract)}
                        symbol={stakingRewardsContract.stakingToken.symbol}
                        format={NumberFormat.Abbreviated}
                        price={stakingRewardsContract.stakingToken.price}
                        address={stakingRewardsContract.address}
                      />
                    )
                  case Columns.RemainingRewards:
                    return (
                      <>
                        <TokenAmount amount={totalRemainingRewards} format={NumberFormat.Abbreviated} symbol={rewardsToken.symbol} />
                        {platformRewards ? (
                          <TokenAmount
                            amount={platformRewards.totalRemainingPlatformRewards}
                            format={NumberFormat.Abbreviated}
                            symbol={platformRewards.platformToken.symbol}
                          />
                        ) : null}
                      </>
                    )
                  default:
                    throw new Error('Unhandled key')
                }
              })()
              return { ..._item, data: { ..._item.data, [key]: value } }
            },
            { id, colors, data: {} },
          )
        }),
    [recipientAmounts, setRecipientAmount, stakingRewardsContracts, airdropBalances],
  )

  return <Table columns={COLUMNS} items={items} />
}
