import React, { FC, SVGProps } from 'react';
import styled from 'styled-components';
import mUSDTransparent from './tokens/mUSD-transparent.svg';
import mUSD, { ReactComponent as MusdSvg } from './tokens/mUSD.svg';
import TUSD, { ReactComponent as TusdSvg } from './tokens/TUSD.svg';
import USDT, { ReactComponent as UsdtSvg } from './tokens/USDT.svg';
import USDC, { ReactComponent as UsdcSvg } from './tokens/USDC.svg';
import DAI, { ReactComponent as DaiSvg } from './tokens/DAI.svg';
import BUSD, { ReactComponent as BusdSvg } from './tokens/BUSD.svg';
import SUSD, { ReactComponent as SusdSvg } from './tokens/sUSD.svg';
import MTA, { ReactComponent as MtaSvg } from './tokens/MTA.svg';
import Uniswap, { ReactComponent as UniswapSvg } from './tokens/Uniswap.svg';
import Balancer, { ReactComponent as BalancerSvg } from './tokens/Balancer.svg';
import ETH, { ReactComponent as EtherSvg } from './tokens/Ether.svg';

interface Props {
  className?: string;
  symbol: string;
}

type SvgProps = Props & SVGProps<never>;

type SvgComponent = FC<SVGProps<never>>;

export const TOKEN_ICONS: Record<string, string> = {
  ETH,
  WETH: ETH,
  mUSD,
  TUSD,
  USDT,
  USDC,
  DAI,
  BUSD,
  MTA,
  SUSD,
  'UNI-V2': Uniswap,
  BAL: Balancer,
  BPT: Balancer,
  'MK-MTA': MTA,
  'MK-BAL': Balancer,
};

const SVG_ICONS: Record<string, SvgComponent> = {
  ETH: EtherSvg as SvgComponent,
  WETH: EtherSvg as SvgComponent,
  mUSD: MusdSvg as SvgComponent,
  TUSD: TusdSvg as SvgComponent,
  USDT: UsdtSvg as SvgComponent,
  USDC: UsdcSvg as SvgComponent,
  DAI: DaiSvg as SvgComponent,
  BUSD: BusdSvg as SvgComponent,
  SUSD: SusdSvg as SvgComponent,
  MTA: MtaSvg as SvgComponent,
  'UNI-V2': UniswapSvg as SvgComponent,
  BAL: BalancerSvg as SvgComponent,
  BPT: BalancerSvg as SvgComponent,
  'MK-MTA': MtaSvg as SvgComponent,
  'MK-BAL': BalancerSvg as SvgComponent,
};

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const MUSDIconTransparent = (): JSX.Element => (
  <Image src={mUSDTransparent} alt="mUSD" />
);

export const TokenIcon: FC<Props> = ({ className, symbol }) =>
  TOKEN_ICONS[symbol] ? (
    <Image alt={symbol} src={TOKEN_ICONS[symbol]} className={className} />
  ) : null;

export const TokenIconSvg: FC<SvgProps> = ({ symbol, width, height, x, y }) => {
  if (!SVG_ICONS[symbol]) return null;
  const Icon = SVG_ICONS[symbol];
  return <Icon width={width} height={height} x={x} y={y} />;
};
