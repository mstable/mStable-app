import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  right: 0;
  width: 20px;
  background: gray;
  bottom: 0;
  top: 0;

  > div {
    writing-mode: vertical-rl;
    position: absolute;
    top: 0;
    bottom: 0;
    text-align: center;
  }
`;

/**
 * Placeholder component for sidebar.
 */
export const Sidebar: FC<{}> = () => (
  <Container>
    <div>my account</div>
  </Container>
);
