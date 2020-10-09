import React, { FC, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';

import { useMatchStakingRewardsAddressFromUrl } from '../../../../context/earn/useMatchStakingRewardsAddressFromUrl';
import { StakingRewardsContractProvider } from '../StakingRewardsContractProvider';
import { PoolContent } from './PoolContent';
import { useMasquerade } from '../../../../context/UserProvider';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
`;

export const PoolPage: FC = () => {
  const { userAddress, slugOrAddress } = useParams<{
    slugOrAddress?: string;
    userAddress?: string;
  }>();
  const address = useMatchStakingRewardsAddressFromUrl(slugOrAddress);
  const masquerade = useMasquerade();

  useEffect(() => {
    if (userAddress) {
      masquerade(userAddress);
    }

    return () => {
      masquerade();
    };
  }, [userAddress, masquerade]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
