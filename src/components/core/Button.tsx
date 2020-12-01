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

export const BubbleButton = styled(UnstyledButton)<{
  highlighted?: boolean;
  scale?: number;
}>`
  font-size: ${({ scale }) => (scale ? `${scale}rem` : `1rem`)};
  padding: 0.75em 1.5em;
  border-radius: 1.5em;
  background: ${({ theme, highlighted }) =>
    highlighted ? theme.color.blue : `#eee`};
  color: ${({ theme, highlighted }) =>
    highlighted ? theme.color.white : theme.color.black};
  z-index: ${({ highlighted }) => (highlighted ? 2 : 1)};
  font-weight: 600;
  position: relative;
  cursor: pointer;
  transition: 0.5s linear text-decoration;

  :hover {
    text-decoration: ${({ theme, highlighted }) => !highlighted && `underline`};
    color: ${({ theme, highlighted }) =>
      highlighted ? theme.color.white : theme.color.black};
  }
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
