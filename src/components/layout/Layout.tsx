import React, { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { getWorkingPath } from 'hookrouter';

import { ReactTooltip } from '../core/ReactTooltip';
import { Header } from './Header';
import { Footer } from './Footer';
import { Overlay } from './Overlay';
import { useOverlayOpen } from '../../context/AppProvider';
import { useIsIdle } from '../../context/UserProvider';
import { Background } from './Background';
import { AppBar } from './AppBar';
import { BetaWarning } from './BetaWarning';
import { NotificationToasts } from './NotificationToasts';
import { centredLayout } from './css';
import { Color } from '../../theme';

interface OverlayOpen {
  overlayOpen: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // The sticky header won't always be 80px, so this is less than ideal
  min-height: calc(100vh - 80px);

  align-items: flex-start;
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: 40px 20px;
`;

const GlobalStyle = createGlobalStyle<OverlayOpen & { idle: boolean }>`
  ${reset}
  a {
    color: ${({ theme }) => theme.color.offBlack};
    text-decoration: none;
    border-bottom: 1px ${({ theme }) => theme.color.offBlack} solid;
  }
  html {
    overflow-y: ${({ overlayOpen }) => (overlayOpen ? 'hidden' : 'scroll')};
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
    color: ${({ theme, overlayOpen }) =>
      overlayOpen ? theme.color.offWhite : theme.color.offBlack};
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

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const overlayOpen = useOverlayOpen();
  const idle = useIsIdle();
  const activePath = getWorkingPath('');
  const home = activePath === '/';
  const earn = activePath === '/earn';

  return (
    <>
      <Background home={home} />
      <HeaderGroup home={home} />
      <Container>
        {home ? null : <BetaWarning />}
        {earn ? (
          <>{children}</>
        ) : (
          <Centred>
            <Main>{children}</Main>
          </Centred>
        )}
        <Footer inverted={overlayOpen} />
      </Container>
      <Overlay />
      <NotificationToasts />
      <ReactTooltip id="global" />
      <GlobalStyle overlayOpen={overlayOpen} idle={idle} />
    </>
  );
};
