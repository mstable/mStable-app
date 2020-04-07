import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { useRoutes } from 'hookrouter';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import * as serviceWorker from './serviceWorker';
import { Providers } from './context';
import { Updaters } from './updaters';
import { Layout } from './components/layout/Layout';
import { Home } from './components/pages/Home';
import { Swap } from './components/pages/Swap';
import { Earn } from './components/pages/Earn';
import { Save } from './components/pages/Save';
import { About } from './components/pages/About';
import { NotFound } from './components/pages/NotFound';

const GlobalStyle = createGlobalStyle`
  ${reset}
  a {
    text-decoration: none;
    color: ${props => props.theme.color.blue};
  }
  body {
    background: ${props => props.theme.color.background};
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${props => props.theme.color.foreground};
  }
  #root {
    display: flex;
    justify-content: center;
  }
`;

const routes = {
  '/': () => <Home />,
  '/swap': () => <Swap />,
  '/earn': () => <Earn />,
  '/save': () => <Save />,
  '/about': () => <About />,
};

const Root: FC<{}> = () => {
  const routeResult = useRoutes(routes);
  return (
    <Providers>
      <Updaters />
      <>
        <Layout>{routeResult || <NotFound />}</Layout>
        <GlobalStyle />
      </>
    </Providers>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
