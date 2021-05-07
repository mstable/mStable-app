import React, { FC } from 'react'
import styled from 'styled-components'

import { useHistory } from 'react-router-dom'
import { ViewportWidth } from '../../theme'
import { Table, TableCell, TableRow } from './Table'
import { Button } from './Button'
import { SendAsset } from './SendAsset'

const Header = styled.div`
  padding: 0 1rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }

  p {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.875rem;
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.body};
  padding: 0 1rem;

  > *:last-child {
    margin-top: 1rem;
  }

  td {
    height: 5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1.5rem 1rem 1.5rem;
    > *:not(:last-child) {
      margin-bottom: 0;
    }
  }
`

const getAssetUse = (symbol: string): { title: string; subtitle: string; href?: string }[] => {
  switch (symbol) {
    case 'mUSD Save v1':
      return [
        {
          title: `Migrate`,
          subtitle: 'Migrate your Save balance',
          href: `/musd/save`,
        },
      ]
    case 'mBTC':
      return [
        {
          title: `Save (imBTC)`,
          subtitle: 'Earn a native interest rate',
          href: `/mbtc/save`,
        },
        {
          title: 'Pools',
          subtitle: 'Earn MTA rewards',
          href: `/mbtc/pools`,
        },
      ]
    case 'mUSD':
      return [
        {
          title: `Save (imUSD)`,
          subtitle: 'Earn a native interest rate',
          href: `/musd/save`,
        },
        {
          title: 'Pools',
          subtitle: 'Earn MTA rewards',
          href: `/musd/pools`,
        },
        {
          title: 'Rari Capital',
          subtitle: 'Earn interest on your mUSD',
          href: 'https://app.rari.capital/',
        },
      ]
    case 'imUSD':
      return [
        {
          title: 'Save Vault (imUSD Vault)',
          subtitle: 'Earn MTA rewards',
          href: `/musd/save`,
        },
      ]
    case 'imBTC':
      return [
        {
          title: 'Save Vault (imBTC Vault)',
          subtitle: 'Earn MTA rewards',
          href: `/mbtc/save`,
        },
      ]
    case 'MTA':
      return [
        {
          title: 'mStable Governance',
          subtitle: 'Lock up MTA to vote in governance',
          href: 'https://governance.mstable.org',
        },
        {
          title: 'Cream Finance',
          subtitle: 'Use as collateral for loans',
          href: 'https://app.cream.finance/',
        },
        {
          title: 'Unit Protocol',
          subtitle: 'Use as collateral for loans',
          href: 'https://unit.xyz/',
        },
      ]
    case 'DAI':
    case 'USDC':
    case 'USDT':
    case 'sUSD':
      return [
        {
          title: `Save (imUSD)`,
          subtitle: 'Earn a native interest rate',
          href: `/musd/save`,
        },
      ]
    case 'renBTC':
    case 'WBTC':
    case 'sBTC':
      return [
        {
          title: `Save (imBTC)`,
          subtitle: 'Earn a native interest rate',
          href: `/mbtc/save`,
        },
      ]
    default:
      return []
  }
}

export const ExploreAsset: FC<{ symbol?: string; onRowClick?: () => void }> = ({ symbol, onRowClick }) => {
  const assetUses = getAssetUse(symbol ?? '')
  const history = useHistory()

  const handleOnClick = (href?: string): void => {
    if (!href) return
    if (href.includes('http')) {
      window.open(href, '_blank')
    } else {
      history.push(href)
      onRowClick?.()
    }
  }

  return (
    <Container>
      <Header>
        <h3>Send</h3>
      </Header>
      {symbol && <SendAsset symbol={symbol} />}
      <Header>
        <h3>Explore</h3>
        <p>Explore options to deposit your idle {symbol}</p>
      </Header>
      {!!assetUses?.length && (
        <Table>
          {assetUses.map(({ title, subtitle, href }) => (
            <TableRow key={title} buttonTitle="View" onClick={(href && (() => handleOnClick(href))) || undefined}>
              <TableCell width={75}>
                <h3>{title}</h3>
                <span>{subtitle}</span>
              </TableCell>
              <TableCell>
                <Button onClick={() => {}}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </Container>
  )
}
