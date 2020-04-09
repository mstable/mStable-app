import { BigNumber } from 'ethers/utils';
import { Connectors } from 'use-wallet';
import { asciiToHex as aToH } from 'web3-utils';
import { getConnectors } from './connectors';

export const PERCENT_SCALE = new BigNumber((1e16).toString());
export const RATIO_SCALE = new BigNumber((1e8).toString());
export const EXP_SCALE = new BigNumber((1e18).toString());

export const KEY_META = aToH('MTA');
export const KEY_MUSD = aToH('mUSD');
export const KEY_MGLD = aToH('mGLD');

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// For now, support one chain ID per deployment; also a `use-wallet` restriction
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

export const AVAILABLE_CONNECTORS: Connectors = getConnectors(CHAIN_ID);
