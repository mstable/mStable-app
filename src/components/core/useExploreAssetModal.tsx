import React, { useCallback, useState } from 'react'
import { useModal } from 'react-modal-hook'

import { Modal } from './Modal'
import { ExploreAsset } from './ExploreAsset'

export const useExploreAssetModal = (): [(symbol: string) => void, () => void] => {
  const [symbol, setSymbol] = useState<string | undefined>(undefined)

  const [_showModal, hideModal] = useModal(
    ({ onExited, in: open }) => (
      <Modal title={symbol ?? 'Explore'} onExited={onExited} open={open} hideModal={hideModal}>
        <ExploreAsset symbol={symbol} onRowClick={hideModal} />
      </Modal>
    ),
    [symbol],
  )

  const showModal = useCallback(
    (_symbol: string) => {
      setSymbol(_symbol)
      _showModal()
    },
    [_showModal],
  )

  return [showModal, hideModal]
}
