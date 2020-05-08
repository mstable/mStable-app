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
  min-height: calc(
    100vh - 80px
  ); // The sticky header won't always be 80px, so this is less than ideal
  align-items: flex-start;
  padding-top: 40px;

  ${centredLayout}
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: ${({ theme }) => theme.spacing.s};
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
  }
  body {
    background: ${({ theme }) => theme.color.offWhite};
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
  box-shadow: ${({ inverted, theme }) =>
      inverted ? theme.color.whiteTransparent : theme.color.blackTransparent}
    0 0 12px;
  z-index: 1;
`;

const HeaderGroup: FC<{ walletExpanded: boolean }> = ({ walletExpanded }) => (
  <StickyHeader inverted={walletExpanded}>
    <StatusBar />
    <Header walletExpanded={walletExpanded} />
  </StickyHeader>
);

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const walletExpanded = useWalletExpanded();
  const activePath = getWorkingPath('');
  return (
    <>
      <Background walletExpanded={walletExpanded} />
      <HeaderGroup walletExpanded={walletExpanded} />
      <Container>
        {activePath !== '/' ? <BetaWarning /> : null}
        {walletExpanded ? <Wallet /> : <Main>{children}</Main>}
        <Footer walletExpanded={walletExpanded} />
      </Container>
      <Notifications />
      <GlobalStyle walletExpanded={walletExpanded} />
    </>
  );
};
