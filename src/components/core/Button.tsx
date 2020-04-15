import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Size, mapSizeToFontSize } from '../../theme';

interface Props extends ButtonHTMLAttributes<unknown> {
  size: Size;
  inverted?: boolean;
}

export const Button = styled.button<Props>`
  appearance: none;
  background: ${({ inverted, theme }) =>
    inverted ? theme.color.foreground : theme.color.white};
  border: 2px
    ${({ inverted, theme }) =>
      inverted ? theme.color.background : theme.color.foreground}
    solid;
  border-radius: 3px;
  color: ${({ inverted, theme }) =>
    inverted ? theme.color.background : theme.color.foreground};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: ${props => mapSizeToFontSize(props.size)};
  outline: none;
`;
