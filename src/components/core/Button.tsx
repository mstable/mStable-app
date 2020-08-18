import { ButtonHTMLAttributes, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { A } from 'hookrouter';
import {
  Spacing,
  Size,
  mapSizeToFontSize,
  mapSizeToSpacing,
} from '../../theme';

interface Props extends ButtonHTMLAttributes<unknown> {
  inverted?: boolean;
  size?: Size;
}

export const UnstyledButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  user-select: none;
`;

const ButtonCss = css<Props>`
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
  font-size: ${({ size }) => (size ? mapSizeToFontSize(size) : '12px')};
  text-transform: uppercase;

  padding: ${({ size }) => {
    const spacing = mapSizeToSpacing(size || Size.s);
    return `calc(${spacing}/2) ${spacing}`;
  }};

  ${({ theme }) => theme.mixins.roundedBorder}
`;

export const Button = styled(UnstyledButton).attrs<ButtonHTMLAttributes<never>>(
  ({ type = 'button', ...attrs }) => ({ ...attrs, type }),
)<Props>`
  ${ButtonCss}
`;

export const ButtonLink = styled(A)<Props & ComponentProps<typeof A>>`
  ${ButtonCss}
  display: inline-flex;
`;

export const ButtonGroup = styled.div<{ spacing?: Spacing }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > * {
    margin-right: ${({ spacing }) => spacing || Spacing.s};
  }
  > :last-child {
    margin-right: 0;
  }
`;
