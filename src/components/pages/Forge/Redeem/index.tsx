import React, { FC } from 'react'
import styled from 'styled-components'

import { useToggle } from 'react-use'
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'
import { RedeemExactBassets } from './RedeemExactBassets'
import { RedeemMasset } from './RedeemMasset'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import { SwitchButton } from '../SwitchButton'

const Container = styled.div`
  ${({ theme }) => theme.mixins.card};
`

export const Redeem: FC = () => {
  const massetState = useSelectedMassetState()
  const [isRedeemExact, setRedeemExact] = useToggle(false)

  return massetState ? (
    <Container>
      {isRedeemExact ? <RedeemExactBassets /> : <RedeemMasset />}
      <SwitchButton onClick={setRedeemExact}>Switch to {`${isRedeemExact ? 'single-asset' : 'multi-asset'} redemption`}</SwitchButton>
    </Container>
  ) : (
    <ThemedSkeleton height={480} />
  )
}
