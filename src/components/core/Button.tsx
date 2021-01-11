import { ButtonHTMLAttributes, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface Props extends ButtonHTMLAttributes<unknown> {
  highlighted?: boolean;
  scale?: number;
  disabled?: boolean;
}

const ButtonCss = css<Props>`
  font-size: ${({ scale }) => (scale ? `${scale}rem` : `1rem`)};
  padding: ${({ scale }) =>
    scale ? `${scale * 0.75}em ${scale * 1.5}em` : `1rem`};
  border-radius: 1.5em;
  background: ${({ theme, highlighted }) =>
    highlighted ? theme.color.blue : `#eee`};
  color: ${({ theme, highlighted }) =>
    highlighted ? theme.color.white : theme.color.grey};
  z-index: ${({ highlighted }) => (highlighted ? 1 : 0)};
  font-weight: 600;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: 0.2s ease all;

  svg circle {
    stroke: rgba(255, 255, 255, 0.4);
  }

  :hover {
    ${({ disabled, theme, highlighted }) =>
      !disabled && {
        background: `${highlighted ? theme.color.gold : `#eee`}`,
        color: `${highlighted ? theme.color.white : theme.color.black}`,
      }}
  }
`;

export const UnstyledButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  user-select: none;
`;

export const Button = styled(UnstyledButton).attrs<ButtonHTMLAttributes<never>>(
  ({ type = 'button', ...attrs }) => ({ ...attrs, type }),
)<Props>`
  ${ButtonCss}
`;

export const ButtonLink = styled(Link)<Props & ComponentProps<typeof Link>>`
  ${ButtonCss}
`;
