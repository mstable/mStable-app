import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  value?: number;
  max?: number;
  min?: number;
  color?: string;
  highlight?: string;
}

const HEIGHT = 5;
const WIDTH = 100;

const Container = styled.svg`
  g > rect {
    transition: width 0.5s ease-in-out;
  }
`;

export const ProgressBar: FC<Props> = ({
  value = 0,
  max = 1,
  min = 0,
  color = '#67C73A',
  highlight = '#77D16F',
}) => {
  return (
    <Container
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      color={color}
    >
      <pattern
        id="hatch"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45 0 0)"
        width="4"
        height="4"
      >
        <rect x={0} y={0} width={4} height={4} fill={color} />
        <animateTransform
          attributeType="xml"
          attributeName="patternTransform"
          type="translateX"
          from="4"
          to="0"
          begin="0"
          dur="0.5s"
          repeatCount="indefinite"
          additive="sum"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="4"
          style={{
            stroke: highlight,
            strokeWidth: 4,
          }}
        />
      </pattern>
      <g>
        <rect
          width={WIDTH}
          height={HEIGHT}
          x={0}
          y={0}
          rx={HEIGHT / 2}
          ry={HEIGHT / 2}
          fill="#f8f8f8"
          stroke="#eee"
        />
        <rect
          width={Math.max(((value - min) / (max - min)) * WIDTH, HEIGHT)}
          height={HEIGHT}
          x={0}
          y={0}
          rx={HEIGHT / 2}
          ry={HEIGHT / 2}
          fill="url(#hatch)"
        />
      </g>
    </Container>
  );
};
