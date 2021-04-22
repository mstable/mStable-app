import React, { FC } from 'react'
import styled from 'styled-components'
import { useThemeMode } from '../../context/AppProvider'
import { colorTheme } from '../../theme'

interface Props {
  value?: number
  max?: number
  min?: number
  hue?: number
  lightness?: number
}

const HEIGHT = 5
const WIDTH = 100

const Container = styled.svg`
  g > rect {
    transition: width 0.5s ease-in-out;
  }
  g > g {
    transition: transform 0.5s ease-in-out;
  }
`

export const ProgressBar: FC<Props> = ({ max = 1, min = 0, value = min, hue = 90, lightness = 50 }) => {
  const themeMode = useThemeMode()
  const scaledValue = (value - min) / (max - min)
  const progressWidth = Math.max(scaledValue * WIDTH, HEIGHT * 2)
  return (
    <Container viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" patternTransform="rotate(135 0 0)" width="4" height="4">
          <rect x={0} y={0} width={4} height={4} fill={`hsl(${hue},85%,${lightness}%)`} />
          <animateTransform
            attributeType="xml"
            attributeName="patternTransform"
            type="translateX"
            from="4"
            to="0"
            begin="0"
            dur="1s"
            repeatCount="indefinite"
            additive="sum"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="4"
            style={{
              stroke: `hsl(${hue},85%,${lightness - 4}%)`,
              strokeWidth: 4,
            }}
          />
        </pattern>
      </defs>
      <g>
        <rect width={WIDTH} height={HEIGHT} x={0} y={0} rx={HEIGHT / 2} ry={HEIGHT / 2} fill={colorTheme(themeMode).backgroundAccent} />
        <rect width={progressWidth} height={HEIGHT} x={0} y={0} rx={HEIGHT / 2} ry={HEIGHT / 2} fill="url(#hatch)" />
        <g transform={`translate(${progressWidth - 2.25}, 0)`}>
          <text
            x={0}
            y={HEIGHT / 2}
            alignmentBaseline="central"
            fontSize={3}
            fontFamily="'DM Mono', monospace"
            fontWeight="bold"
            fill="white"
            textAnchor="end"
          >
            {value.toFixed(2)}
          </text>
        </g>
      </g>
    </Container>
  )
}
