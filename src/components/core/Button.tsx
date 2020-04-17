import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Size, mapSizeToFontSize, ViewportWidth } from '../../theme';

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
  cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: ${props => mapSizeToFontSize(props.size)};
  outline: none;

  @media (min-width: ${ViewportWidth.m}) {
    padding: ${({theme}) => theme.spacing.xs};
  }
`;
