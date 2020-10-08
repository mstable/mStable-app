import { ButtonHTMLAttributes, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface Props extends ButtonHTMLAttributes<unknown> {
  inverted?: boolean;
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
  font-size: 12px;
  text-transform: uppercase;

  padding: 8px 16px;

  ${({ theme }) => theme.mixins.roundedBorder}
`;

export const Button = styled(UnstyledButton).attrs<ButtonHTMLAttributes<never>>(
  ({ type = 'button', ...attrs }) => ({ ...attrs, type }),
)<Props>`
  ${ButtonCss}
`;

export const ButtonLink = styled(Link)<Props & ComponentProps<typeof Link>>`
  ${ButtonCss}
`;
