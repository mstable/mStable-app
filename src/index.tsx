import React, { FC } from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import * as serviceWorker from './serviceWorker'
import { Providers } from './context'
import { Updaters } from './updaters'
import { Layout } from './components/layout/Layout'
import { Home } from './components/pages'
import { Save } from './components/pages/Save'
import { NotFound } from './components/pages/NotFound'
import { Stats } from './components/pages/Stats'
import { EarnRedirect } from './components/pages/EarnRedirect'
import { Pools } from './components/pages/Pools'
import { PoolDetail } from './components/pages/Pools/Detail'
import { useNetwork } from './context/NetworkProvider'
import { useSelectedMasset } from './context/MassetProvider'
import { Forge } from './components/pages/Forge'

const Routes: FC = () => {
  const { supportedMassets } = useNetwork()
  const [massetName] = useSelectedMasset()
  const history = useHistory()

  useEffectOnce(() => {
    // Redirect for legacy links (without hash)
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/ipfs/')) {
      window.location.hash = window.location.pathname
      window.location.pathname = ''
    }

    if (supportedMassets.includes(massetName)) return

    // Redirect if not supported masset
    const tab = window.location.hash.split('/')?.[2]
    if (tab) history.push(`/musd/${tab}`)
  })

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/:massetName/earn" component={EarnRedirect} />
      <Route exact path="/:massetName/earn/admin" component={EarnRedirect} />
      <Route exact path="/:massetName/earn/:slugOrAddress" component={EarnRedirect} />
      <Route exact path="/:massetName/earn/:slugOrAddress/:userAddress" component={EarnRedirect} />
      <Route exact path="/:massetName/stats" component={Stats} />
      <Route exact path="/:massetName/save" component={Save} />
      <Route exact path="/:massetName/pools" component={Pools} />
      <Route exact path="/:massetName/forge" component={Forge} />
      <Route exact path="/:massetName/pools/:poolAddress" component={PoolDetail} />
      <Redirect exact path="/analytics" to="/musd/stats" />
      <Redirect exact path="/save" to="/musd/save" />
      <Redirect exact path="/mint" to="/musd/forge" />
      <Redirect exact path="/redeem" to="/musd/forge" />
      <Redirect exact path="/swap" to="/musd/forge" />
      <Redirect exact path="/earn" to="/musd/earn" />
      <Redirect exact path="/musd" to="/musd/forge" />
      <Redirect exact path="/mbtc" to="/mbtc/forge" />
      <Redirect exact path="/musd/analytics" to="/musd/stats" />
      <Redirect exact path="/mbtc/analytics" to="/mbtc/stats" />
      <Route component={NotFound} />
    </Switch>
  )
}

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
  )
}

render(<Root />, document.querySelector('#root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
