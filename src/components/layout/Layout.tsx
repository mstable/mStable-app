import React, { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { getWorkingPath } from 'hookrouter';
import { Header } from './Header';
import { Footer } from './Footer';
import { Wallet } from '../wallet/Wallet';
import { useWalletExpanded } from '../../context/AppProvider';
import { Background } from './Background';
import { StatusBar } from './StatusBar';
import { BetaWarning } from './BetaWarning';
import { Notifications } from './Notifications';
import { centredLayout } from './css';

interface WalletExpanded {
  walletExpanded: boolean;
}

export const Container = styled.div<{}>`
  flex-direction: column;

  // The sticky header won't always be 80px, so this is less than ideal
  min-height: calc(100vh - 80px);

  align-items: flex-start;

  ${centredLayout}
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: 40px 20px;
`;

const GlobalStyle = createGlobalStyle<WalletExpanded>`
  ${reset}
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.color.gold};
    font-weight: bold;
  }
  html {
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  body {
    min-width: 320px;
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme, walletExpanded }) =>
      walletExpanded ? theme.color.offWhite : theme.color.offBlack};
    line-height: 1.3rem;
  }
`;

const StickyHeader = styled.div<{ inverted: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const HeaderGroup: FC<{ walletExpanded: boolean; home: boolean }> = ({
  walletExpanded,
  home,
}) => (
  <StickyHeader inverted={walletExpanded}>
    <StatusBar />
    <Header walletExpanded={walletExpanded} home={home} />
  </StickyHeader>
);

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const walletExpanded = useWalletExpanded();
  const activePath = getWorkingPath('');
  const home = activePath === '/';
  return (
    <>
      <Background walletExpanded={walletExpanded} home={home} />
      <HeaderGroup walletExpanded={walletExpanded} home={home} />
      <Container>
        {home ? null : <BetaWarning />}
        {home ? (
          <>{children}</>
        ) : walletExpanded ? (
          <Wallet />
        ) : (
          <Main>{children}</Main>
        )}
        <Footer inverted={walletExpanded} home={home} />
      </Container>
      <Notifications />
      <GlobalStyle walletExpanded={walletExpanded} />
    </>
  );
};
