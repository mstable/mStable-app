import React, { FC, useEffect } from 'react';

import { Interfaces, SendTxManifest } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import {
  useRewardsEarned,
  useCurrentRewardsToken,
  useCurrentStakingRewardsContractCtx,
} from '../StakingRewardsContractProvider';
import { CountUp } from '../../../core/CountUp';
import { FormRow } from '../../../core/Form';
import { H3 } from '../../../core/Typography';

const Input: FC<{}> = () => {
  const { rewardsEarned } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();

  return (
    <FormRow>
      <H3>Claim rewards</H3>
      <div>
        {rewardsToken && rewardsEarned?.exact.gt(0) ? (
          <>
            Claim{' '}
            <CountUp
              end={rewardsEarned?.simpleRounded}
              decimals={6}
              suffix={` ${rewardsToken.symbol}`}
            />
            .
          </>
        ) : (
          'No rewards to claim.'
        )}
      </div>
    </FormRow>
  );
};

const Confirm: FC<{}> = () => {
  const { rewardsEarned } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();

  return rewardsToken && rewardsEarned?.exact.gt(0) ? (
    <>
      <CountUp
        end={rewardsEarned.simpleRounded}
        decimals={6}
        suffix={` ${rewardsToken.symbol}`}
      />{' '}
      will be claimed.
    </>
  ) : null;
};

const Form: FC<{}> = () => {
  const { rewardsEarned } = useRewardsEarned();

  const contract = useCurrentStakingRewardsContractCtx();

  const setFormManifest = useSetFormManifest();

  const valid = !!rewardsEarned?.exact.gt(0);

  useEffect(() => {
    if (valid && contract) {
      const manifest: SendTxManifest<
        Interfaces.StakingRewards,
        'claimReward'
      > = {
        args: [],
        iface: contract,
        fn: 'claimReward',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, contract]);

  return (
    <TransactionForm
      confirmLabel="Claim"
      input={<Input />}
      confirm={<Confirm />}
      transactionsLabel="Claim transactions"
      valid={valid}
    />
  );
};

export const Claim: FC<{}> = () => (
  <FormProvider formId="claim">
    <Form />
  </FormProvider>
);
