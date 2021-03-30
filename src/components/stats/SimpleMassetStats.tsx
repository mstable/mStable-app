import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';
import { MassetState } from '../../context/DataProvider/types';
import { TokenIcon } from '../icons/TokenIcon';
import { useSelectedMassetPrice } from '../../hooks/usePrice';
import { CountUp, CountUpUSD } from '../core/CountUp';
import { toK } from './utils';
import { TokenPair } from '../pages/Pools/cards/AssetCard';

const Label = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;

  > :first-child {
    height: 2rem;
    width: auto;
    margin-right: 0.5rem;
  }
`;

const Percentage = styled.div`
  text-align: right;
  > :last-child {
    ${({ theme }) => theme.mixins.numeric};
  }
`;

const AssetRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px ${({ theme }) => theme.color.bodyTransparent} solid;

  > :last-child span {
    text-align: right;
  }

  &:last-of-type {
    margin-bottom: 0;
    border-bottom: 0;
    padding-bottom: 0;
  }
`;

const FeederRow = styled(AssetRow)`
  display: block;
  > :first-child {
    margin-bottom: 0.5rem;
  }
`;

const Container = styled.div`
  font-size: 0.875rem;

  > :first-child {
    border-top: 1px ${({ theme }) => theme.color.bodyTransparent} solid;
  }
`;

export const SimpleMassetStats: FC = () => {
  const masset = useSelectedMassetState() as MassetState;
  const massetPrice = useSelectedMassetPrice();

  return (
    <Container>
      <AssetRow>
        <Label>
          <TokenIcon symbol={masset.token.symbol} />
          Total {masset.token.symbol}
        </Label>
        <CountUpUSD
          end={masset.token.totalSupply.simple}
          price={massetPrice}
          formattingFn={toK}
        />
      </AssetRow>
      {Object.values(masset.bAssets).map(b => (
        <AssetRow key={b.token.address}>
          <Label>
            <TokenIcon symbol={b.token.symbol} />
            {b.token.symbol}
          </Label>
          <Percentage>
            <CountUp end={b.totalVaultInMasset.simple} formattingFn={toK} />
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
          </Percentage>
        </AssetRow>
      ))}
      <FeederRow>
        <Label>Feeder Pools</Label>
        <div>
          {Object.values(masset.feederPools).map(fp => (
            <AssetRow key={fp.address}>
              <Label>
                <TokenPair tokens={[fp.masset.token, fp.fasset.token]} />
                {fp.token.symbol}
              </Label>
              <CountUpUSD
                end={fp.liquidity.simple}
                price={massetPrice ? massetPrice * fp.price.simple : undefined}
                formattingFn={toK}
              />
            </AssetRow>
          ))}
        </div>
      </FeederRow>
    </Container>
  );
};
