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

const InfoMsg = styled.div`
  padding-top: 4px;
  font-size: 12px;
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    h3 {
      border-top: none;
    }
  }

  ${({ theme }) => theme.mixins.borderTop}
`;

const BalanceInfoRow = styled(InfoRow)`
  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: block;
  }
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
    // TODO - re-introduce real APY after it settles down
    // ((savingsBalance.simple || 0) * (apyPercentage || 10)) /
    ((savingsBalance.simple || 0) * 10) / 100 / 365 / 24 / 60 / 60 / 10,
    100,
  );

  return (
    <>
      <BalanceInfoRow>
        <div>
          <H3>Your mUSD savings balance</H3>
          <CreditBalance>
            <MUSDIconTransparent />
            <CountUp end={savingsBalanceIncreasing || 0} decimals={7} />
            <InfoMsg>
              This amount includes notional interest. For more information{' '}
              <a
                href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#savings-balance-increase"
                target="_blank"
                rel="noopener noreferrer"
              >
                see here
              </a>
              .
            </InfoMsg>
          </CreditBalance>
        </div>
      </BalanceInfoRow>
      <InfoRow>
        <div>
          <H3>Recent APY</H3>
          {apyPercentage ? (
            <InfoCountUp end={apyPercentage} suffix="%" decimals={2} />
          ) : (
            <Skeleton />
          )}
          {apyPercentage && apyPercentage > 25 ? (
            <InfoMsg>
              <a
                href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
                target="_blank"
                rel="noopener noreferrer"
              >
                APY is an average over the past 24 hours.
              </a>{' '}
              APY is currently artificially high due to the initial growth phase
              of mUSD and might not be representative; this should normalise
              shortly.
            </InfoMsg>
          ) : null}
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
