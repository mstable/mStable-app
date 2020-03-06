import { useMemo } from 'react';
import { Contract, Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import { useSignerContext } from '../context/SignerProvider';
import { MassetNames } from '../types';
import {
  TokenDetailsFragment,
  useCoreTokensQuery,
  useMassetQuery,
} from '../graphql/generated';
import { IERC20Factory } from '../typechain/IERC20Factory';
import { IForgeRewardsFactory } from '../typechain/IForgeRewardsFactory';
import { IERC20 } from '../typechain/IERC20.d';
import { IForgeRewards } from '../typechain/IForgeRewards.d';
import { CHAIN_ID } from './constants';
import { getEtherscanLink, truncateAddress } from './strings';

interface ContractFactory<TContract extends Contract> {
  connect(address: string, signerOrProvider: Signer | Provider): TContract;
}

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

export const useERC20Contract = (address: string | null): IERC20 | null =>
  useContract(IERC20Factory, address);

// TODO later: handle more than MUSD
export const useForgeRewardsContract = (): IForgeRewards | null =>
  useContract(
    IForgeRewardsFactory,
    process.env.REACT_APP_FORGE_REWARDS_ADDRESS,
  );

export const useMassetToken = (
  massetName: MassetNames,
): TokenDetailsFragment | null => {
  const { data } = useCoreTokensQuery();
  return data?.[massetName]?.[0] || null;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useBassets = (massetAddress: string | null) => {
  const { data } = useMassetQuery({
    variables: { id: massetAddress || '' },
    skip: !massetAddress,
  });
  return data?.masset?.basket?.bassets || [];
};

export const useEtherscanLink = (
  data: string,
  type: 'account' | 'transaction',
): string =>
  useMemo(() => getEtherscanLink(CHAIN_ID, data, type), [data, type]);

export const useTruncatedAddress = (address: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);
