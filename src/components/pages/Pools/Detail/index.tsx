import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { useTokens } from '../../../../context/TokensProvider';
import { ButtonLink } from '../../../core/Button';
import { PageHeader, PageAction } from '../../PageHeader';
import { AssetCard } from '../cards/AssetCard';
import { mockData, MockData } from '../mock';

const BackLink = styled(ButtonLink)`
  display: inline-block;
  margin-bottom: 16px;
`;

const StyledAssetCard = styled(AssetCard)`
  flex: 1;
  h2 {
    font-size: 1.75rem;
  }
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

const getTokenPairForAddress = (
  data: MockData,
  address?: string,
): string[] | undefined => {
  if (!address) return;

  const { pools } = data;
  const active = pools.active.find((p) => p.address === address)?.tokenPair;
  const user = pools.user.find((p) => p.address === address)?.tokenPair;
  const deprecated = pools.deprecated.find((p) => p.address === address)
    ?.tokenPair;

  return active ?? user ?? deprecated;
};

export const PoolDetail: FC = () => {
  const massetName = useSelectedMassetName();
  const { poolAddress } = useParams<{
    poolAddress?: string;
  }>();
  const tokenPair = getTokenPairForAddress(mockData, poolAddress);
  const subscribedTokens = useTokens(tokenPair ?? []);
  const title = subscribedTokens.map((t) => t.symbol).join('/');

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <BackLink to={`/${massetName}/pools`}>Back</BackLink>
      <CardContainer>
        <StyledAssetCard address={poolAddress} tokenPair={tokenPair} isLarge />
      </CardContainer>
      <Content>
        <p>test</p>
      </Content>
    </Container>
  );
};
