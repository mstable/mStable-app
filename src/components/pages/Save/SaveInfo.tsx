import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';
import { H3 } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { FontSize } from '../../../theme';
import {
  // useApyForPast24h,
  useAverageApyForPastWeek,
  useIncreasingNumber,
} from '../../../web3/hooks';
import { useSavingsBalance } from '../../../context/DataProvider/DataProvider';
import { AnalyticsLink } from '../Analytics/AnalyticsLink';

const CreditBalance = styled.div`
  img {
    width: 6vw;
    margin-right: 10px;
  }

  span {
    font-weight: bold;
    font-size: 6vw;
    line-height: 1em;
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

  > div {
    border-top: 1px ${({ theme }) => theme.color.blackTransparent} solid;
    padding: 8px 0;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: flex;
    justify-content: space-evenly;

    border-top: 1px ${({ theme }) => theme.color.blackTransparent} solid;

    > div {
      border-top: 0;
      padding: 8px 16px;
    }
  }
`;

const BalanceInfoRow = styled(InfoRow)`
  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: block;
  }
`;

export const SaveInfo: FC<{}> = () => {
  // const apyForPast24h = useApyForPast24h();
  const apyForPastWeek = useAverageApyForPastWeek();

  const formattedApys = useMemo<{ pastWeek?: number; past24h?: number }>(
    () => ({
      // past24h: apyForPast24h
      //   ? parseFloat(formatUnits(apyForPast24h, 16))
      //   : undefined,
      pastWeek: apyForPastWeek
        ? parseFloat(formatUnits(apyForPastWeek, 16))
        : undefined,
    }),
    [apyForPastWeek],
  );

  const savingsBalance = useSavingsBalance();
  const clampedBalance =
    savingsBalance?.balance?.simple || 0 > 500
      ? 500
      : savingsBalance?.balance?.simple || 0;

  const savingsBalanceIncreasing = useIncreasingNumber(
    savingsBalance?.balance?.simple || 0,
    // TODO - re-introduce real APY after it settles down
    // ((savingsBalance.simple || 0) * (apyPercentage || 10)) /
    (clampedBalance * 10) / 100 / 365 / 24 / 60 / 60 / 10,
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
          <H3>APY</H3>
          {formattedApys.pastWeek ? (
            <>
              <InfoCountUp
                end={formattedApys.pastWeek}
                suffix="%"
                decimals={2}
              />
              <InfoMsg>
                {' '}
                <a
                  href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Average daily APY over the past 7 days
                </a>
              </InfoMsg>
            </>
          ) : (
            <Skeleton />
          )}
          <div>
            <AnalyticsLink section="save" />
          </div>
        </div>
      </InfoRow>
    </>
  );
};
