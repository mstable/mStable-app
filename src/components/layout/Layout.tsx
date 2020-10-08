import React, { FC, useLayoutEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { getWorkingPath } from 'hookrouter';

import { ReactTooltip } from '../core/ReactTooltip';
import { Header } from './Header';
import { Footer } from './Footer';
import { Account } from './Account';
import { useAccountOpen } from '../../context/AppProvider';
import { useIsIdle } from '../../context/UserProvider';
import { Background } from './Background';
import { AppBar } from './AppBar';
import { NotificationToasts } from './NotificationToasts';
import { centredLayout } from './css';
import { Color } from '../../theme';

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: 40px 20px;
`;

const GlobalStyle = createGlobalStyle<{ idle: boolean }>`
  ${reset}
  a {
    color: ${({ theme }) => theme.color.offBlack};
    text-decoration: none;
    border-bottom: 1px ${({ theme }) => theme.color.offBlack} solid;
  }
  html {
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  body {
    min-width: 320px;
    ${({ idle }) =>
      idle
        ? 'transition: filter 5s ease; filter: grayscale(50%) brightness(50%)'
        : ''};
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
    color: ${Color.offBlack};
    line-height: 1.3rem;
  }
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const HeaderGroup: FC<{ home: boolean }> = ({ home }) => (
  <StickyHeader>
    <AppBar />
    <Header home={home} />
  </StickyHeader>
);

const Centred = styled.div`
  flex: 1;
  ${centredLayout}
`;

const Container = styled.div<{ accountOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  // The sticky header won't always be 80px, so this is less than ideal
  min-height: calc(100vh - 80px);

  background: ${({ accountOpen }) =>
    accountOpen ? Color.black : 'transparent'};
`;

const PageContainer = styled.div<{ accountOpen: boolean }>`
  > :first-child {
    display: ${({ accountOpen }) => (accountOpen ? 'none' : 'flex')};
  }
  > :last-child {
    display: ${({ accountOpen }) => (accountOpen ? 'flex' : 'none')};
  }
`;

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const accountOpen = useAccountOpen();
  const idle = useIsIdle();
  const activePath = getWorkingPath('');
  const home = activePath === '/';
  const earn = activePath === '/earn';

  useLayoutEffect(() => {
    // Scroll to the top when the account view is toggled
    window.scrollTo({ top: 0 });
  }, [accountOpen]);

  return (
    <>
      <Background home={home} accountOpen={accountOpen} />
      <HeaderGroup home={home} />
      <PageContainer accountOpen={accountOpen}>
        <Container>
          {earn ? (
            <>{children}</>
          ) : (
            <Centred>
              <Main>{children}</Main>
            </Centred>
          )}
        </Container>
        <Container accountOpen>
          <Account />
        </Container>
      </PageContainer>
      <Footer accountOpen={accountOpen} />
      <NotificationToasts />
      <ReactTooltip id="global" />
      <GlobalStyle idle={idle} />
    </>
  );
};
