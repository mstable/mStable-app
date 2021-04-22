import React, { FC } from 'react'
import styled from 'styled-components'

import { StepProps, Step } from './Step'

export interface Props {
  steps: StepProps[]
  pending: boolean
}

const Container = styled.div`
  position: relative;
  z-index: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:before {
    position: absolute;
    width: 0.25rem;
    top: 0;
    bottom: 0;
    background: ${({ theme }) => theme.color.bodyTransparenter};
    content: '';
    z-index: -1;
    left: 1rem;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    &:before {
      left: 1.75rem;
      width: 0.25rem;
    }
  }
`

export const Steps: FC<Props> = ({ steps }) => {
  const activeStep = steps.filter(step => !step.complete)?.[0] ?? steps[steps.length - 1]

  return (
    <Container>
      {steps.map(({ options, complete, key }) => (
        <Step key={key} active={activeStep.key === key} complete={complete} options={options} />
      ))}
    </Container>
  )
}
