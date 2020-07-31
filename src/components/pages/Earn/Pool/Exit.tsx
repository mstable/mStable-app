import React, { FC, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Interfaces, SendTxManifest } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { CountUp } from '../../../core/CountUp';
import {
  useCurrentStakingRewardsContract,
  useCurrentRewardsToken,
  useCurrentStakingToken,
  useCurrentStakingRewardsContractCtx,
  useRewardsEarned,
  useCurrentPlatformToken,
} from '../StakingRewardsContractProvider';
import { P } from '../../../core/Typography';

const ExitFormConfirm: FC<{}> = () => {
  const { rewards, platformRewards } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();
  const platformToken = useCurrentPlatformToken();
  const stakingToken = useCurrentStakingToken();
  const stakingBalance = useCurrentStakingRewardsContract()?.stakingBalance;

  return (
    <div>
      {stakingBalance && rewardsToken && stakingToken && rewards ? (
        stakingBalance.exact.gt(0) ? (
          <>
            <P>
              This will return your staking balance of{' '}
              <CountUp
                end={stakingBalance.simpleRounded}
                decimals={2}
                suffix={` ${stakingToken.symbol}`}
              />
              {rewards.exact.gt(0) ? (
                <>
                  {' '}
                  and claim rewards of{' '}
                  <CountUp
                    end={rewards.simpleRounded}
                    decimals={6}
                    suffix={` ${rewardsToken.symbol}`}
                  />
                  {platformToken && platformRewards ? (
                    <>
                      {' '}
                      and{' '}
                      <CountUp
                        end={platformRewards.simpleRounded}
                        decimals={6}
                        suffix={` ${platformToken.symbol}`}
                      />
                    </>
                  ) : null}
                </>
              ) : null}
              .
            </P>
            <P>
              No more rewards will be earned in this pool until another stake is
              deposited.
            </P>
          </>
        ) : (
          <P>No staking balance.</P>
        )
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

const ExitForm: FC<{}> = () => {
  const contract = useCurrentStakingRewardsContractCtx();

  const setFormManifest = useSetFormManifest();

  const stakingBalance = useCurrentStakingRewardsContract()?.stakingBalance;

  const valid = !!stakingBalance?.exact.gt(0);

  useEffect(() => {
    if (valid && contract) {
      const manifest: SendTxManifest<Interfaces.StakingRewards, 'exit'> = {
        args: [],
        iface: contract,
        fn: 'exit',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, contract]);

  return (
    <TransactionForm
      confirmLabel="Exit pool"
      confirm={<ExitFormConfirm />}
      transactionsLabel="Exit transactions"
      valid={valid}
    />
  );
};

export const Exit: FC<{}> = () => (
  <FormProvider formId="exit">
    <ExitForm />
  </FormProvider>
);
