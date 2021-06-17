/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react'
import styled from 'styled-components'
import ReactSlider from 'react-slider'

interface Props {
  min: number
  max: number
  value: number
  onChange(value: number): void
  step: number
  error?: string
  intervals?: number
}

const StyledThumb = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  margin-top: -2px;
  text-align: center;
  background: white;
  border-radius: 50%;
  cursor: grab;
  z-index: 2;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.color.bodyAccent[3]};
`

const StyledTrack = styled.div<{ index: number }>`
  height: 1rem;
  background: ${({ index, theme }) => (index === 1 ? theme.color.background[3] : theme.color.blue)};
  border-radius: 0.5rem;
`

const StyledMark = styled.div`
  width: 1px;
  height: 1rem;
  background-color: #000;
  opacity: 0.125;
  cursor: pointer;
`

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 2rem;
`

const renderThumb: FC = props => <StyledThumb {...props} />
const renderTrack: FC = (props, state) => <StyledTrack {...props} index={state.index} />
const renderMark: FC = props => <StyledMark {...props} />

export const Slider: FC<Props> = ({ min, max, value, step, intervals = 10, onChange }) => {
  const markRange = intervals ? Array.from(Array(intervals - 1).keys()).map(i => min + min * ((i + 1) / 100)) : undefined
  return (
    <StyledSlider
      marks={markRange}
      renderTrack={renderTrack}
      renderThumb={renderThumb}
      renderMark={renderMark}
      onChange={v => onChange(v as number)}
      min={min}
      max={max}
      step={step}
      value={value}
    />
  )
}
