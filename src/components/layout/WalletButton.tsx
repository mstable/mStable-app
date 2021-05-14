import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { getNetwork, useChainIdCtx } from '../../context/NetworkProvider'
import { useConnect, useWalletAddress, useConnected, useInjectedChainIdCtx } from '../../context/AccountProvider'

import { ViewportWidth } from '../../theme'
import { UnstyledButton } from '../core/Button'
import { truncateAddress } from '../../utils/strings'
import { Idle } from '../icons/Idle'
import { LocalStorage } from '../../localStorage'
import { useTCModal } from '../../hooks/useTCModal'
import { useAccountModal } from '../core/useAccountModal'
import { UserIcon } from '../core/UserIcon'

const ConnectText = styled.span`
  padding: 0 0.5rem;
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

const TruncatedAddress = styled.span`
  display: none;
  font-weight: normal;
  font-size: 0.875rem;
  padding: 0 0.25rem;

  @media (min-width: ${ViewportWidth.m}) {
    font-family: 'DM Mono', monospace;
    text-transform: none;
    display: inherit;
  }
`

const WrongNetwork = styled.div`
  color: red;
  > :first-child {
    margin-bottom: 0.25rem;
  }
  > :last-child {
    font-weight: normal;
  }
`

const Container = styled(AccountButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const WalletButton: FC = () => {
  const connected = useConnected()
  const account = useWalletAddress()
  const [injectedChainId] = useInjectedChainIdCtx()
  const [chainId] = useChainIdCtx()
  const injectedNetwork = useMemo(() => (injectedChainId ? getNetwork(injectedChainId) : undefined), [injectedChainId])
  const [showAccountModal] = useAccountModal()

  const connect = useConnect()
  const showTCModal = useTCModal()

  const viewedTerms = LocalStorage.get('tcsViewed')

  const handleClick = (): void => {
    if (connected && account) {
      return showAccountModal()
    }
    if (!viewedTerms) {
      return showTCModal()
    }
    connect()
  }

  return (
    <Container title="Account" onClick={handleClick}>
      {injectedChainId && chainId !== injectedChainId ? (
        <>
          <div>
            <UserIcon />
          </div>
          <WrongNetwork>
            <div>
              <span role="img" aria-label="Warning">
                ⚠️
              </span>{' '}
              Wrong network
            </div>
            <div>{injectedNetwork ? `${injectedNetwork.protocolName} (${injectedNetwork.chainName})` : `Chain ID ${injectedChainId}`}</div>
          </WrongNetwork>
        </>
      ) : connected ? (
        <>
          <TruncatedAddress>{account && truncateAddress(account)}</TruncatedAddress>
          <Idle>
            <UserIcon />
          </Idle>
        </>
      ) : (
        <ConnectText>Connect</ConnectText>
      )}
    </Container>
  )
}
