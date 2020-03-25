import React, { FC } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { ReactComponent as LogoSVG } from './logo.svg';
import { WalletButton } from '../wallet/WalletButton';
import { Navigation } from './Navigation';
import { ViewportWidth } from "../../theme";

const Logo = styled.div<{ active: boolean }>`
  width: 25px;
  order: 1;

  svg {
    // Gentle nudge to visual centre
    top: 4px;
    position: relative;

    #line {
      display: ${props => (props.active ? 'block' : 'none')};
    }
  }
`;

const Container = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: ${props => props.theme.color.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 ${props => props.theme.spacing.l};

  @media (min-width: ${ViewportWidth.m}) {
    flex-wrap: initial;
  }
`;

export const Header: FC<{}> = () => {
  const path = getWorkingPath('');
  return (
    <Container>
      <Logo active={path === '/'}>
        <A href="/" title="Home">
          <LogoSVG />
        </A>
      </Logo>
      <Navigation />
      <WalletButton />
    </Container>
  );
};
