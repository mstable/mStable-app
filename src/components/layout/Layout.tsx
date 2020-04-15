import React, { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { Header } from './Header';
import { Footer } from './Footer';
import { Wallet } from '../wallet/Wallet';
import {
  useAppStatusWarnings,
  useWalletExpanded,
} from '../../context/AppProvider';
import { Background } from './Background';
import { StatusBar } from './StatusBar';
import { Notifications } from './Notifications';
import { centredLayout } from './css';

interface WalletExpanded {
  walletExpanded: boolean;
}

export const Container = styled.div<{ warnings: number }>`
  flex-direction: column;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  padding-top: ${({ warnings }) =>
    warnings * 25 + 80}px; // Offset the warnings, plus fixed header

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
  #root {
    display: flex;
    justify-content: center;
  }
`;

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const walletExpanded = useWalletExpanded();
  const warnings = useAppStatusWarnings();
  return (
    <>
      <Background walletExpanded={walletExpanded} />
      <Container warnings={warnings.length}>
        <StatusBar />
        <Header walletExpanded={walletExpanded} />
        {walletExpanded ? <Wallet /> : <Main>{children}</Main>}
        <Footer walletExpanded={walletExpanded} />
      </Container>
      <Notifications />
      <GlobalStyle walletExpanded={walletExpanded} />
    </>
  );
};
