import React, { FC } from 'react';
import styled from 'styled-components';

import { OverlayItems, useOverlayItem } from '../../context/AppProvider';
import { Wallet } from '../wallet/Wallet';
import { Notifications } from './Notifications';
import { centredLayout } from './css';

const Inner = styled.div`
  overflow-y: visible;
  padding: 64px 20px;

  ${centredLayout}
`;

const Container = styled.div<{ open: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  background: black;
  bottom: ${({ open }) => (open ? 0 : '100%')};
  overflow: hidden;
  top: 32px;
  overflow-y: auto;
`;

export const Overlay: FC<{}> = () => {
  const item = useOverlayItem();

  return (
    <Container open={item !== null}>
      <Inner>
        {item === OverlayItems.Wallet ? (
          <Wallet />
        ) : item === OverlayItems.Notifications ? (
          <Notifications />
        ) : null}
      </Inner>
    </Container>
  );
};
