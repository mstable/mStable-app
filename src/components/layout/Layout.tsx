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
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;

  ${centredLayout}
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: ${props => props.theme.spacing.l};
`;

const GlobalStyle = createGlobalStyle<WalletExpanded>`
  ${reset}
  a {
    text-decoration: none;
    color: ${props => props.theme.color.blue};
  }
  html {
    overflow-y: scroll;
  }
  body {
    background: ${({ theme }) => theme.color.background};
    min-width: 320px;
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme, walletExpanded }) =>
      walletExpanded ? theme.color.background : theme.color.foreground};
    line-height: 1.3rem;
  }
`;

const StickyHeader = styled.div<{ inverted: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  box-shadow: ${({ theme, inverted }) =>
      inverted
        ? theme.color.backgroundTransparent
        : theme.color.foregroundTransparent}
    0 0 4px;
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
