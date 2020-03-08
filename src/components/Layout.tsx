import React, { FC } from 'react';
import { WalletConnection } from './Wallet';
import { Mint } from './Mint';
import styles from './Layout.module.css';
import { useUIContext } from '../context/UIProvider';

/**
 * Placeholder component for logo.
 */
const Logo: FC<{}> = () => <i>m</i>;

/**
 * Placeholder component for app navigation.
 */
const Navigation: FC<{}> = () => (
  <nav>
    <ul>
      {['mint', 'earn', 'redeem'].map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </nav>
);

/**
 * Placeholder component for footer.
 */
const Footer: FC<{}> = () => <>Footer goes here</>;

/**
 * Placeholder component for sidebar.
 */
const Sidebar: FC<{}> = () => <div>my account</div>;

/**
 * App layout component.
 */
export const Layout: FC<{}> = () => {
  const [{ walletModalIsShown }] = useUIContext();
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <Navigation />
        <WalletConnection />
      </header>
      <main className={styles.main}>
        <>
          {/* TODO later: dynamic content, e.g. from router */}
          <Mint />
        </>
      </main>
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
