import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { navigate } from 'hookrouter';
import { Amount, NumberFormat } from '../../core/Amount';
import { TokenAmount } from '../../core/TokenAmount';
import { TOKEN_ICONS } from '../../icons/TokenIcon';
import { Color } from '../../../theme';
import { StakingRewardsContract } from '../../../context/earn/types';
import {
  usePlatformToken,
  useRewardsToken,
  useStakingRewardsContract,
  useStakingToken,
} from '../../../context/earn/EarnDataProvider';

import { PlatformMetadata } from './types';
import { PLATFORM_METADATA } from './constants';
import { BigDecimal } from '../../../web3/BigDecimal';
import { Tooltip } from '../../core/ReactTooltip';

interface Props {
  address: string;
  linkToPool?: boolean;
}

const Heading = styled.h4`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
`;

const StyledTokenAmount = styled(TokenAmount)``;

const StyledAmount = styled(Amount)``;

const TokenAmounts = styled.div``;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  > :first-child {
    text-align: left;
  }

  > :last-child {
    text-align: right;

    ${StyledAmount} {
      > span {
        flex-direction: row-reverse;
      }
    }

    ${StyledTokenAmount} {
      flex-direction: row-reverse;
      > :first-child {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }
`;

const Container = styled.div<{
  colors: PlatformMetadata['colors'];
  stakingToken?: keyof typeof TOKEN_ICONS;
  linkToPool?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  margin-top: 16px;
  justify-content: space-between;
  padding: 16px;
  min-width: 300px;
  width: 100%;
  max-width: 344px;
  min-height: 225px;
  background-image: ${({ colors: { base, accent }, stakingToken }) =>
    stakingToken
      ? `url(${TOKEN_ICONS[stakingToken]}), linear-gradient(to top right, ${base}, ${accent})`
      : 'none'};
  background-size: contain;
  background-position: center center;
  background-blend-mode: soft-light;
  background-repeat: no-repeat;
  border-radius: 4px;
  box-shadow: ${Color.blackTransparent} 0 4px 16px;
  color: ${({ colors: { text } }) => text};
  cursor: ${({ linkToPool }) => (linkToPool ? 'pointer' : 'auto')};

  ${StyledTokenAmount} {
    color: ${({ colors: { text } }) => text};
    a {
      color: ${({ colors: { text } }) => text};
    }
    svg {
      path {
        fill: ${({ colors: { text } }) => text};
      }
    }
  }
`;

// FIXME
const totalCollateralPlaceholder = BigDecimal.parse('1000000', 18);

export const Card: FC<Props> = ({ address, linkToPool }) => {
  const stakingRewardsContract = useStakingRewardsContract(
    address,
  ) as StakingRewardsContract;

  const { colors, getPlatformLink } = PLATFORM_METADATA[
    stakingRewardsContract.pool.platform
  ];

  const rewardsToken = useRewardsToken(address);
  const stakingToken = useStakingToken(address);
  const platformToken = usePlatformToken(address);

  const handleClick = useCallback(
    event => {
      if (linkToPool) {
        event.stopPropagation();
        navigate(stakingRewardsContract.earnUrl);
      }
    },
    [linkToPool, stakingRewardsContract.earnUrl],
  );

  return (
    <Container
      colors={colors}
      stakingToken={stakingToken?.symbol}
      onClick={handleClick}
      linkToPool={linkToPool}
    >
      {stakingToken && rewardsToken ? (
        <Content>
          <Column>
            <div>
              <Tooltip tip="The token staked to earn rewards">
                <Heading>Staking token</Heading>
              </Tooltip>
              <div>
                <StyledTokenAmount
                  href={getPlatformLink(stakingRewardsContract)}
                  symbol={stakingToken.symbol}
                  format={NumberFormat.Abbreviated}
                  price={stakingToken.price}
                  address={stakingRewardsContract.address}
                />
              </div>
            </div>
            <div>
              <div>
                <Tooltip tip="The collateral contributed to the pool in order to get the staking token">
                  <Heading>Collateral</Heading>
                </Tooltip>
              </div>
              <span>
                $
                <Amount
                  format={NumberFormat.Abbreviated}
                  amount={totalCollateralPlaceholder}
                />
                total
              </span>
              <TokenAmounts>
                {stakingRewardsContract.pool.tokens.map(
                  ({ price, liquidity, symbol }) => (
                    <StyledTokenAmount
                      key={symbol}
                      symbol={symbol}
                      format={NumberFormat.Abbreviated}
                      amount={liquidity}
                      price={price}
                    />
                  ),
                )}
              </TokenAmounts>
            </div>
          </Column>
          <Column>
            {/* <div> */}
            {/*   <Heading>Staking APY</Heading> */}
            {/*   <div> */}
            {/*     <StyledAmount */}
            {/*       format={NumberFormat.CountupPercentage} */}
            {/*       amount={stakingRewardsContract.stakingTokenApy} */}
            {/*     /> */}
            {/*   </div> */}
            {/* </div> */}
            <div>
              <Tooltip tip="The Annual Percentage Yield the pool is currently generating from the combined rewards token(s)">
                <Heading>
                  {rewardsToken.symbol}
                  {platformToken ? `/${platformToken.symbol}` : ''} APY
                </Heading>
              </Tooltip>
              <div>
                <StyledAmount
                  format={NumberFormat.CountupPercentage}
                  amount={stakingRewardsContract.combinedRewardsTokensApy}
                />
              </div>
            </div>
            <div>
              <Tooltip tip="The weekly rewards made available to the pool">
                <Heading>Weekly rewards</Heading>
              </Tooltip>
              <TokenAmounts>
                <StyledTokenAmount
                  amount={stakingRewardsContract.totalStakingRewards}
                  format={NumberFormat.Abbreviated}
                  symbol={rewardsToken.symbol}
                />
                {stakingRewardsContract.platformRewards && platformToken ? (
                  <StyledTokenAmount
                    amount={
                      stakingRewardsContract.platformRewards
                        ?.totalPlatformRewards
                    }
                    format={NumberFormat.Abbreviated}
                    symbol={platformToken.symbol}
                  />
                ) : null}
              </TokenAmounts>
            </div>
          </Column>
        </Content>
      ) : (
        <Skeleton height={240} />
      )}
    </Container>
  );
};
