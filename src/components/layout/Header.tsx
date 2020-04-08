import React, { FC } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { ReactComponent as LogoSVG } from './logo.svg';
import { WalletButton } from '../wallet/WalletButton';
import { Navigation } from './Navigation';
import { ViewportWidth } from '../../theme';
import { useCollapseWallet } from '../../context/AppProvider';

const Logo = styled.div<{ active: boolean; inverted: boolean }>`
  width: 25px;
  order: 1;

  svg {
    // Gentle nudge to visual centre
    top: 4px;
    position: relative;

    path {
      fill: ${({ theme, inverted }) =>
        inverted ? theme.color.background : theme.color.foreground};
    }

    #line {
      display: ${({ active }) => (active ? 'block' : 'none')};
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

const Container = styled.header<{ inverted: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  min-height: 80px;
  background: ${({ theme, inverted }) =>
    inverted ? theme.color.foreground : theme.color.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 ${({ theme }) => theme.spacing.l};

  @media (min-width: ${ViewportWidth.m}) {
    flex-wrap: initial;
  }
`;

export const Header: FC<{ walletExpanded: boolean }> = ({ walletExpanded }) => {
  const path = getWorkingPath('');
  const collapseWallet = useCollapseWallet();
  return (
    <Container inverted={walletExpanded}>
      <Logo active={path === '/'} inverted={walletExpanded}>
        <A href="/" title="Home" onClick={collapseWallet}>
          <LogoSVG />
        </A>
      </Logo>
      <Centre>
        <Navigation walletExpanded={walletExpanded} />
      </Centre>
      <WalletButton />
    </Container>
  );
};
