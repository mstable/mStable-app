import { BigNumber } from 'bignumber.js';
import { aToH } from './strings';

export const PERCENT_SCALE = new BigNumber('1e16');
export const RATIO_SCALE = new BigNumber('1e8');
export const EXP_SCALE = new BigNumber('1e18');

export const DEFAULT_DECIMALS = new BigNumber('18');
export const DEFAULT_SUPPLY = new BigNumber('1e23');

export const KEY_META = aToH('MTA');
export const KEY_MUSD = aToH('mUSD');
export const KEY_MGLD = aToH('mGLD');

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
