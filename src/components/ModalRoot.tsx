import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;

  * {
    pointer-events: all;
  }
`;

export const ModalRoot: FC<{}> = ({ children }) => (
  <Container id="modal-root">{children}</Container>
);
