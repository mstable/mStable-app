import React, { FC } from 'react';
import styled from 'styled-components';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
`;

const Main = styled.main`
  margin-top: 50px;
  padding: ${props => props.theme.spacing.l};
`;

/**
 * App layout component.
 */
export const Layout: FC<{}> = ({ children }) => (
  <Container>
    <Header>
      <Navigation />
    </Header>
    <Main>{children}</Main>
    <Footer />
  </Container>
);
