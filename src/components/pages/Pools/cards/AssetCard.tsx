import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { BigNumber } from 'ethers';
import { getUnixTime } from 'date-fns';

import { useFeederPoolMetricsQuery } from '../../../../graphql/feeders';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { useFeederPool } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { FeederPoolState } from '../../../../context/DataProvider/types';
import { useBlockNumbers } from '../../../../context/BlockProvider';
import { BigDecimal } from '../../../../web3/BigDecimal';

import { SubscribedToken } from '../../../../types';
import { TokenIcon } from '../../../icons/TokenIcon';
import { ViewportWidth } from '../../../../theme';
import { assetColorMapping } from '../constants';

import { Card } from './Card';

interface Props {
  className?: string;
  poolAddress: string;
  deprecated?: boolean;
  isLarge?: boolean;
  color?: string;
}

const StatsContainer = styled.div<{ isLarge?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;

  > div:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  > div {
    display: flex;
    justify-content: space-between;

    p:first-child {
      font-weight: 600;
    }

    p:last-child > span {
      ${({ theme }) => theme.mixins.numeric};
    }

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
      flex: 0;
      justify-content: space-between;

      flex-basis: ${({ isLarge }) => isLarge && `calc(50% - 5%)`};
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    ${({ isLarge }) =>
      isLarge && {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
  }
`;

const nowUnix = getUnixTime(Date.now());

const PoolStats: FC<{ isLarge?: boolean; address: string }> = ({
  isLarge = false,
  address,
}) => {
  // TODO: -
  // getPoolStats(tokenAddresses);
  const {
    vault: { rewardRate, periodFinish, periodDuration },
    // totalSupply,
    masset,
    fasset,
    invariantK,
    // price,
  } = useFeederPool(address) as FeederPoolState;

  const { block24h } = useBlockNumbers();

  const fpMetrics = useFeederPoolMetricsQuery({
    variables: { feederPool: address, block: { number: block24h as number } },
    skip: !block24h,
  });

  // TODO get price
  const massetPrice = 59450;

  const stats = useMemo(() => {
    // FIXME use totalVaultInMasset; not set on subgraph
    // const liquidity = masset.totalVault.add(fasset.totalVault);

    // FIXME liquidity should be USD value; simply invariantK * masset price?
    const liquidity = BigDecimal.parse(
      ((parseInt(invariantK.toString()) / 1e18) * massetPrice).toFixed(2),
    );

    const rewardsPerWeek = new BigDecimal(
      nowUnix < periodFinish
        ? BigNumber.from(periodDuration).mul(rewardRate)
        : 0,
    );

    // TODO calculate volume on the subgraph
    const volume = (() => {
      if (fpMetrics.data?.historic && fpMetrics.data.current) {
        const { current, historic } = fpMetrics.data;
        const swapped = BigDecimal.fromMetric(current.cumulativeSwapped).sub(
          BigDecimal.fromMetric(historic.cumulativeSwapped),
        );
        const minted = BigDecimal.fromMetric(current.cumulativeMinted).sub(
          BigDecimal.fromMetric(historic.cumulativeMinted),
        );
        const redeemed = BigDecimal.fromMetric(current?.cumulativeRedeemed).sub(
          BigDecimal.fromMetric(historic?.cumulativeRedeemed),
        );
        return swapped.add(minted).add(redeemed);
      }
      return BigDecimal.ZERO;
    })();

    return { liquidity, rewardsPerWeek, volume };
  }, [fpMetrics.data, invariantK, periodDuration, periodFinish, rewardRate]);

  return (
    <StatsContainer isLarge={isLarge}>
      <div>
        <p>Liquidity</p>
        <p>
          <span>${stats.liquidity.abbreviated}</span>
        </p>
      </div>
      <div>
        <p>Rewards</p>
        <p>
          <span>{stats.rewardsPerWeek.abbreviated}</span> MTA / week
        </p>
      </div>
      {isLarge && (
        <>
          <div>
            <p>24h Volume</p>
            <p>
              <span>{stats.volume.abbreviated}</span>
            </p>
          </div>
          <div>
            <p>Assets</p>
            <p>
              <span>{masset.totalVault.abbreviated}</span> {masset.token.symbol}
              , <span>{fasset.totalVault.abbreviated}</span>{' '}
              {fasset.token.symbol}
            </p>
          </div>
        </>
      )}
    </StatsContainer>
  );
};

const IconContainer = styled.div<{ isLarge: boolean }>`
  display: flex;

  img {
    height: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    width: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    border-radius: ${({ isLarge }) => (isLarge ? `1.25rem` : `1rem`)};
    background: ${({ theme }) => theme.color.white};
  }

  > img:last-child {
    margin-left: -0.7rem;
  }
`;

const TokenPair: FC<{ tokens?: SubscribedToken[]; isLarge?: boolean }> = ({
  tokens,
  isLarge = false,
}) => {
  if (!tokens?.length || tokens.length < 2) return null;

  // TODO: Add skeleton
  return (
    <IconContainer isLarge={isLarge}>
      <TokenIcon symbol={tokens?.[0].symbol} />
      <TokenIcon symbol={tokens?.[1].symbol} />
    </IconContainer>
  );
};

const Container = styled(Card)<{ gradientColor?: string }>`
  background: ${({ gradientColor }) =>
    gradientColor
      ? `linear-gradient(180deg, ${gradientColor} 0%, transparent 100%);`
      : `none`};

  h2 > div {
    display: flex;
    align-items: center;

    > *:first-child {
      margin-right: 0.5rem;
    }
  }

  > div {
    width: 100%;
  }
`;

const AssetCardContent: FC<Props> = ({
  className,
  poolAddress,
  deprecated = false,
  isLarge = false,
  color,
}) => {
  const feederPool = useFeederPool(poolAddress) as FeederPoolState;

  useTokenSubscription(feederPool.address);
  useTokenSubscription(feederPool.fasset.address);

  const massetName = useSelectedMassetName();
  const history = useHistory();

  const gradientColor = color ?? assetColorMapping[feederPool.title];

  const handleClick = (): void => {
    history.push(`/${massetName}/pools/${poolAddress}`);
  };

  return (
    <Container
      className={className}
      gradientColor={!deprecated ? gradientColor : undefined}
      title={
        <div>
          <TokenPair
            tokens={[feederPool.masset.token, feederPool.fasset.token]}
            isLarge={isLarge}
          />
          {feederPool.title}
        </div>
      }
      iconType={(!isLarge && 'chevron') || undefined}
      onClick={(!isLarge && handleClick) || undefined}
    >
      {!deprecated && <PoolStats address={poolAddress} isLarge={isLarge} />}
    </Container>
  );
};

export const AssetCard: FC<Props> = ({
  poolAddress,
  className,
  deprecated,
  isLarge,
  color,
}) => {
  const feederPool = useFeederPool(poolAddress);
  return feederPool ? (
    <AssetCardContent
      poolAddress={poolAddress}
      className={className}
      deprecated={deprecated}
      isLarge={isLarge}
      color={color}
    />
  ) : (
    <Skeleton height={200} />
  );
};

export const CustomAssetCard: FC<
  Omit<Props, 'poolAddress'> & { title: string }
> = ({ className, deprecated, color, title, children }) => (
  <Container
    className={className}
    gradientColor={!deprecated ? color : undefined}
    title={title}
  >
    {children}
  </Container>
);
