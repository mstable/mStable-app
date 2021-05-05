import React, { Fragment, FC, useMemo } from 'react'
import styled from 'styled-components'

import { useDataState } from '../../context/DataProvider/DataProvider'
import { useTokenSubscription } from '../../context/TokensProvider'
import { ExplorerLink } from '../core/ExplorerLink'
import { CountUp } from '../core/CountUp'
import { TokenIcon as TokenIconBase } from '../icons/TokenIcon'
import { MassetState } from '../../context/DataProvider/types'
import { ThemedSkeleton } from '../core/ThemedSkeleton'
import { Table, TableCell, TableRow } from '../core/Table'

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

const StyledTable = styled(Table)`
  > tbody {
    height: 16rem;
    overflow-y: scroll;
  }
`

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
    <StyledTable headerTitles={['Asset', 'Balance']}>
      {massetTokens.map(({ masset, bassets, savingsContractV1, savingsContractV2 }) => (
        <Fragment key={masset.address}>
          <TableRow key={masset.address}>
            <TableCell>
              <Symbol>
                <TokenIcon symbol={masset.symbol} outline />
                <span>{masset.symbol}</span>
                <ExplorerLink data={masset.address} />
              </Symbol>
            </TableCell>
            <TableCell>
              <TokenBalance address={masset.address} />
            </TableCell>
          </TableRow>
          {savingsContractV1 && (
            <TableRow key={savingsContractV1.address}>
              <TableCell>
                <Symbol>
                  <TokenIcon symbol={savingsContractV1.symbol} outline />
                  <span>{savingsContractV1.name}</span>
                </Symbol>
              </TableCell>
              <TableCell>
                {savingsContractV1.savingsBalance.balance ? (
                  <Balance end={savingsContractV1.savingsBalance.balance.simple} />
                ) : (
                  <ThemedSkeleton />
                )}
              </TableCell>
            </TableRow>
          )}
          {savingsContractV2 && (
            <TableRow key={savingsContractV2.address}>
              <TableCell>
                <Symbol>
                  <TokenIcon symbol={savingsContractV2.symbol} outline />
                  <span>{savingsContractV2.symbol}</span>
                </Symbol>
              </TableCell>
              <TableCell>{savingsContractV2.balance ? <Balance end={savingsContractV2.balance.simple} /> : <ThemedSkeleton />}</TableCell>
            </TableRow>
          )}
          {bassets.map(({ address, symbol }) => (
            <TableRow key={address}>
              <TableCell>
                <Symbol>
                  <TokenIcon symbol={symbol} />
                  <span>{symbol}</span>
                  <ExplorerLink data={address} />
                </Symbol>
              </TableCell>
              <TableCell>
                <TokenBalance address={address} />
              </TableCell>
            </TableRow>
          ))}
        </Fragment>
      ))}
    </StyledTable>
  )
}
