import { ButtonHTMLAttributes, ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

interface Props extends ButtonHTMLAttributes<unknown> {
  highlighted?: boolean
  transparent?: boolean
  scale?: number
  disabled?: boolean
}

const ButtonCss = css<Props>`
  font-size: ${({ scale }) => (scale ? `${scale}rem` : `1rem`)};
  padding: ${({ scale }) => (scale ? `${scale * 0.75}em ${scale * 1.5}em` : `0.5rem 1.25rem`)};
  border-radius: 1.5em;
  background: ${({ theme, highlighted, transparent, disabled }) =>
    highlighted ? theme.color.primary : transparent ? 'transparent' : disabled ? theme.color.disabledButton : theme.color.backgroundAccent};
  color: ${({ theme, highlighted, disabled }) => (highlighted ? theme.color.white : disabled ? theme.color.disabled : theme.color.body)};
  z-index: ${({ highlighted }) => (highlighted ? 1 : 0)};
  font-weight: 600;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: 0.2s ease all;
  border: 1px solid ${({ transparent, theme }) => (transparent ? theme.color.defaultBorder : 'transparent')};

  svg {
    rect {
      fill: ${({ theme, highlighted }) => (highlighted ? theme.color.white : theme.color.grey)};
    }
  }

  &:hover {
    ${({ disabled, theme, highlighted }) =>
      !disabled && {
        background: `${highlighted && theme.color.gold}`,
        color: `${highlighted ? theme.color.white : theme.color.gold}`,
      }}
  }
`

export const UnstyledButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  user-select: none;
  cursor: pointer;
`

export const Button = styled(UnstyledButton).attrs<ButtonHTMLAttributes<never>>(({ type = 'button', ...attrs }) => ({
  ...attrs,
  type,
}))<Props>`
  ${ButtonCss}
`

export const ButtonLink = styled(Link)<Props & ComponentProps<typeof Link>>`
  ${ButtonCss}
`
