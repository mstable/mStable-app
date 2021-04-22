import React, { FC, ReactElement } from 'react'
import styled, { keyframes } from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { UnstyledButton } from './Button'
import { ViewportWidth } from '../../theme'

export const CardButton = styled(UnstyledButton)<{
  active?: boolean
}>`
  background: ${({ theme, active }) => (active ? theme.color.backgroundAccent : 'none')};
  border-radius: 1rem;
  padding: 0.5rem 1rem;

  h3 {
    color: ${({ theme }) => theme.color.body};
    font-size: 1.125rem;
    font-weight: 600;
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-size: 1.125rem;
  }

  :hover {
    background: ${({ theme, disabled }) => !disabled && theme.color.backgroundAccent};
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
`

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  > * {
    flex: 1;
  }

  > *:not(:last-child) {
    margin-right: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
  }
`

const slideIn = keyframes`
  0% {
    transform: translateY(-25%);
    filter: blur(8px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    filter: blur(0);
    opacity: 1;
  }
`

const fadeOut = keyframes`
  0% {
    transform: translateY(0);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: translateY(25%);
    filter: blur(8px);
    opacity: 0;
  }
`

const Content = styled.div<{ open: boolean }>`
  padding: ${({ open }) => (open ? '1.75rem 1.5rem' : '0 1.5rem')};
  transition: padding 0.2s ease;
  > div {
    overflow: hidden;

    > div {
      overflow: hidden;
      transition: max-height 0.2s ease-in-out;
      transform-origin: center top;

      &.item-enter {
        animation: ${slideIn} 0.5s cubic-bezier(0.19, 1, 0.22, 1) none;
      }

      &.item-exit,
      &.item-exit-active,
      &.item-exit-done {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.2s cubic-bezier(0, 1, 0, 1);
      }

      &.item-exit {
        animation: ${fadeOut} 0.3s cubic-bezier(0.19, 1, 0.22, 1) none;
      }
    }
  }
`

const Header = styled.div<{ showBorder?: boolean }>`
  display: flex;
  border-bottom: 1px solid ${({ theme, showBorder }) => (showBorder ? theme.color.defaultBorder : 'transparent')};

  > * {
    flex: 1;
  }
`

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
`

export const TransitionCard: FC<{
  components: Record<string, ReactElement>
  selection?: string
}> = ({ components, selection, children }) => {
  return (
    <Container>
      <Header showBorder={!!selection}>{children}</Header>
      <Content open={!!selection}>
        <TransitionGroup>
          {Object.keys(components)
            .filter(type => type === selection)
            .map(type => {
              const Comp = components[type]
              return (
                <CSSTransition timeout={{ enter: 500, exit: 200 }} classNames="item" key={type}>
                  {Comp}
                </CSSTransition>
              )
            })}
        </TransitionGroup>
      </Content>
    </Container>
  )
}
