import type { FC } from 'react'
import React from 'react'
import styled from 'styled-components'

import { useSelectedMassetName } from '../../context/MassetProvider'
import { ExternalLink } from '../core/ExternalLink'
import { PageAction, PageHeader } from './PageHeader'

const Container = styled.div`
  > :last-child {
    text-align: center;
  }
`

export const EarnRedirect: FC = () => {
  const selectedMassetName = useSelectedMassetName()
  return (
    <Container>
      <PageHeader action={PageAction.Earn} subtitle="Ecosystem rewards with mStable" />
      <div>
        Visit the <ExternalLink href={`https://earn.mstable.org/#/${selectedMassetName}/earn`}>Earn App</ExternalLink> to access Earn
      </div>
    </Container>
  )
}
