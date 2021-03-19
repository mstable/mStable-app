import React, { FC, SVGProps } from 'react';
import styled from 'styled-components';
import mUSDTransparent from './tokens/mUSD-transparent.svg';
import MUSD, { ReactComponent as MusdSvg } from './tokens/mUSD.svg';
import MBTC, { ReactComponent as MbtcSvg } from './tokens/mBTC.svg';
import TUSD, { ReactComponent as TusdSvg } from './tokens/TUSD.svg';
import USDT, { ReactComponent as UsdtSvg } from './tokens/USDT.svg';
import USDC, { ReactComponent as UsdcSvg } from './tokens/USDC.svg';
import DAI, { ReactComponent as DaiSvg } from './tokens/DAI.svg';
import BUSD, { ReactComponent as BusdSvg } from './tokens/BUSD.svg';
import SUSD, { ReactComponent as SusdSvg } from './tokens/sUSD.svg';
import CRV, { ReactComponent as CrvSvg } from './tokens/CRV.svg';
import MUSD3CRV, { ReactComponent as Musd3CrvSvg } from './tokens/musd3CRV.svg';
import Curve3Pool, {
  ReactComponent as Curve3PoolSvg,
} from './tokens/3pool.svg';
import MTA, { ReactComponent as MtaSvg } from './tokens/MTA.svg';
import Uniswap, { ReactComponent as UniswapSvg } from './tokens/Uniswap.svg';
import Balancer, { ReactComponent as BalancerSvg } from './tokens/Balancer.svg';
import ETH, { ReactComponent as EtherSvg } from './tokens/Ether.svg';
import IMUSD, { ReactComponent as ImusdSvg } from './tokens/imUSD.svg';
import IMBTC, { ReactComponent as ImbtcSvg } from './tokens/imBTC.svg';
import VMTA, { ReactComponent as VmtaSvg } from './tokens/vMTA.svg';
import RENBTC, { ReactComponent as RenbtcSvg } from './tokens/renBTC.svg';
import WBTC, { ReactComponent as WbtcSvg } from './tokens/wBTC.svg';
import SBTC, { ReactComponent as SbtcSvg } from './tokens/sBTC.svg';
import IMUSDMTA, {
  ReactComponent as ImusdmtaSvg,
} from './tokens/imusd-mta.svg';
import Sushi, { ReactComponent as SushiSvg } from './tokens/Sushi.svg';
import BADGER, { ReactComponent as BadgerSvg } from './tokens/Badger.svg';
import CREAM, { ReactComponent as CreamSvg } from './tokens/Cream.svg';
import FAKE, { ReactComponent as FakeSvg } from './tokens/FAKE.svg';
import IMBTCMTA, {
  ReactComponent as ImbtcmtaSvg,
} from './tokens/imbtc-mta.svg';

interface Props {
  className?: string;
  symbol: string;
}

type SvgProps = Props & SVGProps<never>;

type SvgComponent = FC<SVGProps<never>>;

export const TOKEN_ICONS: Record<string, string> = {
  ETH,
  WETH: ETH,
  MUSD,
  MBTC,
  TUSD,
  USDT,
  USDC,
  DAI,
  BUSD,
  MTA,
  SUSD,
  CRV,
  '3POOL': Curve3Pool,
  MUSD3CRV,
  'UNI-V2': Uniswap,
  BAL: Balancer,
  BPT: Balancer,
  'MK-MTA': MTA,
  'MK-BAL': Balancer,
  IMUSD,
  VMTA,
  RENBTC,
  WBTC,
  SBTC,
  IMBTC,
  IMUSDMTA,
  SUSHI: Sushi,
  SLP: Sushi,
  BADGER,
  CREAM,
  IMBTCMTA,
  FAST: FAKE,
};

const SVG_ICONS: Record<string, SvgComponent> = {
  ETH: EtherSvg as SvgComponent,
  WETH: EtherSvg as SvgComponent,
  MUSD: MusdSvg as SvgComponent,
  MBTC: MbtcSvg as SvgComponent,
  TUSD: TusdSvg as SvgComponent,
  USDT: UsdtSvg as SvgComponent,
  USDC: UsdcSvg as SvgComponent,
  DAI: DaiSvg as SvgComponent,
  BUSD: BusdSvg as SvgComponent,
  SUSD: SusdSvg as SvgComponent,
  CRV: CrvSvg as SvgComponent,
  '3POOL': Curve3PoolSvg as SvgComponent,
  MUSD3CRV: Musd3CrvSvg as SvgComponent,
  MTA: MtaSvg as SvgComponent,
  'UNI-V2': UniswapSvg as SvgComponent,
  BAL: BalancerSvg as SvgComponent,
  BPT: BalancerSvg as SvgComponent,
  'MK-MTA': MtaSvg as SvgComponent,
  'MK-BAL': BalancerSvg as SvgComponent,
  IMUSD: ImusdSvg as SvgComponent,
  VMTA: VmtaSvg as SvgComponent,
  RENBTC: RenbtcSvg as SvgComponent,
  WBTC: WbtcSvg as SvgComponent,
  SBTC: SbtcSvg as SvgComponent,
  IMBTC: ImbtcSvg as SvgComponent,
  IMUSDMTA: ImusdmtaSvg as SvgComponent,
  SUSHI: SushiSvg as SvgComponent,
  SLP: SushiSvg as SvgComponent,
  BADGER: BadgerSvg as SvgComponent,
  CREAM: CreamSvg as SvgComponent,
  IMBTCMTA: ImbtcmtaSvg as SvgComponent,
  FAST: FakeSvg as SvgComponent,
};

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const MUSDIconTransparent = (): JSX.Element => (
  <img src={mUSDTransparent} alt="mUSD" />
);

export const TokenIcon: FC<Props> = ({ className, symbol }) =>
  TOKEN_ICONS[symbol.toUpperCase()] ? (
    <Image
      alt={symbol}
      src={TOKEN_ICONS[symbol.toUpperCase()]}
      className={className}
    />
  ) : null;

export const TokenIconSvg: FC<SvgProps> = ({
  symbol,
  width,
  height,
  x,
  y,
  className,
}) => {
  if (!SVG_ICONS[symbol.toUpperCase()]) return null;
  const Icon = SVG_ICONS[symbol.toUpperCase()];
  return (
    <Icon width={width} height={height} x={x} y={y} className={className} />
  );
};
