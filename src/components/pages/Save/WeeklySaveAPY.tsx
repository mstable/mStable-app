import React, { FC } from 'react';
import styled from 'styled-components';
import CountUp from 'react-countup';

import { useAvailableSaveApy } from '../../../hooks/useAvailableSaveApy';
import { ThemedSkeleton } from '../../core/ThemedSkeleton';
import {
  formatMassetName,
  useSelectedMassetName,
} from '../../../context/SelectedMassetNameProvider';

const InfoAPY = styled.div`
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 0.25rem;

  a {
    color: ${({ theme }) => theme.color.greyTransparent};
    border: none;

    :hover {
      color: ${({ theme }) => theme.color.gold};
    }
  }
`;

const InfoCountUp = styled(CountUp)`
  font-size: 1.125rem;
  font-family: 'DM Mono', monospace;
  color: ${({ theme }) => theme.color.primary};
`;

const InfoMsg = styled.div`
  font-size: 1.125rem;
  max-width: 25ch;
  color: ${({ theme }) => theme.color.bodyAccent};

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    max-width: 20ch;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    max-width: inherit;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  flex: 1;

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    margin: 0;
    text-align: center;
  }
`;

export const WeeklySaveAPY: FC = () => {
  const apy = useAvailableSaveApy();
  const massetName = useSelectedMassetName();
  const formattedMasset = formatMassetName(massetName);
  return (
    <Container>
      {apy.type === 'fetching' ? (
        <ThemedSkeleton height={42} width={100} />
      ) : apy.type === 'inactive' ? (
        <InfoMsg>Not receiving interest</InfoMsg>
      ) : apy.type === 'bootstrapping' || apy.value === 0 ? (
        <div>
          <InfoMsg>APY not available yet.</InfoMsg>
          <InfoMsg>
            Save V1 APY: <CountUp end={apy.v1Apy} suffix="%" decimals={2} />
          </InfoMsg>
        </div>
      ) : (
        <>
          <p>
            Earn <InfoCountUp end={apy?.value} suffix="%" decimals={2} />* on
            your {formattedMasset}
          </p>

          <InfoAPY>
            {' '}
            <a
              href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
              target="_blank"
              rel="noopener noreferrer"
            >
              {apy.type === 'average'
                ? '*Average APY over the last 7 days'
                : '*Live APY (unstable)'}
            </a>
          </InfoAPY>
        </>
      )}
    </Container>
  );
};
