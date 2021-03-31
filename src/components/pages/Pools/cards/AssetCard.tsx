import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { useFeederPoolMetricsQuery } from '../../../../graphql/feeders';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { useFeederPool } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { FeederPoolState } from '../../../../context/DataProvider/types';
import { useBlockNumbers } from '../../../../context/BlockProvider';
import { BigDecimal } from '../../../../web3/BigDecimal';

import { TokenPair } from '../../../icons/TokenIcon';
import { ViewportWidth } from '../../../../theme';
import { assetColorMapping } from '../constants';
import { toK } from '../../../stats/utils';

import { Card } from './Card';
import { CountUp, CountUpUSD } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';
import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';

interface Props {
  className?: string;
  poolAddress: string;
  deprecated?: boolean;
  isLarge?: boolean;
  color?: string;
}

const RewardsAPY = styled.div<{ isLarge?: boolean }>`
  @media (min-width: ${ViewportWidth.s}) {
    > div {
      ${({ isLarge }) =>
        !isLarge && {
          display: 'flex',
          flexDirection: 'row',
        }}
    }
  }
`;

const UnderlinedTip = styled(Tooltip)`
  text-decoration: underline;
`;

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
    font-size: 0.875rem;

    > :first-child {
      font-weight: 600;
    }

    > :last-child {
      text-align: right;
      span {
        ${({ theme }) => theme.mixins.numeric};
      }
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
  > div > div {
    font-size: ${({ isLarge }) => !isLarge && `1rem`};
  }

  ${RewardsAPY} + div {
    text-align: left;
  }
`;

const PoolStats: FC<{ isLarge?: boolean; address: string }> = ({
  isLarge = false,
  address,
}) => {
  const { liquidity, price } = useFeederPool(address) as FeederPoolState;
  const massetPrice = useSelectedMassetPrice();

  const { block24h } = useBlockNumbers();

  const fpMetrics = useFeederPoolMetricsQuery({
    variables: { feederPool: address, block: { number: block24h as number } },
    skip: !block24h,
  });

  const fpTokenPrice = massetPrice ? price.simple * massetPrice : undefined;
  const feederPoolApy = useFeederPoolApy(address);

  const volume = useMemo(() => {
    if (fpMetrics.data?.historic && fpMetrics.data.current) {
      const { current, historic } = fpMetrics.data;
      const swapped = BigDecimal.fromMetric(current.cumulativeSwapped).sub(
        BigDecimal.fromMetric(historic.cumulativeSwapped),
      );
      const minted = BigDecimal.fromMetric(current.cumulativeMinted).sub(
        BigDecimal.fromMetric(historic.cumulativeMinted),
      );
      const redeemed = BigDecimal.fromMetric(current.cumulativeRedeemed).sub(
        BigDecimal.fromMetric(historic.cumulativeRedeemed),
      );
      return swapped.add(minted).add(redeemed);
    }
    return BigDecimal.ZERO;
  }, [fpMetrics.data]);

  return (
    <StatsContainer isLarge={isLarge}>
      <div>
        <p>Liquidity</p>
        <CountUpUSD
          end={liquidity.simple}
          price={fpTokenPrice}
          formattingFn={toK}
        />
      </div>
      {isLarge && (
        <>
          <div>
            <p>Price</p>
            <div>
              <CountUpUSD
                end={price.simple}
                decimals={10}
                price={massetPrice}
              />
            </div>
          </div>
          <div>
            <p>24h Volume</p>
            <CountUpUSD
              end={volume.simple}
              decimals={10}
              price={massetPrice}
              formattingFn={toK}
            />
          </div>
        </>
      )}
      <RewardsAPY isLarge={isLarge}>
        <p>Rewards APY</p>
        <div>
          <div>
            {feederPoolApy.value && <CountUp end={feederPoolApy.value.base} />}%
          </div>
          <div>
            &nbsp;→&nbsp;
            <UnderlinedTip
              tip="Max boost can be achieved by staking MTA"
              hideIcon
            >
              {feederPoolApy.value && (
                <CountUp end={feederPoolApy.value.maxBoost} />
              )}
              %
            </UnderlinedTip>
          </div>
        </div>
      </RewardsAPY>
      {feederPoolApy.value && feederPoolApy.value.base > 1000 && (
        <div>While liquidity is low, this APY is highly volatile</div>
      )}
    </StatsContainer>
  );
};

const Background = styled.div<{ gradientColor?: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ gradientColor }) =>
    gradientColor
      ? `linear-gradient(180deg, ${gradientColor} 0%, transparent 100%);`
      : `none`};
  border-radius: 1rem;
  opacity: 0.33;
  z-index: -1;
`;

const Container = styled(Card)`
  position: relative;

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
      title={
        <div>
          <TokenPair
            symbols={[
              feederPool.masset.token.symbol,
              feederPool.fasset.token.symbol,
            ]}
            isLarge={isLarge}
          />
          {feederPool.title}
        </div>
      }
      iconType={(!isLarge && 'chevron') || undefined}
      onClick={(!isLarge && handleClick) || undefined}
    >
      <Background gradientColor={!deprecated ? gradientColor : undefined} />
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

export const EarnCard: FC<Omit<Props, 'poolAddress'> & { title: string }> = ({
  className,
  title,
  children,
}) => {
  const massetName = useSelectedMassetName();
  const history = useHistory();
  return (
    <Container
      className={className}
      title={title}
      iconType="chevron"
      onClick={() => history.push(`/${massetName}/earn/`)}
    >
      <Background gradientColor="#eba062" />
      {children}
    </Container>
  );
};

export const CustomAssetCard: FC<
  Omit<Props, 'poolAddress'> & { title: string }
> = ({ className, title, children }) => (
  <Container className={className} title={title}>
    {children}
  </Container>
);
