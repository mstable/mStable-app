import { useWallet } from 'use-wallet';

import { useBlockPollingSubscription } from '../DataProvider/subscriptions';
import { useStakingRewardsContractsLazyQuery } from '../../graphql/mstable';
import { RawEarnData, SyncedEarnData } from './types';

export const useRawEarnData = ({
  block24hAgo,
}: SyncedEarnData): RawEarnData => {
  const { account } = useWallet();
  const block = block24hAgo ? { number: block24hAgo.blockNumber } : undefined;

  const stakingRewardsContractsSub = useBlockPollingSubscription(
    useStakingRewardsContractsLazyQuery,
    {
      variables: { account, includeHistoric: !!block, block },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    block24hAgo,
    rawStakingRewardsContracts: stakingRewardsContractsSub.data,
  };
};
