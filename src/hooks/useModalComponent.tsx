import React, { ReactElement } from 'react'
import { useModal } from 'react-modal-hook'

import { Modal } from '../components/core/Modal'

export const useModalComponent = ({
  title,
  children,
}: {
  title: ReactElement | string
  children: ReactElement
}): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    return (
      <Modal title={title} onExited={onExited} open={open} hideModal={hideModal}>
        {children}
      </Modal>
    )
  })
  return [showModal, hideModal]
}
