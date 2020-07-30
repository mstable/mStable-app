import { useWallet } from 'use-wallet';

import { useBlockPollingSubscription } from '../DataProvider/subscriptions';
import {
  useRewardsPerTokenStoredAtBlockQuery,
  useStakingRewardsContractsLazyQuery,
} from '../../graphql/mstable';
import { RawEarnData, SyncedEarnData } from './types';

export const useRawEarnData = ({
  block24hAgo,
}: SyncedEarnData): RawEarnData => {
  const { account } = useWallet();

  const stakingRewardsContractsSub = useBlockPollingSubscription(
    useStakingRewardsContractsLazyQuery,
    { variables: { account } },
  );
  const rawStakingRewardsContracts =
    stakingRewardsContractsSub.data?.stakingRewardsContracts || [];

  const rawStakingRewardsContracts24hAgoQuery = useRewardsPerTokenStoredAtBlockQuery(
    {
      variables: { blockNumber: block24hAgo?.blockNumber as number },
      skip: !block24hAgo,
      fetchPolicy: 'cache-first', // Safe to use because the block number will change
    },
  );
  const rawStakingRewardsContracts24hAgo =
    rawStakingRewardsContracts24hAgoQuery.data?.stakingRewardsContracts || [];

  return {
    block24hAgo,
    rawStakingRewardsContracts,
    rawStakingRewardsContracts24hAgo,
  };
};
