import React, { Fragment, FC, useMemo } from 'react'
import styled from 'styled-components'

import { useDataState } from '../../context/DataProvider/DataProvider'
import { useTokenSubscription } from '../../context/TokensProvider'
import { ExplorerLink } from '../core/ExplorerLink'
import { CountUp } from '../core/CountUp'
import { TokenIcon as TokenIconBase } from '../icons/TokenIcon'
import { List, ListItem } from '../core/List'
import { MassetState } from '../../context/DataProvider/types'
import { ThemedSkeleton } from '../core/ThemedSkeleton'

const Symbol = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: auto;
  }
`

const Balance = styled(CountUp)`
  font-weight: bold;
  font-size: 1rem;
`

const TokenIcon = styled(TokenIconBase)<{ outline?: boolean }>`
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  ${({ outline }) => (outline ? `border: 1px white solid; border-radius: 100%` : '')}
`

const TokenBalance: FC<{ address: string }> = ({ address }) => {
  const token = useTokenSubscription(address)
  return token ? <Balance end={token.balance.simple} /> : <ThemedSkeleton />
}

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC = () => {
  const dataState = useDataState()

  const massetTokens = useMemo(
    () =>
      Object.values(dataState).map(({ token: masset, bAssets, savingsContracts: { v1, v2 } }: MassetState) => ({
        masset,
        bassets: Object.values(bAssets).map(b => b.token),
        savingsContractV1: v1
          ? {
              name: `${masset.symbol} Save v1`,
              symbol: masset.symbol,
              address: v1.address,
              decimals: masset.decimals,
              savingsBalance: v1.savingsBalance,
            }
          : undefined,
        savingsContractV2: v2 && v2.token ? v2.token : undefined,
      })),
    [dataState],
  )
  return (
    <List inverted>
      {massetTokens.map(({ masset, bassets, savingsContractV1, savingsContractV2 }) => (
        <Fragment key={masset.address}>
          <ListItem key={masset.address}>
            <Symbol>
              <TokenIcon symbol={masset.symbol} outline />
              <span>{masset.symbol}</span>
              <ExplorerLink data={masset.address} />
            </Symbol>
            <TokenBalance address={masset.address} />
          </ListItem>
          {savingsContractV1 && (
            <ListItem key={savingsContractV1.address}>
              <Symbol>
                <TokenIcon symbol={savingsContractV1.symbol} outline />
                <span>{savingsContractV1.name}</span>
              </Symbol>
              {savingsContractV1.savingsBalance.balance ? (
                <Balance end={savingsContractV1.savingsBalance.balance.simple} />
              ) : (
                <ThemedSkeleton />
              )}
            </ListItem>
          )}
          {savingsContractV2 && (
            <ListItem key={savingsContractV2.address}>
              <Symbol>
                <TokenIcon symbol={savingsContractV2.symbol} outline />
                <span>{savingsContractV2.symbol}</span>
              </Symbol>
              {savingsContractV2.balance ? <Balance end={savingsContractV2.balance.simple} /> : <ThemedSkeleton />}
            </ListItem>
          )}
          {bassets.map(({ address, symbol }) => (
            <ListItem key={address}>
              <Symbol>
                <TokenIcon symbol={symbol} />
                <span>{symbol}</span>
                <ExplorerLink data={address} />
              </Symbol>
              <TokenBalance address={address} />
            </ListItem>
          ))}
        </Fragment>
      ))}
    </List>
  )
}
