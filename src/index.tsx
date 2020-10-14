import React, { FC } from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import * as serviceWorker from './serviceWorker';
import { checkRequiredEnvVars } from './checkRequiredEnvVars';
import { DAPP_VERSION } from './web3/constants';
import { Providers } from './context';
import { Updaters } from './updaters';
import { Layout } from './components/layout/Layout';
import { Home } from './components/pages/Home';
import { Swap } from './components/pages/Swap';
import { Mint } from './components/pages/Mint';
import { Earn } from './components/pages/Earn';
import { Save } from './components/pages/Save';
import { Redeem } from './components/pages/Redeem';
import { NotFound } from './components/pages/NotFound';
import { FAQ } from './components/pages/FAQ';
import { Analytics } from './components/pages/Analytics';
import { PoolPage } from './components/pages/Earn/Pool';
import { AdminPage } from './components/pages/Earn/Admin';

checkRequiredEnvVars();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: `mStable-app@${DAPP_VERSION}`,
});

const Routes: FC = () => {
  useEffectOnce(() => {
    // Redirect for legacy links (without hash)
    if (
      window.location.pathname !== '/' &&
      !window.location.pathname.startsWith('/ipfs/')
    ) {
      window.location.hash = window.location.pathname;
      window.location.pathname = '';
    }
  });

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/analytics" component={Analytics} />
      <Route exact path="/earn" component={Earn} />
      <Route exact path="/earn/admin" component={AdminPage} />
      <Route exact path="/earn/:slugOrAddress" component={PoolPage} />
      <Route
        exact
        path="/earn/:slugOrAddress/:userAddress"
        component={PoolPage}
      />
      <Route exact path="/faq" component={FAQ} />
      <Route exact path="/mint" component={Mint} />
      <Route exact path="/redeem" component={Redeem} />
      <Route exact path="/save" component={Save} />
      <Route exact path="/swap" component={Swap} />
      <Route component={NotFound} />
    </Switch>
  );
};

const Root: FC = () => {
  return (
    <HashRouter>
      <Providers>
        <Updaters />
        <Layout>
          <Routes />
        </Layout>
      </Providers>
    </HashRouter>
  );
};

render(<Root />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
