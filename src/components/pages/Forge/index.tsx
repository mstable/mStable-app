import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { TabsV2 } from '../../core/TabsV2'
import { PageAction, PageHeader } from '../PageHeader'
import { Mint as MintPage } from './Mint'
import { Redeem as RedeemPage } from './Redeem'
import { Swap as SwapPage } from './Swap'

const tabs = {
  [PageAction.Mint]: {
    title: 'Mint',
    subtitle: 'Mint',
    component: <MintPage />,
  },
  [PageAction.Redeem]: {
    title: 'Redeem',
    subtitle: `Redeem to the underlying collateral`,
    component: <RedeemPage />,
  },
  [PageAction.Swap]: {
    title: 'Swap',
    subtitle: `Convert `,
    component: <SwapPage />,
  },
}

const RecolOverlay = styled.div`
  position: absolute;
  opacity: 0.75;
  background: ${({ theme }) => theme.color.background[0]};
  z-index: 2;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  * {
    cursor: not-allowed;
    pointer-events: none;
  }
`

const RecolMessage = styled.p`
  position: absolute;
  z-index: 5;
  left: 0;
  right: 0;

  background: ${({ theme }) => theme.color.background[0]};
  text-align: center;
  padding: 1rem;
`

const Tabs = styled(TabsV2)`
  display: flex;
  flex-direction: column;
  align-items: center;

  > div:last-child {
    max-width: 32rem;
    width: 100%;
  }
`

const Container = styled.div`
  > div:last-child {
    position: relative;
  }
`

export const Forge: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(PageAction.Mint as string)
  const { undergoingRecol } = useSelectedMassetState() ?? {}

  return (
    <Container>
      <PageHeader action={PageAction[activeTab as PageAction.Swap | PageAction.Mint | PageAction.Redeem]} />
      <div>
        {undergoingRecol && (
          <>
            <RecolOverlay />
            <RecolMessage>Currently undergoing recollateralisation</RecolMessage>
          </>
        )}
        <Tabs tabs={tabs} active={activeTab} onClick={setActiveTab} />
      </div>
    </Container>
  )
}
