import React from 'react'
import styled from 'styled-components'
import { useModal } from 'react-modal-hook'

import { ViewportWidth } from '../../theme'
import { Modal } from './Modal'
import { Balances } from '../wallet/Balances'
import { useConnected, useReset, useWallet, useWalletAddress } from '../../context/AccountProvider'
import { Address } from './Address'
import { Button } from './Button'
import { useExploreAssetModal } from './useExploreAssetModal'

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.red};
`

const AddressGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  > div {
    > a {
      ${({ theme }) => theme.mixins.numeric}
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      border: 1px solid ${({ theme }) => theme.color.defaultBorder};
      color: ${({ theme }) => theme.color.body};
    }
    a:hover {
      color: ${({ theme }) => theme.color.bodyAccent};
    }
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.body};
  padding: 0 1rem;

  > div:first-child {
    border-bottom: 1px ${({ theme }) => theme.color.defaultBorder} solid;
    padding: 1rem 1rem 2rem 1rem;
    margin-bottom: 1rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1rem 1rem 1.5rem;
    > *:not(:last-child) {
      margin-bottom: 0;
    }
  }
`
export const useAccountModal = (): [() => void, () => void] => {
  const address = useWalletAddress()
  const connected = useConnected()
  const wallet = useWallet()

  const [showExploreModal] = useExploreAssetModal()

  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    // "Modals are also functional components and can use react hooks themselves"
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const reset = useReset()

    const handleClick = (): void => {
      if (reset) {
        reset()
        hideModal()
      }
    }

    // Handled here to allow reuse of Balance w/o conflating modal & balance logic
    const handleRowClick = (symbol: string): void => {
      hideModal()
      showExploreModal(symbol)
    }

    return (
      <Modal title="Account" onExited={onExited} open={open} hideModal={hideModal}>
        {connected && address && wallet && (
          <Container>
            <div>
              <h3>Connected with {wallet.name as string}</h3>
              <AddressGroup>
                <Address address={address} type="account" copyable />
                <DisconnectButton type="button" onClick={handleClick}>
                  Disconnect
                </DisconnectButton>
              </AddressGroup>
            </div>
            <div>
              <Balances onRowClick={handleRowClick} />
            </div>
          </Container>
        )}
      </Modal>
    )
  })
  return [showModal, hideModal]
}
