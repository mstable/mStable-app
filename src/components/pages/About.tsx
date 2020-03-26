import React, { FC } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../theme';
import { H3, P } from '../core/Typography';

const Container = styled.div``;

const Row = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (min-width: ${ViewportWidth.m}) {
    width: 75%;
  }
`;

export const About: FC<{}> = () => (
  <Container>
    <Row>
      <H3>Swap stablecoins</H3>
      <P>About this business</P>
    </Row>
    <Row>
      <H3>Save and gain interest</H3>
      <P>About this business</P>
    </Row>
    <Row>
      <H3>Earn rewards</H3>
      <P>About this business</P>
    </Row>
  </Container>
);
