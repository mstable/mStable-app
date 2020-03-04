import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Providers } from './context';
import { Updaters } from './updaters';
import { Layout } from './components/Layout';

const Root: FC<{}> = () => (
  <Providers>
    <Updaters />
    <>
      <Layout />
    </>
  </Providers>
);


ReactDOM.render(<Root />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
