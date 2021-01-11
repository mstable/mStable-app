import React, { ReactElement } from 'react';
import { useModal } from 'react-modal-hook';

import { Modal } from '../components/core/Modal';

export const useModalComponent = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => (
    <Modal title={title} onExited={onExited} open={open} hideModal={hideModal}>
      {children}
    </Modal>
  ));
  return [showModal, hideModal];
};
