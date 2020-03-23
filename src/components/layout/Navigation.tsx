import React, { FC } from 'react';
import styled from 'styled-components';
// import { A } from 'hookrouter';

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: ${props => props.theme.spacing.s};
`;

const BackButton = styled.button`
  width: 24px;
  height: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin: 0;
`;

const MenuIcon = styled.i`
  display: block;
  width: 24px;
  height: 24px;
  background: ${props => props.theme.color.foreground};
`;

/**
 * Placeholder component for app navigation.
 */
export const Navigation: FC<{}> = () => (
  <Container>
    <BackButton>&lt;</BackButton>
    <Title>mStable</Title>
    <MenuIcon />
  </Container>
);
