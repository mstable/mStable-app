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
    inverted ? theme.color.black : theme.color.white};
  border-radius: 3px;
  color: ${({ inverted, theme }) =>
    inverted ? theme.color.white : theme.color.black};
  cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: ${props => mapSizeToFontSize(props.size)};
  outline: none;

  @media (min-width: ${ViewportWidth.m}) {
    padding: ${({theme}) => theme.spacing.xs};
  }

  ${({theme}) => theme.mixins.roundedBorder}
`;
