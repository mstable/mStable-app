import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { CountUp, CountUpUSD } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { UserRewards } from './UserRewards';

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > button {
    width: 100%;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }
`;

const PositionContainer = styled(Card)`
  border: 1px ${({ theme }) => theme.color.bodyTransparent} solid;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h4 {
      font-weight: 600;
    }

    > div:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > div {
      flex-direction: row;
      flex-wrap: wrap;

      > div {
        flex-basis: calc(50% - 0.5rem);
      }

      > div:nth-child(even) {
        text-align: right;
      }
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      > div {
        flex-basis: 0;
        flex: 1;
      }

      > div:nth-child(even) {
        text-align: left;
      }
    }
  }
`;

const GetLPCard = styled(Card)`
  background: ${({ theme }) => theme.color.backgroundAccent};
  flex-direction: column;
  align-items: center;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: flex-start;

    > div {
      margin-bottom: 0;
    }

    > button {
      width: inherit;
    }
  }
`;

const Position: FC = () => {
  const {
    totalSupply,
    vault,
    token,
    title,
    account,
    price: currentPrice,
  } = useSelectedFeederPoolState();
  const massetPrice = useSelectedMassetPrice() ?? 1;

  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const poolTotal = totalSupply.simple;
  const poolPercentage = 100 * ((userAmount + userStakedAmount) / poolTotal);

  const feesEarned = useMemo<[number, number]>(() => {
    if (account) {
      const {
        balanceVault,
        balance,
        cumulativeEarned,
        cumulativeEarnedVault,
        price,
        priceVault,
      } = account;

      const currentEarned =
        price.simple < currentPrice.simple
          ? balance.simple * currentPrice.simple - balance.simple * price.simple
          : cumulativeEarned.simple;

      const currentEarnedVault =
        priceVault.simple < currentPrice.simple
          ? balanceVault.simple * currentPrice.simple -
            balanceVault.simple * priceVault.simple
          : cumulativeEarnedVault.simple;

      return [currentEarned, currentEarnedVault];
    }

    return [0, 0];
  }, [account, currentPrice]);

  return (
    <PositionContainer>
      <h3>My Position</h3>
      <div>
        <div>
          <h4>Pool Share</h4>
          <CountUp end={poolPercentage} decimals={4} suffix="%" />
        </div>
        <div>
          <Tooltip
            tip={`${token.symbol} $${feesEarned[0].toFixed(10)}, ${
              token.symbol
            } Vault $${feesEarned[1].toFixed(10)}`}
          >
            <h4>Fees earned</h4>
          </Tooltip>
          <CountUpUSD
            end={feesEarned[0] + feesEarned[1]}
            decimals={10}
            price={massetPrice}
          />
        </div>
        <div>
          <h4>{title} Staked</h4>
          <CountUpUSD end={userStakedAmount} price={massetPrice} />
        </div>
        <div>
          <h4>{title} Balance</h4>
          <CountUpUSD end={userAmount} price={massetPrice} />
        </div>
      </div>
    </PositionContainer>
  );
};

const GetLP: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  return (
    <GetLPCard>
      <div>
        <h3>Need {feederPool.token.symbol} tokens to stake?</h3>
        <p>
          Provide liquidity by depositing below, and stake to earn rewards in
          addition to trade fees
        </p>
      </div>
    </GetLPCard>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export const UserPosition: FC = () => {
  const { token, vault } = useSelectedFeederPoolState();

  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const showLiquidityMessage = !userAmount && !userStakedAmount;

  return (
    <Container>
      {showLiquidityMessage ? (
        <GetLP />
      ) : (
        <>
          <Position />
          <UserRewards />
        </>
      )}
    </Container>
  );
};
