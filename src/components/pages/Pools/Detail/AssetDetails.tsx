import React from 'react';
import type { FC } from 'react';
import styled from 'styled-components';

import { useFeederPool } from '../../../../context/DataProvider/DataProvider';
import type { FeederPoolState } from '../../../../context/DataProvider/types';

import { ViewportWidth } from '../../../../theme';
import { EtherscanLink } from '../../../core/EtherscanLink';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  margin-top: 1rem;

  > h3 {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
  }

  > div a {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;
  }

  > div a:not(:last-child) {
    margin-right: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    align-items: center;
    flex-direction: row;

    > h3 {
      font-size: 1.25rem;
      margin-bottom: 0;
    }

    > div a {
      font-size: 1.125rem;
    }

    > div a:not(:last-child) {
      margin-right: 2rem;
    }
  }
`;

export const AssetDetails: FC<{ poolAddress: string }> = ({ poolAddress }) => {
  const { title, masset, fasset } = useFeederPool(
    poolAddress,
  ) as FeederPoolState;
  return (
    <Container>
      <h3>Asset Details</h3>
      <div>
        <EtherscanLink data={poolAddress} type="address">
          <h3>{title}</h3>
        </EtherscanLink>
        {[masset.token, fasset.token].map(token =>
          token.address ? (
            <EtherscanLink
              data={token.address}
              type="address"
              key={token.address}
            >
              <p>{token.symbol}</p>
            </EtherscanLink>
          ) : (
            <ThemedSkeleton width={48} height={32} key={token.address} />
          ),
        )}
      </div>
    </Container>
  );
};
