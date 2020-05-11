import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { ReactComponent as LogoSVG } from './logo.svg';
import { WalletButton } from '../wallet/WalletButton';
import { Navigation } from './Navigation';
import { ViewportWidth } from '../../theme';
import {
  useCollapseWallet,
  useSetWalletPosition,
} from '../../context/AppProvider';
import { centredLayout } from './css';

const Logo = styled.div<{ active: boolean; inverted?: boolean }>`
  width: 25px;
  margin-right: 110px; // Offset the wallet button
  order: 1;
  flex-shrink: 0;

  svg {
    // Gentle nudge to visual centre
    top: 4px;
    position: relative;

    path, rect {
      fill: ${({ theme, inverted }) =>
        inverted ? theme.color.white : theme.color.black};
    }
  }
`;

const Centre = styled.div`
  display: flex;
  order: 3;
  width: 100%;

  @media (min-width: ${ViewportWidth.m}) {
    width: auto;
    order: 2;
  }
`;

const WalletButtonContainer = styled.div`
  cursor: pointer;
  order: 2;

  @media (min-width: ${ViewportWidth.m}) {
    order: 3;
  }
`;

const Container = styled.header<{ inverted?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80px;
  min-width: ${ViewportWidth.xs};
  background: linear-gradient(
    90deg,
    ${({ theme, inverted }) =>
      inverted
        ? `${theme.color.black}, ${theme.color.offBlack}, ${theme.color.black}`
        : `${theme.color.offWhite}, ${theme.color.white}, ${theme.color.offWhite}`}
  );
`;

const Content = styled.div`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 ${({ theme }) => theme.spacing.s};
  height: 80px;

  @media (min-width: ${ViewportWidth.m}) {
    flex-wrap: initial;
  }

  ${centredLayout}
`;

export const Header: FC<{ walletExpanded: boolean }> = ({ walletExpanded }) => {
  const path = getWorkingPath('');
  const collapseWallet = useCollapseWallet();
  const setWalletPosition = useSetWalletPosition();

  const walletButtonRef = useRef<HTMLDivElement>(null);

  /**
   * Set the on-screen wallet position on window resize
   */
  const handleResize = useCallback((): void => {
    if (walletButtonRef.current) {
      const {
        top,
        left,
        width,
        height,
      } = walletButtonRef.current.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      setWalletPosition(cx, cy);
    }
  }, [walletButtonRef, setWalletPosition]);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Trigger it once
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <Container inverted={walletExpanded}>
      <Content>
        <Logo active={path === '/'} inverted={walletExpanded}>
          <A href="/" title="Home" onClick={collapseWallet}>
            <LogoSVG />
          </A>
        </Logo>
        <Centre>
          <Navigation walletExpanded={walletExpanded} />
        </Centre>
        <WalletButtonContainer ref={walletButtonRef}>
          <WalletButton />
        </WalletButtonContainer>
      </Content>
    </Container>
  );
};
