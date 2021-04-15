import React, { FC } from 'react';
import styled from 'styled-components';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { ViewportWidth } from '../../../../theme';
import { CountUp } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';
import { DailyApys } from '../../../stats/DailyApys';
import { useOnboarding } from '../hooks';
import { Button } from '../../../core/Button';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider';

const APYChart = styled(DailyApys)`
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  overflow: hidden;
`;

const ApyTip = styled(Tooltip)`
  font-weight: 600;
  font-size: 1.25rem;

  > span > span {
    font-weight: normal;
    font-size: 1.125rem;
  }
`;

const APYText = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem 1rem 0;
  font-size: 1.25rem;
  align-items: flex-start;
`;

const InfoLink = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  height: 2rem;
  width: 2rem;
  ${({ theme }) => theme.mixins.numeric};

  a {
    pointer-events: auto;
    height: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.color.body};
    font-size: 1.125rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
  }

  > div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    background: ${({ theme }) =>
      `linear-gradient(180deg, rgba(210,172,235,0.3) 0%, ${theme.color.background} 100%)`};
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.color.accent};

    button {
      margin-top: 0.25rem;
      border-color: rgba(210, 172, 235, 0.25);
      background: rgba(210, 172, 235, 0.1);
      font-size: 0.875rem;
      align-self: flex-end;

      span {
        opacity: 0.675;
      }
    }

    button:hover {
      span {
        opacity: 1;
      }
    }

    > * {
      z-index: 1;
    }

    h2 {
      font-size: 1.25rem;
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

export const OnboardingBanner: FC = () => {
  const saveApy = useAvailableSaveApy();
  const [onboarding, toggleOnboarding] = useOnboarding();
  const massetName = useSelectedMassetName();
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const isSaveV1 = selectedSaveVersion === 1;

  const tip =
    massetName === 'mbtc'
      ? 'This APY is purely derived from internal swap fees, and is not reflective of future rates.'
      : 'This APY is derived from internal swap fees and lending markets, and is not reflective of future rates.';

  return (
    <Container>
      <div>
        <div>
          <h2>
            {massetName === 'mbtc'
              ? 'Safely put your BTC to work in DeFi.'
              : 'The best passive savings account in DeFi.'}
          </h2>
          <h3>Secure, high yielding, dependable.</h3>
        </div>
        {!isSaveV1 && (
          <Button onClick={toggleOnboarding}>
            <span>{onboarding ? 'Back to form' : 'How to use Save'}</span>
          </Button>
        )}
      </div>
      <div>
        <APYChart
          hideControls
          shimmerHeight={138}
          tick={false}
          marginTop={48}
          aspect={2.25}
          color="#d2aceb"
        />
        <APYText>
          <ApyTip tip={tip}>
            <CountUp end={saveApy.value ?? 0} suffix="% APY" />
          </ApyTip>
          <Tooltip tip="Learn about how this is calculated" hideIcon>
            <InfoLink>
              <a
                href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗
              </a>
            </InfoLink>
          </Tooltip>
        </APYText>
      </div>
    </Container>
  );
};
