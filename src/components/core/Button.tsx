import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Size, mapSizeToFontSize, ViewportWidth } from '../../theme';

interface Props extends ButtonHTMLAttributes<unknown> {
  size: Size;
  inverted?: boolean;
}

export const UnstyledButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
`;

export const Button = styled(UnstyledButton)<Props>`
  background: ${({ inverted, theme }) =>
    inverted ? theme.color.offBlack : theme.color.white};
  border-radius: 3px;
  color: ${({ inverted, theme, disabled }) =>
    inverted
      ? disabled
        ? theme.color.whiteTransparent
        : theme.color.white
      : disabled
      ? theme.color.blackTransparent
      : theme.color.offBlack};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: ${props => mapSizeToFontSize(props.size)};

  @media (min-width: ${ViewportWidth.m}) {
    padding: ${({ theme }) => theme.spacing.xs};
  }

  ${({ theme }) => theme.mixins.roundedBorder}
`;
