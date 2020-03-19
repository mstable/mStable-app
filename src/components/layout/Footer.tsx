import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: lightgray;
  padding: 10px;
`;

/**
 * Placeholder component for footer.
 */
export const Footer: FC<{}> = () => <Container>Footer goes here</Container>;
