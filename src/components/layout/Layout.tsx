import React, { FC, useLayoutEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { ModalProvider } from 'react-modal-hook';

import { ReactTooltip, Tooltip } from '../core/ReactTooltip';
import { Header } from './Header';
import { Footer } from './Footer';
import { Account } from './Account';
import { useAccountOpen } from '../../context/AppProvider';
import { Background } from './Background';
import { AppBar } from './AppBar';
import { NotificationToasts } from './NotificationToasts';
import { containerBackground } from './css';
import { Color } from '../../theme';
import { BannerMessage } from './BannerMessage';
import { PendingTransactions } from '../wallet/PendingTransactions';

const Main = styled.main<{ marginTop?: boolean }>`
  padding: 0 1rem;
  margin-top: ${({ marginTop }) => marginTop && `4rem`};
`;

const BackgroundContainer = styled.div`
  ${containerBackground}
`;

const GlobalStyle = createGlobalStyle`
  ${reset}
  a {
    color: ${Color.blue};
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
    color: ${({ theme }) => theme.color.black};
    z-index: 1;
    > section {
      font-family: 'Poppins', sans-serif !important;
      border-radius: 1rem;
    }
    .bn-onboard-modal-content-header {
      > :first-child {
        display: none;
      }
      > h3 {
        margin-left: 0;
        font-weight: 600;
        color: ${({ theme }) => theme.color.black};
      }
    }
    .bn-onboard-select-description {
      display: none;
    }
    .bn-onboard-icon-button {
      font-weight: normal;
      padding: 4px 16px;
      border: 1px ${Color.blackTransparent} solid;
      border-radius: 0.5rem;
      > :first-child {
        min-width: 32px;
      }
      > span {
        font-weight: normal;
        font-size: 16px;
        color: ${({ theme }) => theme.color.black};
      }
      &:hover {
        box-shadow: none;
      }
    }
    .bn-onboard-prepare-button {
      appearance: none;
      outline: none;
      background: transparent;
      user-select: none;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 12px;
      padding: 8px 16px;
      border: 1px ${Color.blackTransparent} solid;
      border-radius: 0.5rem;
      color: ${Color.black};
      &:hover {
        background: white;
      }
    }
  }
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 2;
`;

const HeaderGroup: FC<{ home: boolean }> = ({ home }) => (
  <>
    <StickyHeader>
      <AppBar home={home} />
    </StickyHeader>
    <Header home={home} />
  </>
);

const Container = styled.div<{ accountOpen?: boolean }>`
  display: grid;
  overflow-x: hidden;

  min-height: calc(100vh - 182px);

  // Space for the footer
  padding-bottom: 4rem;

  background: ${({ accountOpen }) =>
    accountOpen ? Color.black : 'transparent'};

  grid-template-columns:
    1fr
    min(1000px, 100%)
    1fr;

  > * {
    grid-column: 2;
  }
`;

export const Layout: FC = ({ children }) => {
  const accountOpen = useAccountOpen();
  const { pathname } = useLocation();
  const home = pathname === '/';
  const earn = pathname === '/earn';

  useLayoutEffect(() => {
    // Scroll to the top when the account view is toggled
    window.scrollTo({ top: 0 });
  }, [accountOpen]);

  return (
    <ModalProvider rootComponent={TransitionGroup}>
      <Background home={home} accountOpen={accountOpen} />
      <HeaderGroup home={home} />
      <Container>
        {accountOpen ? (
          <Account />
        ) : earn ? (
          <>{children}</>
        ) : (
          <Main marginTop={home}>
            {!home && <BannerMessage />}
            <BackgroundContainer>{children}</BackgroundContainer>
          </Main>
        )}
      </Container>
      <Footer />
      <PendingTransactions />
      <NotificationToasts />
      <Tooltip tip="" hideIcon />
      <ReactTooltip id="global" place="top" />
      <GlobalStyle />
    </ModalProvider>
  );
};
