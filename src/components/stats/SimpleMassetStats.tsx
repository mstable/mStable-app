import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';
import { MassetState } from '../../context/DataProvider/types';

import { Amount } from '../core/Amount';

const Label = styled.div`
  font-weight: 600;
`;

const AssetRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px ${({ theme }) => theme.color.bodyTransparent} solid;

  &:last-of-type {
    margin-bottom: 0;
    border-bottom: 0;
    padding-bottom: 0;
  }

  > :last-child {
    text-align: right;
    > :last-child {
      ${({ theme }) => theme.mixins.numeric};
    }
  }
`;

const Container = styled.div`
  font-size: 0.85rem;

  > :first-child {
    padding-top: 0.25rem;
    border-top: 1px ${({ theme }) => theme.color.bodyTransparent} solid;
  }
`;

export const SimpleMassetStats: FC = () => {
  const masset = useSelectedMassetState() as MassetState;

  return (
    <Container>
      <AssetRow>
        <Label>Total {masset.token.symbol}</Label>
        <Amount amount={masset.token.totalSupply} />
      </AssetRow>
      {Object.values(masset.bAssets).map(b => (
        <AssetRow key={b.token.address}>
          <Label>{b.token.symbol}</Label>
          <div>
            <Amount amount={b.totalVaultInMasset} />
            <div>
              {b.totalVaultInMasset.simple > 0 &&
              masset.token.totalSupply.simple > 0
                ? `${(
                    (b.totalVaultInMasset.simple /
                      masset.token.totalSupply.simple) *
                    100
                  ).toFixed(2)}%`
                : null}
            </div>
          </div>
        </AssetRow>
      ))}
    </Container>
  );
};
