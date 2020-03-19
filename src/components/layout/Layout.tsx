import React, { FC } from 'react';
import styled from 'styled-components';
import { useUIContext } from '../../context/UIProvider';
import { WalletConnection } from '../Wallet';
import { Navigation } from './Navigation';
import { Logo } from './Logo';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

const Container = styled.div`
  margin-right: 20px;
  display: flex;
  justify-content: center;
`;

const Header = styled.header`
  right: 20px;
  background: lightgray;
  position: fixed;
  top: 0;
  width: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
  padding: 10px;
  height: 50px;

  nav {
    flex-grow: 1;
    ul {
      list-style: none;
      display: flex;
      justify-content: space-evenly;
    }
  }
`;

const Main = styled.main`
  margin-top: 50px;
  padding: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const [{ walletModalIsShown }] = useUIContext();
  return (
    <Container>
      <Header>
        <Logo />
        <Navigation />
        <WalletConnection />
      </Header>
      <Main>{children}</Main>
      <Footer />
      <Sidebar />
      {walletModalIsShown ? <ModalOverlay /> : null}
      <div id="modal-root" />
    </Container>
  );
};
