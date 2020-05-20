import React, { FC, SVGProps } from 'react';
import styled from 'styled-components';
import mUSDTransparent from './mUSD.svg';
import mUSD, { ReactComponent as MusdSvg } from './mUSD-circle.svg';
import TUSD, { ReactComponent as TusdSvg } from './TUSD.svg';
import USDT, { ReactComponent as UsdtSvg } from './USDT.svg';
import USDC, { ReactComponent as UsdcSvg } from './USDC.svg';
import DAI, { ReactComponent as DaiSvg } from './DAI.svg';
import BUSD, { ReactComponent as BusdSvg } from './BUSD.svg';

interface Props {
  symbol: string;
}

type SvgProps = Props & SVGProps<never>;

type SvgComponent = FC<SVGProps<never>>;

const ICONS: Record<string, string> = {
  mUSD,
  TUSD,
  USDT,
  USDC,
  DAI,
  BUSD,
};

const SVG_ICONS: Record<string, SvgComponent> = {
  mUSD: MusdSvg as SvgComponent,
  TUSD: TusdSvg as SvgComponent,
  USDT: UsdtSvg as SvgComponent,
  USDC: UsdcSvg as SvgComponent,
  DAI: DaiSvg as SvgComponent,
  BUSD: BusdSvg as SvgComponent,
};

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const MUSDIconTransparent = (): JSX.Element => (
  <Image src={mUSDTransparent} alt="mUSD" />
);

export const TokenIcon: FC<Props> = ({ symbol }) =>
  ICONS[symbol] ? <Image alt={symbol} src={ICONS[symbol]} /> : null;

export const TokenIconSvg: FC<SvgProps> = ({ symbol, ...props }) => {
  if (!SVG_ICONS[symbol]) return null;
  const Icon = SVG_ICONS[symbol];
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon {...props} />;
};
