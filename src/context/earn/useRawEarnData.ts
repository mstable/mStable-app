import { useBlockPollingSubscription } from '../DataProvider/subscriptions';
import { useAccount } from '../UserProvider';
import { useStakingRewardsContractsLazyQuery } from '../../graphql/mstable';
import { RawEarnData, SyncedEarnData } from './types';
import { useCurveBalances } from './CurveProvider';

export const useRawEarnData = ({
  block24hAgo,
}: SyncedEarnData): RawEarnData => {
  const account = useAccount();
  const block = block24hAgo ? { number: block24hAgo.blockNumber } : undefined;

  const stakingRewardsContractsSub = useBlockPollingSubscription(
    useStakingRewardsContractsLazyQuery,
    {
      variables: { account, includeHistoric: !!block, block },
      fetchPolicy: 'cache-and-network',
    },
  );

  const curveBalances = useCurveBalances();

  return {
    block24hAgo,
    curveBalances,
    rawStakingRewardsContracts: stakingRewardsContractsSub.data,
  };
};
