import { EthereumClass, Ethereum } from '@renproject/chains';
import { getRenNetworkDetails, RenNetwork } from '@renproject/interfaces';

export const NETWORK = getRenNetworkDetails(RenNetwork.Testnet);

export enum Asset {
  BTC = 'BTC',
}

export const getEthChainObject = (
  provider: any,
  recipientAddress?: string,
  amount?: string,
): EthereumClass => {
  const eth = Ethereum(provider, NETWORK);
  return recipientAddress
    ? eth.Account({
        address: recipientAddress,
        value: amount,
      })
    : eth;
};
