import React, { FC } from 'react';
import styled from 'styled-components';
import { H2, Linkarooni } from '../core/Typography';
import { ViewportWidth } from '../../theme';

const Row = styled.div``;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const IntroText = styled(H2)`
  font-weight: normal;
  margin-bottom: ${props => props.theme.spacing.s};

  @media (min-width: ${ViewportWidth.m}) {
    width: 75%;
  }
`;

/**
 * Placeholder component for Home.
 */
export const Home: FC<{}> = () => (
  <Container>
    <Row>
      <H2>mUSD</H2>
      <IntroText>
        The &lsquo;m&rsquo; stands for &lsquo;Massively Decentralised USD-based
        Meta-Stablecoin Dollaridoos&rsquo;
        <span role="img" aria-label="$">
          💸
        </span>
      </IntroText>
      <Linkarooni href="/about">Learn more</Linkarooni>
    </Row>
  </Container>
);
