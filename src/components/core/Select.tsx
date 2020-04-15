import styled from 'styled-components';
import { FontSize } from '../../theme';

interface Props {
  error?: string;
}

export const Select = styled.select<Props>`
  background: ${({ error, theme }) =>
    error ? theme.color.redTransparent : theme.color.white};
  outline: 0;
  border: 2px
    ${({ theme, error }) =>
      error ? theme.color.red : theme.color.blackTransparent}
    solid;
  border-radius: 4px;
  color: ${props => props.theme.color.foreground};
  font-size: ${FontSize.l};
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.xs};
  height: 3rem;
`;
