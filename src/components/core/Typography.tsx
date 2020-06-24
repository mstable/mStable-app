import styled from 'styled-components';
import { FontSize, mapSizeToFontSize, Size } from '../../theme';

export const P = styled.p<{ center?: boolean; size?: Size }>`
  font-size: ${({ theme, size = theme.size.m }) => mapSizeToFontSize(size)};
  line-height: 1.5rem;
  padding-bottom: 1rem;

  ${({ theme }) => theme.mixins.textAlign}
`;

export const H2 = styled.h2<{ center?: boolean; borderTop?: boolean }>`
  font-size: ${FontSize.l};
  font-weight: bold;
  line-height: 3rem;

  ${({ theme }) => theme.mixins.textAlign}
  ${({ theme, borderTop }) => borderTop ? theme.mixins.borderTop : ''}
`;

export const H3 = styled.h3<{ borderTop?: boolean }>`
  font-size: ${FontSize.l};
  line-height: 2.5rem;

  ${({ theme, borderTop }) => borderTop ? theme.mixins.borderTop: ''}
`;
