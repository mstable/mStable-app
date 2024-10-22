import React, { FC, useLayoutEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import { useLocation } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import { ModalProvider } from 'react-modal-hook'
import { usePrevious } from 'react-use'

import { useChainIdCtx, useNetwork } from '../../context/NetworkProvider'
import { useSelectedMassetConfig } from '../../context/MassetProvider'
import { useSelectedMassetState } from '../../context/DataProvider/DataProvider'

import { ReactTooltip, Tooltip } from '../core/ReactTooltip'
import { Footer } from './Footer'
import { BannerMessage, useBannerMessage } from '../../context/AppProvider'
import { Background } from './Background'
import { AppBar } from './AppBar'
import { Toasts } from './Toasts'
import { Color, ViewportWidth } from '../../theme'
import { MessageHandler } from './MessageHandler'

const Main = styled.main<{ marginTop?: boolean }>`
  margin-top: ${({ marginTop }) => marginTop && `2rem`};
  padding: 0 1rem;
  min-height: 50vh;

  @media (min-width: ${ViewportWidth.s}) {
    padding: 0 1rem;
  }
`

const GlobalStyle = createGlobalStyle`
  ${reset}
  a {
    color: ${({ theme }) => theme.color.primary};
    text-decoration: none;
    transition: color 0.4s ease;
    &:hover {
      color: ${Color.gold};
    }
  }
  b {
    font-weight: 600;
  }
  html {
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  body {
    min-width: 320px;
  }
  code {
    display: block;
    padding: 16px;
    border-radius: 2px;
    border: 1px ${Color.blackTransparent} solid;
    background: ${Color.white};
    ${({ theme }) => theme.mixins.numeric}
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme }) => theme.color.body};
    line-height: 1.3rem;
  }
  
  // Onboard.js
  aside.bn-onboard-custom {
     z-index: 5 !important;
     width: 100% !important;
     height: 100% !important;
     
     .bn-onboard-modal-content-close:hover {
      background: none;
      opacity: 0.75;
     }
     
     button:hover {
      background: ${({ theme }) => theme.color.onboardItemHover};
     }
     
    .bn-onboard-modal-content {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
      width: inherit;
      max-width: inherit;
      box-sizing: border-box;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      transition: all ease-in;
      background: ${({ theme }) => theme.color.onboardBackground};
    }
    .bn-onboard-modal-content-header {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.body};
      justify-content: center;
    }
    h3 {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.body};
      font-weight: 600;
      font-size: 1.125rem;
    }
    .bn-onboard-modal-content-header-icon,
    .bn-onboard-select-description {
      display: none;
    }
    .bn-onboard-icon-button {
      font-weight: normal;
      padding: 0.5rem 1rem;
      width: 100%;
      border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
      border-radius: 0.5rem;
      > :first-child {
        min-width: 32px;
      }
      > span {
        font-weight: 500;
        font-size: 1rem;
        color: ${({ theme }) => theme.color.body};
      }
      &:hover {
        box-shadow: none;
      }
    }
    .bn-onboard-modal-content-close {
      top: 1.5rem;
    }
    .bn-onboard-modal-select-wallets li {
      width: 50%;
    }
    .bn-onboard-modal-select-wallets {
      .bn-onboard-prepare-button { 
        color: 1px solid ${({ theme }) => theme.color.body} !important;
        border: 1px ${Color.blackTransparent} solid !important;
      }
    }
    .bn-onboard-select-info-container  {
      justify-content: center !important;
      
      .bn-onboard-prepare-button { 
        display: none;
      }
      
      span {
        text-align: center;
        color: ${({ theme }) => theme.color.bodyAccent};
        font-size: 0.875rem !important;
        margin: 0 !important;
      }
    }
    .bn-onboard-modal-selected-wallet {
      > *:not(:last-child) {
        margin-bottom: 0.75rem;
      }
    }
    
    
    @media (min-width: ${ViewportWidth.s}) {
      .bn-onboard-modal-content {
        position: relative;
        max-width: 28rem;
        border-radius: 1rem;
      }
    }
  }
  
`

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 3;
`

const HeaderGroup: FC = () => (
  <>
    <StickyHeader>
      <AppBar />
    </StickyHeader>
  </>
)

const Container = styled.div`
  display: grid;
  overflow-x: hidden;
  min-height: calc(100vh - 182px);

  // Space for the footer
  padding-bottom: 4rem;

  grid-template-columns:
    1fr
    min(1000px, 100%)
    1fr;

  > * {
    grid-column: 2;
  }
`

export const Layout: FC = ({ children }) => {
  const { pathname } = useLocation()
  const home = pathname === '/'
  const [chainId] = useChainIdCtx()
  const prevChainId = usePrevious(chainId)

  // Message
  const [bannerMessage, setBannerMessage] = useBannerMessage()
  const massetConfig = useSelectedMassetConfig()
  const { protocolName } = useNetwork()
  const { undergoingRecol } = useSelectedMassetState() ?? {}

  // Handle message prioritisation:
  useLayoutEffect(() => {
    let message: BannerMessage | undefined

    if (undergoingRecol) {
      message = (undergoingRecol && MessageHandler.recollat(massetConfig)) || undefined
    }

    if (bannerMessage?.title !== message?.title) {
      setBannerMessage(message)
    }
  }, [bannerMessage, massetConfig, pathname, protocolName, setBannerMessage, undergoingRecol])

  return (
    <ModalProvider rootComponent={TransitionGroup}>
      <Background home={home} />
      <HeaderGroup />
      <Container>
        <Main marginTop={home}>{prevChainId === chainId ? children : null}</Main>
      </Container>
      <Footer />
      <Toasts />
      <Tooltip tip="" hideIcon />
      <ReactTooltip id="global" place="top" />
      <GlobalStyle />
    </ModalProvider>
  )
}
