import React, { FC } from 'react'
import styled from 'styled-components'
import { UnstyledButton } from './Button'
import { ReactComponent as LockIcon } from '../icons/lock-closed.svg'

interface Props {
  title: string
  content: string
  onClick: () => void
}

const Container = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 1rem;
  transition: 0.25s;

  :hover {
    background: ${({ theme }) => theme.color.background[2]};
  }

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      align-items: center;

      h3 {
        font-size: 1rem;
        font-weight: 600;
        text-align: left;
      }

      > svg {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;

        rect,
        circle,
        path {
          stroke: #f2a040;
        }
      }
    }

    span {
      font-size: 1.5rem;
      color: ${({ theme }) => theme.color.bodyAccent};
      ${({ theme }) => theme.mixins.numeric};
      margin-top: -0.5rem;
    }
  }

  > div:last-child {
    margin-top: 0.5rem;
    text-align: left;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

export const InfoButton: FC<Props> = ({ onClick, title, content }) => {
  return (
    <Container onClick={onClick}>
      <div>
        <div>
          <LockIcon />
          <h3>{title}</h3>
        </div>
        <span>↗</span>
      </div>
      <div>
        <p>{content}</p>
      </div>
    </Container>
  )
}
