import styled from 'styled-components';
import { FontSize, mapSizeToFontSize, Size } from '../../theme';

export const P = styled.p<{ center?: boolean; size?: Size }>`
  font-size: ${({ theme, size = theme.size.m }) => mapSizeToFontSize(size)};
  padding-top: 4px;
  padding-bottom: 12px;
  
  &:last-of-type {
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mixins.textAlign}
`;

export const H2 = styled.h2<{ center?: boolean; borderTop?: boolean }>`
  font-size: ${FontSize.l};
  font-weight: bold;
  line-height: 1.5rem;
  padding-top: 4px;
  padding-bottom: 12px;

  ${({ theme }) => theme.mixins.textAlign}
  ${({ theme, borderTop }) => (borderTop ? theme.mixins.borderTop : '')}
`;

export const H3 = styled.h3<{ borderTop?: boolean }>`
  font-size: ${FontSize.l};
  line-height: 1.5rem;
  padding-top: 4px;
  padding-bottom: 12px;

  ${({ theme, borderTop }) => (borderTop ? theme.mixins.borderTop : '')}
`;

export const H4 = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
`;
