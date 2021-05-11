import React from 'react'
import styled from 'styled-components'
import { useModal } from 'react-modal-hook'

import { LocalStorage } from '../../localStorage'
import { ViewportWidth } from '../../theme'
import { TokenIcon } from '../icons/TokenIcon'
import { Arrow } from './Arrow'
import { Tooltip } from './ReactTooltip'
import { Modal } from './Modal'
import { Button } from './Button'
import { ExternalLink } from './ExternalLink'

const LargeTokenIcon = styled(TokenIcon)`
  img:first-child {
    width: 5rem !important;
  }
  img:last-child {
    width: 1.5rem !important;
    height: 1.5rem !important;
  }
`

const RegularTokenIcon = styled(TokenIcon)`
  width: 3rem;
`

const CompleteButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
  height: 3.5rem;
`

const MassetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;

    &::before {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: radial-gradient(50% 50% at 50% 50%, rgba(64, 129, 255, 0.5) 0%, rgba(196, 196, 196, 0) 100%);
      filter: blur(30px);
      content: '';
      position: absolute;
    }
  }
`

const AssetContainer = styled.div`
  > div {
    padding: 1rem;
    background: ${({ theme }) => theme.color.background[2]};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-start;
    font-weight: 600;
    border-radius: 1rem;
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  text-align: center;
  position: relative;
  padding: 1rem;

  b {
    font-weight: 600;
  }

  p {
    font-weight: normal;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};

    span {
      font-weight: 600;
    }
  }

  h4 {
    margin: 0.5rem 0 0.75rem;
    font-size: 1.125rem;
    span {
      font-weight: normal;
      margin-right: 0.25rem;
      font-size: 0.9rem;
    }
    b {
      font-weight: 600;
    }
  }

  > *:not(:last-child):not(:first-child) {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1rem 2rem;
    > div > div > *:not(:last-child) {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
`
export const usePolygonModal = (): (() => void) => {
  const inputAssets = ['USDT', 'DAI', 'USDC']

  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    return (
      <Modal title="Getting Started on Polygon" onExited={onExited} open={open} hideModal={hideModal}>
        <Container>
          <AssetContainer>
            <h4>
              Deposit to mStable using <b>USDC</b>, <b>DAI</b> or <b>USDT</b>
            </h4>
            <p>
              Use&nbsp;
              <ExternalLink href="https://wallet.matic.network/bridge">Matic</ExternalLink> or{' '}
              <ExternalLink href="https://zapper.fi/bridge">Zapper</ExternalLink> to migrate the above assets
            </p>
            &nbsp;
            <div>
              {inputAssets.map(symbol => (
                <Tooltip tip={symbol} key={symbol} hideIcon>
                  <RegularTokenIcon symbol={symbol} />
                </Tooltip>
              ))}
            </div>
          </AssetContainer>
          <Arrow />
          <MassetContainer>
            <h4>
              Receive <b>mUSD</b> and use across Polygon
            </h4>
            <p>mUSD is redeemable for USDC, DAI or USDT at any time</p>
            &nbsp;
            <div>
              <Tooltip tip="mUSD" hideIcon>
                <LargeTokenIcon symbol="mUSD" />
              </Tooltip>
            </div>
          </MassetContainer>
          <CompleteButton
            highlighted
            onClick={() => {
              LocalStorage.set('polygonViewed', true)
              hideModal()
            }}
          >
            Got it
          </CompleteButton>
        </Container>
      </Modal>
    )
  })
  return showModal
}
