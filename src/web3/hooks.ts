import { useMemo } from 'react';
import { Contract, Signer } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { Provider } from 'ethers/providers';
import { useSignerContext } from '../context/SignerProvider';
import { MassetNames } from '../types';
import {
  TokenDetailsFragment,
  useCoreTokensQuery,
  // useMassetQuery,
} from '../graphql/generated';
import { truncateAddress } from './strings';

interface ContractFactory<TContract extends Contract> {
  connect(address: string, signerOrProvider: Signer | Provider): TContract;
}

const fakeBassets = [
  {
    id: '0x1',
    token: {
      symbol: 'USDC',
      address: '0x1',
      decimals: 18,
      totalSupply: new BigNumber((1e20).toString()),
    },
  },
  {
    id: '0x2',
    token: {
      symbol: 'DAI',
      address: '0x2',
      decimals: 18,
      totalSupply: new BigNumber((1e20).toString()),
    },
  },
  {
    id: '0x3',
    token: {
      symbol: 'DAI',
      address: '0x3',
      decimals: 18,
      totalSupply: new BigNumber((1e20).toString()),
    },
  },
];

const getContract = <TContract extends Contract>(
  factory: ContractFactory<TContract>,
  address: string,
  signerOrProvider: Signer | Provider,
): TContract => factory.connect(address, signerOrProvider);

export const useContract = <TContract extends Contract>(
  factory: ContractFactory<TContract>,
  address: string | null,
): TContract | null => {
  const signer = useSignerContext();

  return useMemo(() => {
    if (!(signer && address)) return null;
    try {
      return getContract(factory, address, signer);
    } catch {
      return null;
    }
  }, [factory, address, signer]);
};

export const useMassetToken = (
  massetName: MassetNames,
): TokenDetailsFragment | null => {
  const { data } = useCoreTokensQuery();
  return data?.[massetName]?.[0] || null;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars,arrow-body-style
export const useBassets = (massetAddress: string | null) => {
  return fakeBassets;
  // TODO re-enable this when the subgraph is up-to-date
  // const { data } = useMassetQuery({
  //   variables: { id: massetAddress || '' },
  //   skip: !massetAddress,
  // });
  // return data?.masset?.basket?.bassets || [];
};
export const useTruncatedAddress = (address: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);
