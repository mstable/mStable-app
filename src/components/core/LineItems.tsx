import React, { ComponentProps, FC } from 'react';
import styled from 'styled-components';

import { CountUp } from './CountUp';
import { Token } from './Token';
import { ViewportWidth } from '../../theme';

interface Props {
  symbol: string;
  data: {
    countUp: ComponentProps<typeof CountUp>;
    highlight?: boolean;
    id: string;
    label: string;
  }[];
}

const Label = styled.div`
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const LineItem = styled.div<{ highlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  border-top: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  padding: 4px 0;

  :first-child {
    border-top: none;
  }

  ${Label} {
    font-weight: ${({ highlight }) => (highlight ? 'bold' : 'initial')};
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  background: white;
  border: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  border-radius: 2px;
  padding: 8px;

  > :first-child {
    grid-area: 1 / 1 / 4 / 4;
  }

  > :last-child {
    grid-area: 1 / 4 / 4 / 9;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > :first-child {
      grid-area: 1 / 1 / 3 / 3;
    }

    > :last-child {
      grid-area: 1 / 3 / 3 / 9;
    }
  }
`;

export const LineItems: FC<Props> = ({ data, symbol }) => (
  <Container>
    <div>
      <Token symbol={symbol} />
    </div>
    <div>
      {data.map(({ id, label, countUp, highlight }) => (
        <LineItem key={id} highlight={highlight}>
          <Label>{label}</Label>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <CountUp {...countUp} />
        </LineItem>
      ))}
    </div>
  </Container>
);
