import React, { FC, ReactElement, RefObject, useLayoutEffect, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import useOnClickOutside from 'use-onclickoutside'
import { CSSTransition } from 'react-transition-group'

import { ViewportWidth } from '../../theme'

import { UnstyledButton } from './Button'

interface Props {
  className?: string
  title: ReactElement | string
  hideModal?(): void
  open: boolean
  onExited(): void
}

const Title = styled.div`
  flex-grow: 1;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`

const Header = styled.div`
  position: relative;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px ${({ theme }) => theme.color.defaultBorder} solid;

  > div:last-child {
    position: absolute;
    right: 1rem;
  }
`

const CloseButton = styled(UnstyledButton)`
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;

  :hover {
    background: ${({ theme }) => theme.color.backgroundAccent};
  }
`

const Body = styled.div``

const Container = styled.div`
  /* position: relative; */
  /* overflow-y: scroll; */
  /* width: 100%; */
  /* max-height: calc(90vh - 50px); */
  /* background: ${({ theme }) => theme.color.background}; */
  /* border-radius: 1rem; */
  /* border: 1px ${({ theme }) => theme.color.backgroundAccent} solid; */

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  width: inherit;
  max-width: inherit;
  box-sizing: border-box;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  transition: all ease-in;
  background: ${({ theme }) => theme.color.background};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  overflow: hidden;

  @media (min-width: ${ViewportWidth.m}) {
    margin: 0 2rem;
    max-width: 44rem;
    position: relative;
    border-radius: 1rem;
    padding-bottom: 0;
  }
`

const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: ${({ theme }) => (theme.isLight ? `rgba(0, 0, 0, 0.5)` : `rgba(0, 0, 0, 0.75)`)};
  
  @supports (backdrop-filter: blur(0.25em)) {
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(0.25em);
  }
}
`

const scale = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const Animation = styled(CSSTransition)<{ classNames: string }>`
  transform-origin: 50% 50%;
  &.item-enter-active {
    animation: ${css`
        ${scale}`} 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &.item-exit-active {
    animation: ${css`
        ${scale}`} 0.4s cubic-bezier(0.19, 1, 0.22, 1) reverse;
  }
`

export const Modal: FC<Props> = ({ children, title, className, hideModal, open, onExited }) => {
  const fixedRef = useRef<HTMLDivElement>(null as never)
  const modalRef = useRef<HTMLDivElement>(null as never)

  useOnClickOutside(modalRef as RefObject<HTMLDivElement>, event => {
    if (event.target === fixedRef.current) {
      hideModal?.()
    }
  })

  useLayoutEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        hideModal?.()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [hideModal])

  return (
    <FixedContainer ref={fixedRef}>
      <Animation classNames="item" timeout={400} unmountOnExit in={open} onExited={onExited}>
        <Container className={className} ref={modalRef}>
          <Header>
            <Title>{title}</Title>
            {hideModal && (
              <div>
                <CloseButton onClick={hideModal}>✕</CloseButton>
              </div>
            )}
          </Header>
          <Body>{children}</Body>
        </Container>
      </Animation>
    </FixedContainer>
  )
}
