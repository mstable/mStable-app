import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  padding: ${props => props.theme.spacing.s} ${props => props.theme.spacing.l};
`;

/**
 * Placeholder component for footer.
 */
export const Footer: FC<{}> = () => (
  <Container>Footer content placeholder</Container>
);
