import React, { FC, SVGProps } from 'react'
import styled from 'styled-components'
import MUSD, { ReactComponent as MusdSvg } from './tokens/mUSD.svg'
import MBTC, { ReactComponent as MbtcSvg } from './tokens/mBTC.svg'
import TUSD, { ReactComponent as TusdSvg } from './tokens/TUSD.svg'
import USDT, { ReactComponent as UsdtSvg } from './tokens/USDT.svg'
import USDC, { ReactComponent as UsdcSvg } from './tokens/USDC.svg'
import DAI, { ReactComponent as DaiSvg } from './tokens/DAI.svg'
import BUSD, { ReactComponent as BusdSvg } from './tokens/BUSD.svg'
import SUSD, { ReactComponent as SusdSvg } from './tokens/sUSD.svg'
import GUSD, { ReactComponent as GusdSvg } from './tokens/GUSD.svg'
import CRV, { ReactComponent as CrvSvg } from './tokens/CRV.svg'
import MUSD3CRV, { ReactComponent as Musd3CrvSvg } from './tokens/musd3CRV.svg'
import Curve3Pool, { ReactComponent as Curve3PoolSvg } from './tokens/3pool.svg'
import MTA, { ReactComponent as MtaSvg } from './tokens/MTA.svg'
import Uniswap, { ReactComponent as UniswapSvg } from './tokens/Uniswap.svg'
import Balancer, { ReactComponent as BalancerSvg } from './tokens/Balancer.svg'
import ETH, { ReactComponent as EtherSvg } from './tokens/Ether.svg'
import IMUSD, { ReactComponent as ImusdSvg } from './tokens/imUSD.svg'
import IMBTC, { ReactComponent as ImbtcSvg } from './tokens/imBTC.svg'
import VMTA, { ReactComponent as VmtaSvg } from './tokens/vMTA.svg'
import RENBTC, { ReactComponent as RenbtcSvg } from './tokens/renBTC.svg'
import WBTC, { ReactComponent as WbtcSvg } from './tokens/wBTC.svg'
import SBTC, { ReactComponent as SbtcSvg } from './tokens/sBTC.svg'
import IMUSDMTA, { ReactComponent as ImusdmtaSvg } from './tokens/imusd-mta.svg'
import Sushi, { ReactComponent as SushiSvg } from './tokens/Sushi.svg'
import BADGER, { ReactComponent as BadgerSvg } from './tokens/Badger.svg'
import CREAM, { ReactComponent as CreamSvg } from './tokens/Cream.svg'
import FAKE, { ReactComponent as FakeSvg } from './tokens/FAKE.svg'
import HBTC, { ReactComponent as HbtcSvg } from './tokens/HBTC.svg'
import TBTC, { ReactComponent as TbtcSvg } from './tokens/tBTC.svg'
import VAULT, { ReactComponent as VaultSvg } from './tokens/vault.svg'
import IMBTCMTA, { ReactComponent as ImbtcmtaSvg } from './tokens/imbtc-mta.svg'
import ETHEREUM, { ReactComponent as EthereumSvg } from './networks/Ethereum.svg'
import POLYGON, { ReactComponent as PolygonSvg } from './networks/Polygon.svg'
import { Networks, useNetwork } from '../../context/NetworkProvider'

interface Props {
  className?: string
  symbol?: string
  hideNetwork?: boolean
}

type SvgProps = Props & SVGProps<never>

type SvgComponent = FC<SVGProps<never>>

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
  'V-IMUSD': VAULT,
  VMTA,
  RENBTC,
  WBTC,
  SBTC,
  IMBTC,
  'V-IMBTC': VAULT,
  IMUSDMTA,
  SUSHI: Sushi,
  SLP: Sushi,
  BADGER,
  CREAM,
  IMBTCMTA,
  FAST: FAKE,
  GUSD,
  HBTC,
  TBTC,
  FPMUSD: MUSD,
  FPMBTC: MUSD,
  VAULT,
  ETHEREUM,
  POLYGON,
  MATIC: POLYGON,
}

const SVG_ICONS: Record<string, SvgComponent> = {
  ETH: EtherSvg as SvgComponent,
  WETH: EtherSvg as SvgComponent,
  MUSD: MusdSvg as SvgComponent,
  FPMUSD: MusdSvg as SvgComponent,
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
  'V-IMUSD': ImusdSvg as SvgComponent,
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
  GUSD: GusdSvg as SvgComponent,
  HBTC: HbtcSvg as SvgComponent,
  TBTC: TbtcSvg as SvgComponent,
  VAULT: VaultSvg as SvgComponent,
  ETHEREUM: EthereumSvg as SvgComponent,
  POLYGON: PolygonSvg as SvgComponent,
  MATIC: PolygonSvg as SvgComponent,
}

const IconContainer = styled.div<{ isLarge: boolean }>`
  display: flex;

  img {
    height: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    width: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    border-radius: ${({ isLarge }) => (isLarge ? `1.25rem` : `1rem`)};
    background: ${({ theme }) => theme.color.white};
  }

  > img:last-child {
    margin-left: -0.7rem;
  }
`

const PathContainer = styled(IconContainer)`
  align-items: center;
  font-size: 1.5rem;

  > span {
    margin: 0 0.5rem 0 0.3rem;
  }

  > img:last-child {
    margin-left: 0;
  }
`

const NetworkIcon = styled.img`
  position: absolute;
  width: 1rem !important;
  height: 1rem !important;
  right: -0.125rem;
  bottom: 0;
  z-index: 1;
`

const Image = styled.img`
  width: 100%;
  height: auto;
`

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const PlaceholderIcon = styled.div`
  border-radius: 100%;
  min-width: 2rem;
  min-height: 2rem;
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  white-space: nowrap;
  text-shadow: black 0 1px 1px;
`

export const TokenIcon: FC<Props> = ({ className, symbol, hideNetwork = false }) => {
  const { protocolName } = useNetwork()
  const networkSymbol = protocolName.toUpperCase()
  const showNetworkIcon = symbol && protocolName !== Networks.Ethereum && !hideNetwork
  const icon = TOKEN_ICONS[symbol?.toUpperCase() ?? '']
  return icon ? (
    <ImageContainer className={className}>
      <Image alt={symbol} src={icon} />
      {showNetworkIcon && <NetworkIcon src={TOKEN_ICONS[networkSymbol]} alt="" />}
    </ImageContainer>
  ) : (
    <PlaceholderIcon className={className} title={symbol}>
      {symbol}
    </PlaceholderIcon>
  )
}

export const TokenPair: FC<{
  symbols?: string[]
  className?: string
  isLarge?: boolean
}> = ({ className, symbols, isLarge = false }) => {
  if (!symbols || (symbols?.length ?? 0) < 2) return null
  return (
    <IconContainer isLarge={isLarge} className={className}>
      <TokenIcon symbol={symbols[0]} />
      <TokenIcon symbol={symbols[1]} />
    </IconContainer>
  )
}

export const TokenPath: FC<{
  symbols: string[]
  className?: string
}> = ({ className, symbols }) => {
  return (
    <PathContainer isLarge={false} className={className}>
      <TokenIcon symbol={symbols[0]} />
      <span>→</span>
      <TokenIcon symbol={symbols[1]} />
    </PathContainer>
  )
}

export const TokenIconSvg: FC<SvgProps> = ({ symbol, width, height, x, y, className }) => {
  if (!symbol || !SVG_ICONS[symbol.toUpperCase()]) return null
  const Icon = SVG_ICONS[symbol.toUpperCase()]
  return <Icon width={width} height={height} x={x} y={y} className={className} />
}
