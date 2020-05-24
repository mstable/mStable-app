import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useWallet } from 'use-wallet';
import { formatUnits } from 'ethers/utils';
import { H3 } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { FontSize } from '../../../theme';
import {
  useApy,
  useIncreasingNumber,
  useSavingsBalance,
} from '../../../web3/hooks';
import {
  useMusdData,
  useMusdSavings,
} from '../../../context/DataProvider/DataProvider';

const CreditBalance = styled.div`
  line-height: 4em;

  img {
    width: 6vw;
    margin-right: 10px;
  }

  span {
    font-weight: bold;
    font-size: 6vw;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    span {
      font-size: 3.5vw;
    }

    img {
      width: 2.5vw;
    }
  }
`;

const InfoCountUp = styled(CountUp)`
  font-size: ${FontSize.xl};
`;

const InfoRow = styled.div`
  text-align: center;
  width: 100%;

  h3 {
    padding-bottom: 10px;
  }

  > div {
    padding: 10px 0 20px 0;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      border-top: none;
    }

    > div {
      flex-grow: 1;
    }
  }

  ${({ theme }) => theme.mixins.borderTop}
`;

export const SaveInfo: FC<{}> = () => {
  const { account } = useWallet();
  const mUsd = useMusdData();
  const mUsdSavings = useMusdSavings();

  const apy = useApy();
  const apyPercentage = useMemo<number | null>(
    () => (apy ? parseFloat(formatUnits(apy, 16)) : null),
    [apy],
  );

  const savingsBalance = useSavingsBalance(account);
  const savingsBalanceIncreasing = useIncreasingNumber(
    savingsBalance.simple,
    // Calculate the increase per 100ms for this APY
    savingsBalance.simple && apyPercentage
      ? (savingsBalance.simple * apyPercentage) / 100 / 365 / 24 / 60 / 60 / 10
      : 0.0000001,
    100,
  );

  return (
    <>
      <InfoRow>
        <div>
          <H3>Your mUSD savings balance</H3>
          <CreditBalance>
            <MUSDIconTransparent />
            <CountUp end={savingsBalanceIncreasing || 0} decimals={7} />
          </CreditBalance>
        </div>
      </InfoRow>
      <InfoRow>
        <div>
          <H3>Current APY (24h)</H3>
          {apyPercentage ? (
            <InfoCountUp end={apyPercentage} suffix="%" decimals={2} />
          ) : (
            <Skeleton />
          )}
        </div>
        <div>
          <H3 borderTop>Total mUSD supply</H3>
          {mUsd?.token.totalSupply ? (
            <InfoCountUp
              end={parseFloat(mUsd?.token.totalSupply)}
              decimals={2}
            />
          ) : (
            <Skeleton />
          )}
        </div>
        <div>
          <H3 borderTop>Total mUSD savings</H3>
          {mUsdSavings?.totalSavings ? (
            <InfoCountUp
              end={parseFloat(mUsdSavings.totalSavings)}
              decimals={2}
            />
          ) : (
            <Skeleton />
          )}
        </div>
      </InfoRow>
    </>
  );
};
