import React, { FC } from 'react';
import styled from 'styled-components';

import { Card } from '../Card';
import { ButtonLink } from '../../../core/Button';
import { PoolForms } from './PoolForms';
import { PoolBalances } from './PoolBalances';
import { ImpermanentLossWarning } from './ImpermanentLossWarning';

const BackLink = styled(ButtonLink)`
  display: inline-block;
  margin-bottom: 16px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  padding: 32px 0;
`;

const Container = styled.div`
  width: 100%;
`;

export const PoolContent: FC<{ address: string }> = ({ address }) => (
  <Container>
    <BackLink href="/earn">Back</BackLink>
    <CardContainer>
      <Card address={address} />
    </CardContainer>
    <Content>
      <PoolBalances />
      <ImpermanentLossWarning />
      <PoolForms address={address} />
    </Content>
  </Container>
);
