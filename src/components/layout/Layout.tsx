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
import { forMinWidth, ViewportWidth } from '../../theme';
import { Background } from './Background';
import { StatusBar } from './StatusBar';
import { Notifications } from './Notifications';

export const Container = styled.div<{ warnings: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  min-width: ${ViewportWidth.xs};
  align-items: flex-start;
  margin-top: ${({ warnings }) => warnings * 25}px; // Offset the warnings

  ${forMinWidth(ViewportWidth.s, `max-width: ${ViewportWidth.s}`)}
  ${forMinWidth(ViewportWidth.m, `max-width: ${ViewportWidth.m}`)}
  ${forMinWidth(ViewportWidth.xl, `max-width: ${ViewportWidth.l}`)}
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: ${props => props.theme.spacing.l};
`;

const GlobalStyle = createGlobalStyle<{ walletExpanded: boolean }>`
  ${reset}
  a {
    text-decoration: none;
    color: ${props => props.theme.color.blue};
  }
  body {
    background: ${({ theme, walletExpanded }) =>
      walletExpanded ? theme.color.foreground : theme.color.background};
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme, walletExpanded }) =>
      walletExpanded ? theme.color.background : theme.color.foreground};
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
      <Background />
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
