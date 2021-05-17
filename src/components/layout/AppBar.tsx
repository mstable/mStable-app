import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { useTransactionsState } from '../../context/TransactionsProvider'
import { ReactComponent as LogoSvg } from '../icons/mstable-small.svg'
import { UnstyledButton } from '../core/Button'
import { ActivitySpinner } from '../core/ActivitySpinner'
import { TransactionStatus } from '../../web3/TransactionManifest'
import { Navigation } from './Navigation'
import { SettingsButton } from './SettingsButton'
import { WalletButton } from './WalletButton'
import { TokenIcon } from '../icons/TokenIcon'
import { useNetwork } from '../../context/NetworkProvider'
import { ViewportWidth } from '../../theme'

const NetworkButton = styled(SettingsButton)`
  display: none;

  @media (min-width: ${ViewportWidth.m}) {
    display: inherit;
  }
`

const Logo = styled(LogoSvg)`
  width: 1.75rem;
  height: 1.75rem;
  padding-top: 2px;
`

const LogoAndMasset = styled.div<{ inverted?: boolean }>`
  display: flex;
  align-items: center;

  a {
    border-bottom: 0;
  }

  ${Logo} {
    path,
    rect {
      fill: ${({ theme, inverted }) => (inverted ? theme.color.white : theme.color.body)};
    }
  }
`

const AccountButton = styled(UnstyledButton)`
  align-items: center;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  font-weight: 600;
  height: 2rem;
  justify-content: space-between;
  line-height: 100%;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.color.background[1]};

  > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  &:hover {
    background: ${({ theme }) => theme.color.background[3]};
  }
`

const Inner = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;

  > div {
    flex-basis: 33.33%;
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  height: 56px;
  display: flex;
  justify-content: center;
  padding-top: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.color.defaultBorder};

  ${AccountButton} {
    color: ${({ theme }) => theme.color.body};
  }
`

const WalletAndSpinner = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`

const TransactionsSpinner: FC = () => {
  const transactions = useTransactionsState()

  const pending = useMemo(
    () => Object.values(transactions).some(tx => tx.status === TransactionStatus.Response || tx.status === TransactionStatus.Sent),
    [transactions],
  )

  return <ActivitySpinner pending={pending} />
}

export const AppBar: FC = () => {
  const { protocolName } = useNetwork()
  return (
    <Container>
      <Inner>
        <LogoAndMasset>
          <Link to="/" title="Home">
            <Logo />
          </Link>
        </LogoAndMasset>
        <Navigation />
        <WalletAndSpinner>
          <TransactionsSpinner />
          <WalletButton />
          <NetworkButton>
            <TokenIcon symbol={protocolName.toUpperCase()} hideNetwork />
          </NetworkButton>
          <SettingsButton />
        </WalletAndSpinner>
      </Inner>
    </Container>
  )
}
