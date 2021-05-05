import React from 'react'
import styled from 'styled-components'
import { useModal } from 'react-modal-hook'

import { ViewportWidth } from '../../theme'
import { Modal } from './Modal'
import { Balances } from '../wallet/Balances'
import { useConnected, useReset, useWallet, useWalletAddress } from '../../context/AccountProvider'
import { Address } from './Address'
import { Button } from './Button'

const Rows = styled.div`
  width: 100%;
  padding: 1rem 0;

  > div:first-child {
    border-bottom: 1px ${({ theme }) => theme.color.defaultBorder} solid;
    padding: 0 1rem 2rem 1rem;
    margin-bottom: 1rem;
  }
`

const Row = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 600;
  }
`

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

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1rem;
    > div > div > *:not(:last-child) {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
`
export const useAccountModal = (): [() => void, () => void] => {
  const address = useWalletAddress()
  const connected = useConnected()
  const wallet = useWallet()

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

    return (
      <Modal title="Account" onExited={onExited} open={open} hideModal={hideModal}>
        <Container>
          <div>
            <div>
              {connected && address && wallet && (
                <Rows>
                  <Row>
                    <h3>Connected with {wallet.name as string}</h3>
                    <AddressGroup>
                      <Address address={address} type="account" copyable />
                      <DisconnectButton type="button" onClick={handleClick}>
                        Disconnect
                      </DisconnectButton>
                    </AddressGroup>
                  </Row>
                  <Row>
                    <Balances />
                  </Row>
                </Rows>
              )}
            </div>
          </div>
        </Container>
      </Modal>
    )
  })
  return [showModal, hideModal]
}
