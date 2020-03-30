import React, { FC } from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { Wallet } from '../wallet/Wallet';
import { useWalletExpanded } from '../../context/UIProvider';
import { forMinWidth, ViewportWidth } from '../../theme';
import { Background } from './Background';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  min-width: ${ViewportWidth.xs};

  ${forMinWidth(ViewportWidth.s, `max-width: ${ViewportWidth.s}`)}
  ${forMinWidth(ViewportWidth.m, `max-width: ${ViewportWidth.m}`)}
  ${forMinWidth(ViewportWidth.xl, `max-width: ${ViewportWidth.l}`)}
`;

const Main = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.l};

  @media (min-width: ${ViewportWidth.m}) {
    padding-top: 10%;
  }
`;

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const walletExpanded = useWalletExpanded();
  return (
    <>
      <Background />
      <Container>
        <Header />
        <Main>{children}</Main>
        {walletExpanded ? <Wallet /> : null}
        <Footer />
      </Container>
    </>
  );
};
