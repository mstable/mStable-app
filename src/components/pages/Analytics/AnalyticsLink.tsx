import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import { Color, FontSize } from '../../../theme';

const Container = styled.div`
  padding: 4px 8px;
  margin: 8px 0;
  background: ${Color.white};
  border: 1px ${Color.blackTransparent} solid;
  display: inline-block;
  border-radius: 2px;
  font-size: ${FontSize.s};

  a {
    color: ${Color.offBlack};
    border-bottom: none;
    font-weight: bold;
  }
`;

type Section = 'volumes' | 'totals' | 'basket' | 'save';

export const AnalyticsLink: FC<{ section?: Section }> = () => (
  <Container>
    <A href="/analytics">
      <span role="img" aria-label="chart">
        📊
      </span>{' '}
      View analytics
    </A>
  </Container>
);
