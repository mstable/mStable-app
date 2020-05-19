/* eslint-disable react/jsx-props-no-spreading */

import React, { ComponentProps, FC, useMemo } from 'react';
import { VictoryBar } from 'victory-bar';
import { VictoryChart } from 'victory-chart';
import { VictoryStack } from 'victory-stack';
import { VictoryAxis } from 'victory-axis';
import {
  VictoryLabel,
  VictoryContainerProps,
  VictoryContainer,
} from 'victory-core';
import { useMusdData } from '../../context/DataProvider/DataProvider';
import { TokenIconSvg } from '../icons/TokenIcon';
import { convertExactToPercent } from '../../web3/maths';

const TOKEN_COLORS = {
  mUSD: '#000',
  DAI: '#EEB345',
  USDT: '#26A17B',
  TUSD: '#002868',
  USDC: '#2775CA',
};

interface Datum {
  symbol: string;
  basketShareAsPercentage: number;
  maxWeightAsPercentage: number;
}

const ICON_SIZE = 16;

const numericLabels = {
  fontFamily: `'DM Mono', monospace`,
  fontSize: 8,
};

const AxisLabel: FC<ComponentProps<typeof VictoryLabel>> = ({
  text,
  x,
  y,
  style,
  ...props
}) => (
  <g>
    <TokenIconSvg
      width={ICON_SIZE}
      height={ICON_SIZE}
      x={0}
      y={(y || 0) - ICON_SIZE / 2}
      symbol={text as string}
    />
    <VictoryLabel
      text={text}
      x={x}
      y={y}
      dx={16}
      style={{ ...style, textAnchor: 'start' }}
      {...props}
    />
  </g>
);

const Container: FC<VictoryContainerProps> = ({ children, ...props }) => (
  <VictoryContainer {...props}>
    <pattern
      id="diagonalHatch"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45 0 0)"
      width="4"
      height="4"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="4"
        style={{ stroke: '#d5d5d5', strokeWidth: 2 }}
      />
    </pattern>
    <>{children}</>
  </VictoryContainer>
);

export const BasketStats: FC<{}> = () => {
  const { bAssets } = useMusdData();
  const data: Datum[] = useMemo(
    () =>
      bAssets
        .filter(b => b.vaultBalance && b.token.symbol)
        .map(({ basketShare, maxWeight, token: { symbol } }) => {
          const basketShareAsPercentage = convertExactToPercent(basketShare);
          const maxWeightAsPercentage = convertExactToPercent(
            maxWeight as string,
          );
          // Get the remainder so that it can be stacked after the basket share
          const remainderMaxWeight =
            maxWeightAsPercentage - basketShareAsPercentage;
          return {
            symbol: symbol as string,
            basketShareAsPercentage,
            maxWeightAsPercentage: remainderMaxWeight,
          };
        }),
    [bAssets],
  );

  return data.length > 0 ? (
    <VictoryChart
      containerComponent={<Container />}
      height={100}
      width={200}
      padding={{ left: 20, top: 16, bottom: 16, right: 40 }}
    >
      <VictoryStack horizontal>
        <VictoryBar
          style={{
            data: {
              fill: ({ datum: { symbol } }) =>
                TOKEN_COLORS[symbol as keyof typeof TOKEN_COLORS],
            },
            labels: numericLabels,
          }}
          labelComponent={<VictoryLabel dx={5} />}
          labels={({ datum: { basketShareAsPercentage } }: { datum: Datum }) =>
            `${basketShareAsPercentage.toFixed(2)}%`
          }
          barRatio={1.8}
          data={data}
          x="symbol"
          y="basketShareAsPercentage"
        />
        <VictoryBar
          style={{
            data: {
              fill: 'url(#diagonalHatch)',
            },
          }}
          labelComponent={<div />}
          barRatio={1.8}
          data={data}
          x="symbol"
          y="maxWeightAsPercentage"
        />
      </VictoryStack>
      <VictoryAxis
        tickLabelComponent={<AxisLabel />}
        style={{
          axis: { stroke: 'none' },
          tickLabels: {
            fontFamily: `'Poppins-Bold', sans-serif`,
            fontWeight: 'bold',
            fontSize: 12,
            fill: '#fff',
            textAnchor: 'start',
          },
        }}
      />
    </VictoryChart>
  ) : null;
};
