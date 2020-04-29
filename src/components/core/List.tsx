import styled from 'styled-components';
import { mapSizeToFontSize, Size } from '../../theme';

export const ListItem = styled.li<{ size?: Size; inverted?: boolean }>`
  font-size: ${({ theme, size = theme.size.m }) => mapSizeToFontSize(size)};
`;

export const List = styled.ul<{ inverted?: boolean }>`
  ${ListItem} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  }
`;
