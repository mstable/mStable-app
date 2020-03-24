import React, { FC } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { ReactComponent as LogoSVG } from './logo.svg';
import { WalletButton } from '../wallet/WalletButton';
import { Navigation } from './Navigation';
import { Activity } from '../activity/Activity';

const Logo = styled.div<{ active: boolean }>`
  width: 25px;

  svg {
    // Gentle nudge to visual centre
    top: 4px;
    position: relative;

    #line {
      display: ${props => (props.active ? 'block' : 'none')};
    }
  }
`;

const Top = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing.s} ${props => props.theme.spacing.l};
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: ${props => props.theme.color.background};
`;

export const Header: FC<{}> = () => {
  const path = getWorkingPath('');
  return (
    <Container>
      <Top>
        <Logo active={path === '/'}>
          <A href="/" title="Home">
            <LogoSVG />
          </A>
        </Logo>
        <Activity />
        <WalletButton />
      </Top>
      <Navigation />
    </Container>
  );
};
