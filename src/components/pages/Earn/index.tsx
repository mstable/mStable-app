import React, { FC } from 'react';
import styled from 'styled-components';

import { EarnDataProvider } from '../../../context/earn/EarnDataProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { PoolsOverview } from './PoolsOverview';
import { MerkleDropClaims } from './MerkleDropClaims';
import { CurveProvider } from '../../../context/earn/CurveProvider';

const MerkleClaims = styled(MerkleDropClaims)`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
`;

const Content = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const EarnContent: FC = () => {
  return (
    <Container>
      <Content>
        <PageHeader
          action={PageAction.Earn}
          subtitle="Ecosystem rewards with mStable"
        />
        <MerkleClaims />
        <PoolsOverview />
      </Content>
    </Container>
  );
};

export const Earn: FC = () => (
  <CurveProvider>
    <EarnDataProvider>
      <EarnContent />
    </EarnDataProvider>
  </CurveProvider>
);
