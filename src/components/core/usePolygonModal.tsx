import styled from 'styled-components'
import React, { useMemo } from 'react'
import { useModal } from 'react-modal-hook'

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider'
import { LocalStorage } from '../../localStorage'
import { ViewportWidth } from '../../theme'
import { TokenIcon } from '../icons/TokenIcon'
import { Arrow } from './Arrow'
import { Tooltip } from './ReactTooltip'
import { Modal } from './Modal'
import { Button } from './Button'
import { ExternalLink } from './ExternalLink'

const StyledTokenIcon = styled(TokenIcon)`
  width: 3rem;
`

const CompleteButton = styled(Button)`
  width: 100%;
  margin-top: 2rem;
  height: 3rem;
`

const TokenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > *:not(:last-child) {
    margin-bottom: 0.25rem;
  }

  > *:first-child {
    margin-bottom: 0.75rem;
  }
`

const Container = styled.div`
  background: ${({ theme }) => (theme.isLight ? 'rgba(255, 253, 245, 0.3)' : 'none')};
  color: ${({ theme }) => theme.color.offYellow};
  text-align: center;
  position: relative;
  padding: 1rem;

  b {
    font-weight: 600;
  }

  > div {
    h4 {
      font-weight: 600;
      margin: 0.5rem 0;
      span {
        font-weight: normal;
        margin-right: 0.25rem;
        font-size: 0.9rem;
      }
    }

    > div {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255, 179, 52, 0.1);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: flex-start;
      font-weight: 600;
      border-radius: 1rem;

      p {
        font-weight: normal;
        font-size: 0.9rem;
        span {
          font-weight: 600;
        }
      }

      > *:not(:last-child) {
        margin-bottom: 1rem;
      }
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1rem 2rem;
    > div > div > *:not(:last-child) {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
`
export const usePolygonModal = (): (() => void) => {
  const massetState = useSelectedMassetState()

  const inputAssets = useMemo<string[]>(() => Object.values(massetState?.bAssets ?? {}).map(b => b.token.symbol.replace(/^POS-/i, '')), [
    massetState,
  ])
  const saveTokenSymbol = massetState?.savingsContracts.v2.token?.symbol?.replace(/^POS-/i, '')

  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    return (
      <Modal title="Getting Started on Polygon" onExited={onExited} open={open} hideModal={hideModal}>
        <Container>
          <div>
            <h4>
              <span>1</span> Migrate USDC, DAI or USDT from Ethereum
            </h4>
            <p>
              Use either&nbsp;
              <ExternalLink href="https://wallet.matic.network/bridge">Matic</ExternalLink> or{' '}
              <ExternalLink href="https://zapper.fi/bridge">Zapper</ExternalLink> to migrate your assets
            </p>
            &nbsp;
            <p>
              <b>Do not migrate your mUSD, this will not work</b>
            </p>
            <div>
              {inputAssets.map(symbol => (
                <Tooltip tip={symbol} key={symbol} hideIcon>
                  <StyledTokenIcon symbol={symbol} />
                </Tooltip>
              ))}
            </div>
          </div>
          <Arrow />
          <div>
            <h4>
              <span>2</span> Deposit your asset and receive {saveTokenSymbol}
            </h4>
            <p>This is swapped for {saveTokenSymbol}. You can swap back at any time.</p>
            <div>
              <TokenContainer>
                <StyledTokenIcon symbol={saveTokenSymbol} />
                <div>{saveTokenSymbol}</div>
                <p>Transferable token, earns interest</p>
              </TokenContainer>
            </div>
          </div>
          <Arrow />
          <div>
            <h4>
              <span>3</span> Earn interest on your deposit
            </h4>
            <p>
              Over time, your {saveTokenSymbol} can be exchanged for more {massetState?.token.symbol}.
            </p>
          </div>
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
