import React, { FC } from 'react'
import styled from 'styled-components'

import { useIsMasquerading } from '../../../../context/AccountProvider'
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider'

import { Card } from '../Card'
import { ButtonLink } from '../../../core/Button'
import { PoolForms } from './PoolForms'
import { PoolBalances } from './PoolBalances'
import { ImpermanentLossWarning } from './ImpermanentLossWarning'

const BackLink = styled(ButtonLink)`
  display: inline-block;
  margin-bottom: 16px;
`

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Content = styled.div`
  padding: 32px 0;
`

const Container = styled.div`
  width: 100%;
`

const StyledCard = styled(Card)`
  width: 100%;
  min-height: 300px;
`

export const PoolContent: FC<{ address: string }> = ({ address }) => {
  const isMasquerading = useIsMasquerading()
  const massetName = useSelectedMassetName()
  return (
    <Container>
      <BackLink to={`/${massetName}/earn`}>Back</BackLink>
      <CardContainer>
        <StyledCard address={address} />
      </CardContainer>
      <Content>
        <PoolBalances />
        {isMasquerading ? null : (
          <>
            <ImpermanentLossWarning />
            <PoolForms address={address} />
          </>
        )}
      </Content>
    </Container>
  )
}
