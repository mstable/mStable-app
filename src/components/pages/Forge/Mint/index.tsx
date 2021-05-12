import React, { FC } from 'react'
import styled from 'styled-components'

import { useToggle } from 'react-use'
import { MintMasset } from './MintMasset'
import { MintExact } from './MintExact'
import { SwitchButton } from '../SwitchButton'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'

const Container = styled.div`
  ${({ theme }) => theme.mixins.card};
`

export const Mint: FC = () => {
  const massetState = useSelectedMassetState()
  const [isMintExact, setMintExact] = useToggle(false)

  return massetState ? (
    <Container>
      {isMintExact ? <MintExact /> : <MintMasset />}
      <SwitchButton onClick={setMintExact}>Switch to mint via {`${isMintExact ? 'single asset' : 'multiple assets'}`}</SwitchButton>
    </Container>
  ) : (
    <ThemedSkeleton height={420} />
  )
}
