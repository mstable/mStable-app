import React, { FC } from 'react';
import styled from 'styled-components';
import CountUp from 'react-countup';

import { useAvailableSaveApy } from '../../../hooks/useAvailableSaveApy';
import { ThemedSkeleton } from '../../core/ThemedSkeleton';

const SaveAPYContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    margin: 0;
    text-align: right;
    justify-content: flex-end;
  }
`;

const InfoCountUp = styled(CountUp)`
  font-size: 1.5rem;
  font-family: 'DM Mono', monospace;
  color: ${({ theme }) => theme.color.primary};
`;

const InfoMsg = styled.div`
  padding-top: 4px;
  font-size: 12px;
  max-width: 25ch;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    max-width: 20ch;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    max-width: inherit;
  }

  a {
    color: ${({ theme }) => theme.color.greyTransparent};
    border: none;

    :hover {
      color: ${({ theme }) => theme.color.gold};
    }
  }
`;

export const WeeklySaveAPY: FC = () => {
  const apy = useAvailableSaveApy();
  return (
    <SaveAPYContainer>
      {apy.type === 'fetching' ? (
        <ThemedSkeleton height={42} width={100} />
      ) : apy.type === 'inactive' ? (
        <InfoMsg>Not receiving interest</InfoMsg>
      ) : apy.type === 'bootstrapping' || apy.value === 0 ? (
        <InfoMsg>APY not available yet</InfoMsg>
      ) : (
        <>
          <InfoCountUp end={apy?.value} suffix="%" decimals={2} />
          <InfoMsg>
            {' '}
            <a
              href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
              target="_blank"
              rel="noopener noreferrer"
            >
              {apy.type === 'average'
                ? 'Average daily APY over the last 7 days'
                : 'Live APY (unstable)'}
            </a>
          </InfoMsg>
        </>
      )}
    </SaveAPYContainer>
  );
};
