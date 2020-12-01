import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';

import { H3 } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { FontSize } from '../../../theme';
import { useAverageApyForPastWeek } from '../../../web3/hooks';
import { useSavingsBalance } from '../../../context/DataProvider/DataProvider';
import { AnalyticsLink } from '../Analytics/AnalyticsLink';
import { SaveVersion } from '../../../types';
import { BubbleButton } from '../../core/Button';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';

const { CURRENT } = SaveVersion;

const CreditBalance = styled.div`
  img {
    width: 6vw;
    margin-right: 10px;
  }

  span {
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

const WarningMsg = styled.div`
  padding-top: 4px;
  font-size: 12px;
  background: #ffeaea;
  color: #de1717;
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  width: fit-content;
  margin: 1rem auto;
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
  padding: 1.5rem 0;

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: block;
  }
`;

interface Props {
  version: SaveVersion;
  onMigrateClick: () => void;
}

const StyledWarningBadge = styled(WarningBadge)`
  width: 1.5rem;
  height: 1.5rem;
  vertical-align: top;
`;

export const SaveInfo: FC<Props> = ({ version, onMigrateClick }) => {
  const apyForPastWeek = useAverageApyForPastWeek();
  const savingsBalance = useSavingsBalance();
  const isCurrentVersion = version === CURRENT;

  return (
    <>
      <BalanceInfoRow>
        <div>
          <H3>
            Your <b>mUSD</b> savings balance
          </H3>
          <CreditBalance>
            <MUSDIconTransparent />
            <CountUp end={savingsBalance?.balance?.simple || 0} decimals={7} />
            {isCurrentVersion ? (
              <InfoMsg>
                See how interest is calculated{' '}
                <a
                  href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#savings-balance-increase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </InfoMsg>
            ) : (
              <>
                <StyledWarningBadge />
                <WarningMsg>
                  Migrate your <b>mUSD</b> to continue earning interest on your
                  balance.
                </WarningMsg>
                <BubbleButton highlighted scale={1.15} onClick={onMigrateClick}>
                  Migrate
                </BubbleButton>
              </>
            )}
          </CreditBalance>
        </div>
      </BalanceInfoRow>
      <InfoRow>
        <div>
          <H3>APY</H3>
          {apyForPastWeek ? (
            <>
              <InfoCountUp end={apyForPastWeek} suffix="%" decimals={2} />
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
            <Skeleton height={48} />
          )}
          <div>
            <AnalyticsLink section="save" />
          </div>
        </div>
      </InfoRow>
    </>
  );
};
