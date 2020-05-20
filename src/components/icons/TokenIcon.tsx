import React, { FC } from 'react';
import styled from 'styled-components';
import mUSDTransparent from './mUSD.svg';
import mUSD from './mUSD-circle.svg';
import TUSD from './TUSD.svg';
import USDT from './USDT.svg';
import USDC from './USDC.svg';
import DAI from './DAI.svg';
import BUSD from './BUSD.svg';

interface Props {
  symbol: string;
}

const ICONS: Record<string, string> = {
  mUSD,
  TUSD,
  USDT,
  USDC,
  DAI,
  BUSD,
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
