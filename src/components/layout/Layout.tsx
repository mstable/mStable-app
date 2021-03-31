import React, { FC, useLayoutEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { ModalProvider } from 'react-modal-hook';

import { getUnixTime } from 'date-fns';
import { BigNumber } from 'ethers';
import { ReactTooltip, Tooltip } from '../core/ReactTooltip';
import { Footer } from './Footer';
import { Account } from './Account';
import {
  BannerMessage,
  useAccountOpen,
  useBannerMessage,
} from '../../context/AppProvider';
import { Background } from './Background';
import { AppBar } from './AppBar';
import { NotificationToasts } from './NotificationToasts';
import { containerBackground } from './css';
import { Color, ViewportWidth } from '../../theme';
import { PendingTransactions } from '../wallet/PendingTransactions';
import { useSelectedMassetName } from '../../context/SelectedMassetNameProvider';
import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { SCALE } from '../../constants';
import { MessageHandler } from './MessageHandler';

const Main = styled.main<{ marginTop?: boolean }>`
  margin-top: ${({ marginTop }) => marginTop && `2rem`};

  @media (min-width: ${ViewportWidth.s}) {
    padding: 0 1rem;
  }
`;

const BackgroundContainer = styled.div`
  ${containerBackground}
  min-height: 50vh;
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
     z-index: 5 !important;
     width: 100% !important;
     height: 100% !important;
     
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
    }
    .bn-onboard-modal-content-header {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.offBlack};
      justify-content: center;
    }
    h3 {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.offBlack};
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
      border: 1px ${Color.blackTransparent} solid;
      border-radius: 0.5rem;
      > :first-child {
        min-width: 32px;
      }
      > span {
        font-weight: 500;
        font-size: 1rem;
        color: ${({ theme }) => theme.color.offBlack};
      }
      &:hover {
        border: 1px solid ${({ theme }) => theme.color.offBlack};
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
        color: 1px solid ${({ theme }) => theme.color.offBlack} !important;
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
  
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 3;
`;

const HeaderGroup: FC<{ home: boolean }> = ({ home }) => (
  <>
    <StickyHeader>
      <AppBar home={home} />
    </StickyHeader>
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

  // Message
  const [bannerMessage, setBannerMessage] = useBannerMessage();
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();
  const { undergoingRecol } = useSelectedMassetState() ?? {};

  const tvlCap = useMemo(() => {
    if (massetName !== 'mbtc') return;

    const { invariantStartingCap, invariantStartTime, invariantCapFactor } =
      massetState ?? {};
    if (!invariantStartingCap || !invariantStartTime || !invariantCapFactor)
      return;

    const currentTime = getUnixTime(Date.now());
    const weeksSinceLaunch = BigNumber.from(currentTime)
      .sub(invariantStartTime)
      .mul(SCALE)
      .div(604800);

    if (weeksSinceLaunch.gt(SCALE.mul(7))) return;

    const maxK = invariantStartingCap.add(
      invariantCapFactor.mul(weeksSinceLaunch.pow(2)).div(SCALE.pow(2)),
    );

    return new BigDecimal(maxK);
  }, [massetName, massetState]);

  // Scroll to the top when the account view is toggled
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, [accountOpen]);

  // Handle message prioritisation:
  useLayoutEffect(() => {
    let message: BannerMessage | undefined;

    if (massetName === 'musd' && pathname.includes('save')) {
      const saveV2Message = MessageHandler.saveV2({
        hasV1Balance: false,
        pathname,
      });
      const recollatMessage =
        (undergoingRecol && MessageHandler.recollat({ massetName })) ||
        undefined;

      message = recollatMessage ?? saveV2Message;
    } else if (massetName === 'mbtc') {
      message =
        (pathname === '/mbtc/mint' && MessageHandler.tvlCap({ tvlCap })) ||
        undefined;
    }

    if (bannerMessage?.title !== message?.title) {
      setBannerMessage(message);
    }
  }, [
    bannerMessage,
    massetName,
    pathname,
    setBannerMessage,
    tvlCap,
    undergoingRecol,
  ]);

  return (
    <ModalProvider rootComponent={TransitionGroup}>
      <Background home={home} accountOpen={accountOpen} />
      <HeaderGroup home={home} />
      <Container>
        {accountOpen ? (
          <Account />
        ) : (
          <Main marginTop={home}>
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
