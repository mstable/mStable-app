import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { ViewportWidth } from '../../../../theme';
import { CountUp } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;

    > div {
      flex-basis: calc(33.3% - 0.5rem);
      justify-content: center;
      align-items: center;
    }

    h4 {
      font-weight: 600;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > div > div {
      display: flex;
      flex-direction: column;

      > div {
        flex-basis: calc(50% - 0.5rem);
      }

      > div:nth-child(even) {
        text-align: right;
      }
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div > div {
      > div {
        flex-basis: 0;
        flex: 1;
      }

      > div:nth-child(even) {
        text-align: center;
      }
    }
  }
`;

export const Position: FC = () => {
  const { totalSupply, vault, token, account, price: currentPrice } =
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
          <CountUp
            end={(feesEarned[0] + feesEarned[1]) * massetPrice}
            decimals={2}
            prefix="$"
          />
        </div>
        <div>
          <h4>Unstaked Balance</h4>
          <CountUp end={userAmount * massetPrice} prefix="$" decimals={2} />
        </div>
      </div>
    </Container>
  );
};
