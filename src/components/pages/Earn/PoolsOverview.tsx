import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useStakingRewardsContracts } from '../../../context/earn/EarnDataProvider';
import { Color } from '../../../theme';
import { Table } from '../../core/Table';
import { TokenAmount } from '../../core/TokenAmount';
import { Amount, NumberFormat } from '../../core/Amount';
import { H3 } from '../../core/Typography';
import { PLATFORM_METADATA } from './constants';
import { BigDecimal } from '../../../web3/BigDecimal';

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TableGroup = styled.div`
  border-top: 1px ${Color.blackTransparenter} solid;
  margin-bottom: 64px;
`;

enum Columns {
  StakingToken,
  Collateral,
  // StakingApy,
  RewardsApy,
  WeeklyRewards,
}

const COLUMNS = [
  {
    key: Columns.StakingToken,
    title: 'Staking token',
    tip: 'The token staked to earn rewards',
  },
  {
    key: Columns.Collateral,
    title: 'Collateral',
    tip:
      'The collateral contributed to the pool in order to get the staking token',
  },
  // {
  //   key: Columns.StakingApy,
  //   title: 'Staking APY',
  //   tip:
  //     'The Annual Percentage Yield the pool is currently generating from the staking token itself',
  // },
  {
    key: Columns.RewardsApy,
    title: 'Rewards APY',
    tip:
      'The Annual Percentage Yield the pool is currently generating from the combined rewards token(s)',
  },
  {
    key: Columns.WeeklyRewards,
    title: 'Weekly rewards',
    tip: 'The weekly rewards made available to the pool',
  },
];

// FIXME
const totalCollateralPlaceholder = BigDecimal.parse('11000000', 18);

export const PoolsOverview: FC<{}> = () => {
  const stakingRewardsContracts = useStakingRewardsContracts();

  const items = useMemo(
    () =>
      Object.values(stakingRewardsContracts).map(stakingRewardsContract => {
        const {
          address: id,
          platformRewards,
          totalStakingRewards,
          rewardsToken,
          pool,
          earnUrl,
        } = stakingRewardsContract;
        const { colors, getPlatformLink } = PLATFORM_METADATA[pool.platform];

        return COLUMNS.reduce(
          (_item, { key }) => {
            const value = (() => {
              switch (key) {
                // case Columns.StakingApy:
                //   return (
                //     <Amount
                //       amount={stakingRewardsContract.stakingTokenApy}
                //       format={NumberFormat.Percentage}
                //     />
                //   );
                case Columns.RewardsApy:
                  return (
                    <Amount
                      amount={stakingRewardsContract.combinedRewardsTokensApy}
                      format={NumberFormat.Percentage}
                    />
                  );
                case Columns.Collateral:
                  return (
                    <>
                      <div>
                        <span>
                          $
                          <Amount
                            format={NumberFormat.Abbreviated}
                            amount={totalCollateralPlaceholder}
                          />
                          total
                        </span>
                      </div>
                      {pool.tokens.map(
                        ({ address, symbol, liquidity, price }) => (
                          <TokenAmount
                            key={address}
                            symbol={symbol}
                            format={NumberFormat.Abbreviated}
                            amount={liquidity}
                            price={price}
                          />
                        ),
                      )}
                    </>
                  );
                case Columns.StakingToken:
                  return (
                    <TokenAmount
                      href={getPlatformLink(stakingRewardsContract)}
                      symbol={stakingRewardsContract.stakingToken.symbol}
                      format={NumberFormat.Abbreviated}
                      price={stakingRewardsContract.stakingToken.price}
                      address={stakingRewardsContract.address}
                    />
                  );
                case Columns.WeeklyRewards:
                  return (
                    <>
                      <TokenAmount
                        amount={totalStakingRewards}
                        format={NumberFormat.Abbreviated}
                        symbol={rewardsToken.symbol}
                      />
                      {platformRewards ? (
                        <TokenAmount
                          amount={platformRewards.totalPlatformRewards}
                          format={NumberFormat.Abbreviated}
                          symbol={platformRewards.platformToken.symbol}
                        />
                      ) : null}
                    </>
                  );
                default:
                  throw new Error('Unhandled key');
              }
            })();
            return { ..._item, data: { ..._item.data, [key]: value } };
          },
          { id, url: earnUrl, colors, data: {} },
        );
      }),
    [stakingRewardsContracts],
  );

  return (
    <Container>
      {Object.keys(stakingRewardsContracts).length === 0 ? (
        <Skeleton height={112} />
      ) : (
        <TableGroup>
          <H3>Ecosystem</H3>
          <Table columns={COLUMNS} items={items} />
        </TableGroup>
      )}
    </Container>
  );
};
