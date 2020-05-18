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
  order: 1;
  flex-shrink: 0;

  svg {
    // Gentle nudge to visual centre
    top: 4px;
    position: relative;

    path,
    rect {
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

const Content = styled.div`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 ${({ theme }) => theme.spacing.s};
  height: auto;

  @media (min-width: ${ViewportWidth.m}) {
    flex-wrap: initial;
  }

  ${centredLayout}
`;

const Container = styled.header<{ inverted?: boolean; home: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80px;
  min-width: ${ViewportWidth.xs};
  background: ${({ home, inverted, theme }) =>
    home
      ? theme.color.gold
      : inverted
      ? theme.color.black
      : theme.color.offWhite};

  ${Logo} {
    margin-right: ${
      ({ home }) => (home ? '0' : '110px') // Offset the wallet button'
    }
`;

const Bar = styled.div`
  flex-grow: 1;
  order: 3;
  margin-left: 24px;
  border-top: 1px ${({ theme }) => theme.color.blackTransparent} solid;
`;

export const Header: FC<{ walletExpanded: boolean; home: boolean }> = ({
  walletExpanded,
  home,
}) => {
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
    <Container inverted={walletExpanded} home={home}>
      <Content>
        <Logo active={path === '/'} inverted={walletExpanded}>
          <A href="/" title="Home" onClick={collapseWallet}>
            <LogoSVG />
          </A>
        </Logo>
        {home ? (
          <Bar />
        ) : (
          <>
            <Centre>
              <Navigation walletExpanded={walletExpanded} />
            </Centre>
            <WalletButtonContainer ref={walletButtonRef}>
              <WalletButton />
            </WalletButtonContainer>
          </>
        )}
      </Content>
    </Container>
  );
};
