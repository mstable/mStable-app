import React, { FC, useMemo } from 'react';
import CountUp from 'react-countup';
import styled from 'styled-components';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { ViewportWidth } from '../../../../theme';
import { CountUpUSD } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h4 {
      font-weight: 600;
    }

    > div:not(:last-child) {
      margin-bottom: 1rem;
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
  }
`;

export const Position: FC = () => {
  const { totalSupply, vault, token, title, account, price: currentPrice } =
    useSelectedFeederPoolState() ?? {};
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
    <Container>
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
    </Container>
  );
};
