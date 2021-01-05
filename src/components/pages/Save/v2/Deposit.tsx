import React, { FC } from 'react';
import styled from 'styled-components';

import { AssetExchange } from './AssetExchange';
import { Boost } from './Boost';

const Container = styled.div``;

export const Deposit: FC = () => (
  <Container>
    <Boost />
    <AssetExchange />
  </Container>
);
