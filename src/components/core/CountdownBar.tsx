import React, { FC, useState, ReactElement } from 'react'
import { differenceInSeconds } from 'date-fns'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import { useInterval } from 'react-use'
import styled from 'styled-components'

interface Props {
  width?: number
  percentage?: number
  end: number
}

const Time = styled.span`
  ${({ theme }) => theme.mixins.numeric};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
`

const Progress = styled.div`
  background: ${({ theme }) => theme.color.background[3]};
  border-radius: 0.5rem;

  > div {
    background-color: rgb(62, 122, 235);
    height: 10px;
    border-radius: 1rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const CountdownBar: FC<Props> = ({ width = 150, percentage = 0, end }) => {
  const [value, setValue] = useState((percentage / 100) * width)
  const endDate = new Date(end)
  const dateDifference = differenceInSeconds(endDate, new Date())
  const timeMultiplier = 60 // minute
  const interval = ((((100 - percentage) / 100) * width) / dateDifference) * timeMultiplier

  const renderer = ({ days, hours, minutes, completed }: CountdownRenderProps): ReactElement => {
    const weeks = Math.floor(days / 7)
    const remainder = days % 7
    return (
      <Time>
        {completed ? `Complete` : `${weeks > 0 ? `${weeks}w` : ``} ${remainder > 0 ? `${remainder}d` : ``} ${hours}h ${minutes}m `}
      </Time>
    )
  }

  useInterval(() => {
    setValue(value - interval <= 0 ? 0 : value - interval)
  }, 1000 * timeMultiplier)

  return (
    <Container>
      <Progress style={{ width: `${width}px` }}>
        <div style={{ width: `${value}px` }} />
      </Progress>
      <Countdown date={end} renderer={renderer} />
    </Container>
  )
}
