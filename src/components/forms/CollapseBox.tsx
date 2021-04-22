import React, { FC } from 'react'
import styled from 'styled-components'
import { useToggle } from 'react-use'

import { UnstyledButton } from '../core/Button'
import { Chevron } from '../core/Chevron'

const Content = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  transition: all 0.25s ease;
  ${({ collapsed }) => `
    padding:${collapsed ? `0 1.25rem` : `0 1.25rem 0.75rem`};
    max-height: ${collapsed ? 0 : `auto`};
    opacity: ${collapsed ? 0 : 1};
  `};
`

const Button = styled(UnstyledButton)`
  padding: 0.75rem 1.25rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  border: 1px ${({ theme }) => theme.color.defaultBorder} solid;

  > :first-child {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
  }
`

export const CollapseBox: FC<{ title: string; className?: string }> = ({ children, title, className }) => {
  const [collapsed, toggleCollapsed] = useToggle(true)
  return (
    <Container className={className}>
      <Button onClick={toggleCollapsed}>
        <div>{title}</div>
        <Chevron direction={collapsed ? 'down' : 'up'} />
      </Button>
      <Content collapsed={collapsed}>{children}</Content>
    </Container>
  )
}
