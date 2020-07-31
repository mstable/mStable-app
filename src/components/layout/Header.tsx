import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { Navigation } from './Navigation';
import { ViewportWidth } from '../../theme';
import { useSetWalletPosition } from '../../context/AppProvider';
import { centredLayout } from './css';

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
  min-height: 48px;
  min-width: ${ViewportWidth.xs};
  background: ${({ home, inverted, theme }) =>
    home
      ? theme.color.gold
      : inverted
      ? theme.color.black
      : theme.color.offWhite};
`;

export const Header: FC<{ home: boolean }> = ({ home }) => {
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
    <Container home={home}>
      <Content>{home ? null : <Navigation />}</Content>
    </Container>
  );
};
