import React, { FC } from 'react';
import styled from 'styled-components';

import { WithdrawForm } from './WithdrawForm';

const Container = styled.div``;

export const Withdraw: FC = () => (
  <Container>
    <WithdrawForm />
  </Container>
);
