import React, { FC } from 'react';
import styled from 'styled-components';

import { AssetExchange } from './AssetExchange';

const Container = styled.div``;

export const Deposit: FC = () => (
  <Container>
    <AssetExchange />
  </Container>
);
