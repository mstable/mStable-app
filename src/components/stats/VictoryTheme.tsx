import React, { FC } from 'react';
import { VictoryThemeDefinition } from 'victory-core';

import styled from 'styled-components';
import { Color, ViewportWidth } from '../../theme';

const numericFont = `'DM Mono', monospace`;

// Labels
const baseLabelStyles = {
  fontFamily: numericFont,
  fontSize: '18px',
  padding: 0,
  fill: Color.offBlack,
  stroke: 'none',
};

const centeredLabelStyles = {
  ...baseLabelStyles,
  textAnchor: 'middle' as 'middle',
};

export const victoryTheme: VictoryThemeDefinition = {
  area: {
    style: {
      data: {
        fill: Color.white,
      },
      labels: centeredLabelStyles,
    },
  },
  axis: {
    style: {
      axis: { stroke: Color.blackTransparenter, strokeWidth: 2 },
      grid: { stroke: Color.blackTransparenter, strokeWidth: 2 },
      ticks: { stroke: Color.blackTransparenter, strokeWidth: 2, size: 10 },
      tickLabels: baseLabelStyles,
    },
  },
  bar: {
    style: {
      data: {
        fill: Color.white,
        padding: 8,
        strokeWidth: 0,
      },
      labels: baseLabelStyles,
    },
  },
  line: {
    style: {
      data: {
        fill: 'none',
        stroke: Color.white,
        strokeWidth: 2,
      },
      labels: centeredLabelStyles,
    },
  },
  tooltip: {
    style: { ...centeredLabelStyles, padding: 5, pointerEvents: 'none' },
    flyoutStyle: {
      stroke: 'none',
      fill: 'none',
      pointerEvents: 'none',
    },
    cornerRadius: 0,
    pointerLength: 0,
  },
  voronoi: {
    style: {
      data: {
        fill: 'none',
        stroke: 'none',
        strokeWidth: 0,
      },
      labels: {
        ...baseLabelStyles,
        padding: 2,
        pointerEvents: 'none',
      },
      flyout: {
        padding: 2,
        stroke: 'none',
        fill: 'none',
        pointerEvents: 'none',
        filter: 'url(#solid)',
      },
    },
  },
};

export const ResponsiveVictoryContainer = styled.div`
  svg {
    tspan,
    text {
      font-size: 12px !important;

      @media (min-width: ${ViewportWidth.m}) {
        font-size: 10px !important;
      }
      @media (min-width: ${ViewportWidth.l}) {
        font-size: 8px !important;
      }
      @media (min-width: ${ViewportWidth.xl}) {
        font-size: 6px !important;
      }
    }
  }
`;

export const VictoryFilters: FC<{}> = () => (
  <defs>
    <filter x="0" y="0" width="1" height="1" id="solid">
      <feFlood floodColor={Color.white} />
      <feComposite in="SourceGraphic" operator="xor" />
    </filter>
  </defs>
);
