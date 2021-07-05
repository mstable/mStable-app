import React, { FC, useLayoutEffect } from 'react'
import styled from 'styled-components'

import { ReactComponent as SaveIcon } from '../icons/circle/save.svg'
import { ReactComponent as MintIcon } from '../icons/circle/mint.svg'
import { ReactComponent as EarnIcon } from '../icons/circle/earn.svg'
import { ReactComponent as SwapIcon } from '../icons/circle/swap.svg'
import { ReactComponent as RedeemIcon } from '../icons/circle/redeem.svg'
import { ReactComponent as StatsIcon } from '../icons/circle/stats.svg'
import { ReactComponent as AccountIcon } from '../icons/circle/account.svg'
import { useBannerMessage } from '../../context/AppProvider'
import { BannerMessage } from '../layout/BannerMessage'
import { usePolygonModal } from '../core/usePolygonModal'
import { Networks, useNetwork } from '../../context/NetworkProvider'
import { LocalStorage } from '../../localStorage'
import { MassetDropdown } from '../core/MassetDropdown'
import { ViewportWidth } from '../../theme'

export enum PageAction {
  Save = 'Save',
  Mint = 'Mint',
  Earn = 'Earn',
  Swap = 'Swap',
  Redeem = 'Redeem',
  Stats = 'Stats',
  Account = 'Account',
  Pools = 'Pools',
}

interface Props {
  action: PageAction
  subtitle?: string
}

const ActionIcons: { [action: string]: JSX.Element } = {
  Save: <SaveIcon />,
  Mint: <MintIcon />,
  Earn: <EarnIcon />,
  Pools: <EarnIcon />,
  Swap: <SwapIcon />,
  Redeem: <RedeemIcon />,
  Stats: <StatsIcon />,
  Account: <AccountIcon />,
}

const StyledMasset = styled(MassetDropdown)`
  margin-left: 0.75rem;
`

const Icon = styled.div<{ inverted?: boolean }>`
  display: flex;
  margin-right: 0.5rem;

  img,
  svg {
    width: 2.5rem;
    height: 2.5rem;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  img + div {
    display: none;
  }
`

const Container = styled.div<{
  messageVisible?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;

  h2 {
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    padding: 0.25rem 0 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    padding: 3rem 0;
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`

export const PageHeader: FC<Props> = ({ children, action, subtitle }) => {
  const [bannerMessage] = useBannerMessage()
  const icon = ActionIcons[action]
  const showPolygonModal = usePolygonModal()
  const { protocolName } = useNetwork()

  useLayoutEffect(() => {
    if (protocolName === Networks.Polygon && !LocalStorage.get('polygonViewed')) {
      LocalStorage.set('polygonViewed', true)
      showPolygonModal()
    }
  }, [protocolName, showPolygonModal])

  return (
    <div>
      <Container>
        <Row>
          <Icon inverted>{icon}</Icon>
          <h2>{action}</h2>
          {protocolName !== Networks.Polygon && <StyledMasset />}
        </Row>
        {subtitle && <p>{subtitle}</p>}
        {children && <ChildrenRow>{children}</ChildrenRow>}
      </Container>
      {!!bannerMessage && <BannerMessage />}
    </div>
  )
}
