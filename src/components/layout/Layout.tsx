import React, { FC } from 'react';
import { useUIContext } from '../../context/UIProvider';
import { WalletConnection } from '../Wallet';
import { Navigation } from './Navigation';
import { Logo } from './Logo';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => {
  const [{ walletModalIsShown }] = useUIContext();
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <Navigation />
        <WalletConnection />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <Footer />
      </footer>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      {walletModalIsShown ? <div className={styles.modalOverlay} /> : null}
      <div id="modal-root" />
    </div>
  );
};
