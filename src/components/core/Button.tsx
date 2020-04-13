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
    inverted ? theme.color.foreground : 'white'};
  border: 2px
    ${props =>
      props.inverted
        ? props.theme.color.background
        : props.theme.color.foreground}
    solid;
  border-radius: 3px;
  color: ${props =>
    props.inverted
      ? props.theme.color.background
      : props.theme.color.foreground};
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: ${props => mapSizeToFontSize(props.size)};
  outline: none;
`;
