import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useMatchStakingRewardsAddressFromUrl } from '../../../../context/earn/useMatchStakingRewardsAddressFromUrl';
import { StakingRewardsContractProvider } from '../StakingRewardsContractProvider';
import { PoolContent } from './PoolContent';

interface Props {
  slugOrAddress?: string;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
`;

export const PoolPage: FC<Props> = ({ slugOrAddress }) => {
  const address = useMatchStakingRewardsAddressFromUrl(slugOrAddress);

  if (address === false) {
    return <>404</>;
  }

  return address ? (
    <StakingRewardsContractProvider address={address}>
      <Container>
        <PoolContent address={address} />
      </Container>
    </StakingRewardsContractProvider>
  ) : (
    <Skeleton height={225} />
  );
};
