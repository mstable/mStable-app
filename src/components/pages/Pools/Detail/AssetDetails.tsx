import React from 'react';
import type { FC } from 'react';
import styled from 'styled-components';

import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { ViewportWidth } from '../../../../theme';
import { EtherscanLink } from '../../../core/EtherscanLink';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';

const Container = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;

  > h3 {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1rem;
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
    }

    > div a {
      font-size: 1.125rem;
    }

    > div a:not(:last-child) {
      margin-right: 2rem;
    }
  }
`;

export const AssetDetails: FC = () => {
  const { address, title, masset, fasset } = useSelectedFeederPoolState();
  return (
    <Container>
      <h3>Asset Details</h3>
      <div>
        <EtherscanLink data={address} type="address">
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
