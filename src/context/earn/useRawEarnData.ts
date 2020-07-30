import { useMemo } from 'react';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/react-hooks';

import { useWallet } from 'use-wallet';
import { useBlockPollingSubscription } from '../DataProvider/subscriptions';
import {
  RewardsPerTokenStoredAtBlockQueryResult,
  useStakingRewardsContractsLazyQuery,
} from '../../graphql/mstable';
import { RawEarnData, SyncedEarnData } from './types';
import { BlockTimestamp } from '../../types';

const useRewardsPerTokenStoredAtBlockQuery = (
  blockTimestamp?: BlockTimestamp,
): RewardsPerTokenStoredAtBlockQueryResult => {
  // Can't query blocks with variables yet:
  // https://github.com/graphprotocol/graph-node/issues/1460
  const query = useMemo(() => {
    const queryString = `
      query RewardsPerTokenStoredAtBlockQueryResult
      @api(name: mstable) {
          stakingRewardsContracts(block: { number: ${blockTimestamp?.blockNumber} }) {
              id
              rewardPerTokenStored
              platformRewardPerTokenStored
          }
      }
  `;
    return gql(queryString);
  }, [blockTimestamp]);

  return useQuery(query, {
    skip: !blockTimestamp,
    fetchPolicy: 'cache-and-network',
  }) as RewardsPerTokenStoredAtBlockQueryResult;
};

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
    block24hAgo,
  );
  const rawStakingRewardsContracts24hAgo =
    rawStakingRewardsContracts24hAgoQuery.data?.stakingRewardsContracts || [];

  return {
    block24hAgo,
    rawStakingRewardsContracts,
    rawStakingRewardsContracts24hAgo,
  };
};
