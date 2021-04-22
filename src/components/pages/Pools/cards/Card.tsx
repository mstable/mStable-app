import React, { FC, ReactElement } from 'react'
import styled, { css } from 'styled-components'

import { ReactComponent as CheckmarkIcon } from '../../../icons/checkmark.svg'
import { ReactComponent as ChevronIcon } from '../../../icons/chevron-down.svg'
import { UnstyledButton } from '../../../core/Button'

interface Props {
  className?: string
  title?: ReactElement | string
  iconType?: 'checkmark' | 'chevron'
  onClick?: () => void
  gradientColor?: string
}

const Icon = styled.div<{ isChevron?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s ease all;
  margin-left: 1rem;

  svg {
    width: 1rem;
    height: 1rem;
    transform: ${({ isChevron }) => (isChevron ? `rotate(-90deg)` : `auto`)};

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`

const Background = styled.div<{ gradientColor?: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ gradientColor, theme }) =>
    gradientColor ? `linear-gradient(180deg, ${gradientColor} 0%, ${theme.color.background} 100%);` : `none`};
  border-radius: 1rem;
  opacity: 0.33;
`

const ContainerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  justify-content: flex-start;
  transition: 0.25s ease all;

  > div {
    display: flex;
    justify-content: space-between;
  }

  > div:not(:last-child) {
    align-items: center;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.color.body};
  }
`

const ContainerButton = styled(UnstyledButton)`
  ${ContainerStyle};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 0;

  &:before {
    content: ' ';
    position: absolute;
    border-radius: 1rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: opacity 250ms;
  }

  :hover:before {
    opacity: 1;
  }
`

const Container = styled.div`
  ${ContainerStyle};
`

const CardContent: FC<Props> = props => {
  const { title, children, iconType } = props
  return (
    <>
      {(title || iconType) && (
        <div>
          <h2>{title}</h2>
          {iconType && (
            <Icon className="icon" isChevron={iconType === 'chevron'}>
              {iconType === 'checkmark' ? <CheckmarkIcon /> : <ChevronIcon />}
            </Icon>
          )}
        </div>
      )}
      {children && <div>{children}</div>}
    </>
  )
}

export const Card: FC<Props> = ({ className, onClick, children, title, iconType, gradientColor }) => {
  return onClick ? (
    <ContainerButton className={className} onClick={onClick}>
      {gradientColor && <Background gradientColor={gradientColor} />}
      <CardContent title={title} iconType={iconType}>
        {children}
      </CardContent>
    </ContainerButton>
  ) : (
    <Container className={className}>
      {gradientColor && <Background gradientColor={gradientColor} />}
      <CardContent title={title} iconType={iconType}>
        {children}
      </CardContent>
    </Container>
  )
}
