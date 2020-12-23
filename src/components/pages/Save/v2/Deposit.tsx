import React, { FC } from 'react';
import styled from 'styled-components';

import { Boost } from './Boost';
import { DepositForm } from './DepositForm';

const Container = styled.div``;

export const Deposit: FC = () => (
  <Container>
    <Boost />
    <DepositForm />
  </Container>
);
