import React, { ChangeEventHandler, FC, useCallback } from 'react'
import { useModal } from 'react-modal-hook'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import { Button, UnstyledButton } from '../components/core/Button'

import { Modal } from '../components/core/Modal'
import { useConnect } from '../context/AccountProvider'
import { LocalStorage } from '../localStorage'

const StyledButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  font-size: 1rem;

  > * {
    margin-right: 0.75rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 2.5rem;
  max-width: 32rem;

  p {
    line-height: 1.75rem;
  }

  > *:not(:last-child) {
    margin: 0.5rem;
  }

  button:last-child {
    margin: 1rem;
    height: 3rem;
  }
`

const TCAccept: FC<{ onClick: () => void }> = ({ onClick }) => {
  const [confirm, setConfirm] = useToggle(false)
  const connect = useConnect()

  const handleAccept = (): void => {
    connect()
    onClick()
    LocalStorage.set('tcsViewed', true)
  }

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => setConfirm(event.target.checked ?? false), [setConfirm])

  return (
    <Container>
      <p>
        Before connecting your account, please read and accept the&nbsp;
        <a href="https://docs.mstable.org/appendix/app-usage-terms-and-conditions" target="_blank" rel="noopener noreferrer">
          Terms and Conditions
        </a>
      </p>
      <StyledButton onClick={() => setConfirm()}>
        <input type="checkbox" name="tcs" checked={confirm} value="Terms & Conditions" onChange={handleChange} />I have read and accept
      </StyledButton>
      <Button highlighted={confirm} disabled={!confirm} onClick={handleAccept}>
        Proceed
      </Button>
    </Container>
  )
}

export const useTCModal = (): (() => void) => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    return (
      <Modal title="Terms & Conditions" onExited={onExited} open={open} hideModal={hideModal}>
        <TCAccept onClick={hideModal} />
      </Modal>
    )
  })
  return showModal
}
