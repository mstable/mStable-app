import React, { FC, ReactComponentElement, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Props as DefaultTooltipContentProps } from 'recharts/types/component/DefaultTooltipContent.d';
// eslint-disable-next-line
// @ts-ignore
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';

import { useDataState } from '../../context/DataProvider/DataProvider';
import { TokenIconSvg } from '../icons/TokenIcon';
import { DataState } from '../../context/DataProvider/types';
import { BigDecimal } from '../../web3/BigDecimal';
import { Color } from '../../theme';
import { toK } from './utils';
import { RechartsContainer } from './RechartsContainer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TooltipProps = DefaultTooltipContentProps<any, any>;

type TokenSymbol = 'mUSD' | 'sUSD' | 'DAI' | 'USDT' | 'TUSD' | 'USDC' | 'BUSD';

type TokenColours = Record<TokenSymbol, string>;

const TOKEN_COLOURS: TokenColours = {
  mUSD: '#000',
  sUSD: '#1e1a31',
  BUSD: '#ebb532',
  DAI: '#EEB345',
  USDT: '#26A17B',
  TUSD: '#002868',
  USDC: '#2775CA',
};

const OVERWEIGHT_TOKEN_COLOURS: TokenColours = {
  mUSD: '#000',
  sUSD: '#0d0b15',
  BUSD: '#634f14',
  DAI: '#725621',
  USDT: '#155844',
  TUSD: '#001331',
  USDC: '#12365e',
};

const TOKEN_HATCH_COLOURS: TokenColours = {
  mUSD: '#000',
  sUSD: '#9489bf',
  BUSD: '#ffd375',
  DAI: '#e0c184',
  USDT: '#7dc6af',
  TUSD: '#96a0d7',
  USDC: '#a7c0de',
};

interface Datum {
  symbol: string;
  basketShareAsPercentage: number;
  maxWeightAsPercentage: number;
}

const Hatch = ({
  symbol,
}: {
  symbol: keyof typeof TOKEN_HATCH_COLOURS;
}): ReactComponentElement<'pattern'> => (
  <pattern
    id={`hatch-${symbol}`}
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
      style={{
        stroke: TOKEN_HATCH_COLOURS[symbol],
        strokeWidth: 4,
      }}
    />
  </pattern>
);

// Horrific typing here because recharts types are inaccurate
const CustomTooltip: FC<TooltipProps> = ((({
  active,
  payload,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
TooltipProps & { active: boolean }) => {
  if (!active) return null;
  return (
    <DefaultTooltipContent
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      payload={[
        {
          dataKey: 'vaultBalance',
          name: 'Vault balance',
          value: ((payload as NonNullable<typeof payload>)[0] as {
            payload: { vaultBalance: string };
          }).payload.vaultBalance,
        },
        ...(payload as NonNullable<typeof payload>),
      ]}
    />
  );
}) as unknown) as FC<TooltipProps>;

const Container = styled(RechartsContainer)`
  .recharts-default-tooltip > .recharts-tooltip-label {
    font-size: 18px;
    font-weight: bold;
  }

  padding: 16px 0;
`;

export const BasketStats: FC<{ simulation?: DataState }> = ({ simulation }) => {
  const dataState = useDataState();
  const bAssets = simulation?.bAssets || dataState?.bAssets || {};

  const data: Datum[] = useMemo(
    () =>
      Object.values(bAssets).map(
        ({ basketShare, maxWeight, symbol, overweight, totalVault }) => {
          const basketShareAsPercentage = basketShare.toPercent();
          const maxWeightAsPercentage = new BigDecimal(
            maxWeight,
            18,
          ).toPercent();

          // Get the remainder so that it can be stacked after the basket share
          const remainderMaxWeight = parseFloat(
            (basketShareAsPercentage > maxWeightAsPercentage
              ? 0
              : maxWeightAsPercentage - basketShareAsPercentage
            ).toFixed(2),
          );

          return {
            symbol,
            basketShareAsPercentage,
            maxWeightAsPercentage,
            remainderMaxWeight,
            overweight,
            vaultBalance: toK(totalVault.simple),
            fill: overweight
              ? OVERWEIGHT_TOKEN_COLOURS[symbol as TokenSymbol]
              : TOKEN_COLOURS[symbol as TokenSymbol],
          };
        },
      ),
    [bAssets],
  );

  return (
    <Container>
      {data && data.length ? (
        <ResponsiveContainer aspect={1.8}>
          <BarChart
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={1}
            data={data}
          >
            <defs>
              {Object.values(bAssets).map(b => (
                <Hatch key={b.symbol} symbol={b.symbol as TokenSymbol} />
              ))}
            </defs>
            <Tooltip
              cursor={false}
              separator=" "
              contentStyle={{
                fontSize: '14px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'right',
                border: 'none',
                borderRadius: '4px',
                color: Color.black,
              }}
              content={CustomTooltip}
              wrapperStyle={{
                top: 0,
                left: 0,
              }}
            />
            <XAxis
              type="number"
              unit="%"
              padding={{ left: 24 }}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="symbol"
              tickCount={data.length}
              minTickGap={0}
              axisLine={false}
              tick={({
                payload: { value },
                x,
                y,
                height,
              }: {
                payload: {
                  value: TokenSymbol;
                };
                x: number;
                y: number;
                height: number;
              }) => {
                const diameter = (height - data.length * 6) / data.length;
                return ((
                  <TokenIconSvg
                    x={x - diameter / 2}
                    y={y - diameter / 2}
                    height={diameter}
                    width={diameter}
                    symbol={value}
                    key={value}
                  />
                ) as unknown) as SVGElement;
              }}
            />
            <Bar
              type="monotone"
              dataKey="basketShareAsPercentage"
              name="Basket share"
              unit="%"
              stackId="a"
            />
            <Bar
              type="monotone"
              dataKey="remainderMaxWeight"
              name="Max weight"
              unit="%"
              stackId="a"
            >
              {data.map(({ symbol }) => (
                <Cell key={symbol} fill={`url(#hatch-${symbol})`} />
              ))}
            </Bar>
            )
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Skeleton height={132} />
      )}
    </Container>
  );
};
