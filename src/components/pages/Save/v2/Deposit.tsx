import React, { FC } from 'react';
import styled from 'styled-components';

import { useModalComponent } from '../../../../hooks/useModalComponent';
import { Button } from '../../../core/Button';
import { AssetExchange } from './AssetExchange';

const Container = styled.div``;

export const Deposit: FC = () => {
  // TODO replace me
  const [showModal] = useModalComponent({
    title: 'Modal example',
    children: <div>Modal children</div>,
  });

  return (
    <Container>
      <Button onClick={showModal}>Test modal</Button>
      <AssetExchange />
    </Container>
  );
};
