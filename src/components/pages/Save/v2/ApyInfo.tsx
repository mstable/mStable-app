import React, { FC } from 'react';
import styled from 'styled-components';
import { DailyApys } from '../../../stats/DailyApys';
import { WeeklySaveAPY } from '../WeeklySaveAPY';

const Chart = styled(DailyApys)`
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 12rem;

  > div:first-child {
    flex-basis: calc(60% - 0.5rem);
    padding-right: 2rem;
  }
  > div:last-child {
    flex-basis: calc(40% - 0.5rem);
  }
`;

export const ApyInfo: FC = () => {
  return (
    <Container>
      <WeeklySaveAPY />
      <Chart hideControls shimmerHeight={180} tick={false} />
    </Container>
  );
};
