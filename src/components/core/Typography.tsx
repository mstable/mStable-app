import { ComponentProps } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import { FontSize } from '../../theme';

export const P = styled.p`
  font-size: ${FontSize.m};
  line-height: 2rem;
  margin-bottom: 1rem;
`;

export const H2 = styled.h2`
  font-size: ${FontSize.xl};
  font-weight: bold;
  line-height: 3rem;
`;

export const H3 = styled.h3`
  font-weight: bold;
  font-size: ${FontSize.l};
  line-height: 3rem;
`;

export const Linkarooni = styled(A)<ComponentProps<typeof A>>`
  font-weight: bold;
  color: ${props => props.theme.color.foreground};
`;
