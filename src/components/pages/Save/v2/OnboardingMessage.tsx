import React, { FC } from 'react';
import styled from 'styled-components';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { ViewportWidth } from '../../../../theme';
import { CountUp } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';
import { DailyApys } from '../../../stats/DailyApys';

const APYChart = styled(DailyApys)`
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  overflow: hidden;
`;

const ApyTip = styled(Tooltip)`
  > span > span > span {
    font-size: 1.5rem;
    font-weight: normal;

    > span {
      font-size: 1rem;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
  }

  > div:first-child {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid ${({ theme }) => theme.color.accent};
    margin-bottom: 1rem;

    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: ${({ theme }) =>
        `linear-gradient(180deg, #d2aceb 0%, ${theme.color.background} 100%)`};
      border-radius: 1rem;
      opacity: 0.33;
    }

    > * {
      z-index: 1;
    }

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${({ theme }) => theme.color.body};
    }

    h3 {
      font-size: 1rem;
      color: ${({ theme }) => theme.color.body};
      opacity: 0.675;
      margin-top: 0.625rem;
    }
  }

  > div:last-child {
    position: relative;
    z-index: 1;

    > :last-child {
      position: absolute;
      top: 0;
      left: 0;
      padding: 1rem;
      font-size: 1.25rem;

      span {
        font-size: 1.25rem;
      }
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    flex-direction: row;
    justify-content: space-between;

    max-height: 10rem;

    > div {
      flex: 0;
    }

    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
      margin-bottom: 0;
    }

    > div:last-child {
      flex-basis: calc(35% - 0.5rem);
    }
  }
`;

export const OnboardingMessage: FC = () => {
  const saveApy = useAvailableSaveApy();
  return (
    <Container>
      <div>
        <h2>The best passive savings account in DeFi.</h2>
        <h3>Secure, high yielding, dependable.</h3>
      </div>
      <div>
        <APYChart
          hideControls
          shimmerHeight={160}
          tick={false}
          marginTop={48}
          color="#d2aceb"
        />
        <div>
          <ApyTip tip="7-day MA (Moving Average) APY">
            <CountUp end={saveApy?.value ?? 0} suffix="%" /> <span>APY</span>
          </ApyTip>
        </div>
      </div>
    </Container>
  );
};
