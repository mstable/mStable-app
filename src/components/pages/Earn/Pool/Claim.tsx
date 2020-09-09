import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

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
import { H3, P } from '../../../core/Typography';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const Input: FC<{}> = () => {
  const { rewards } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();

  return (
    <Row>
      <H3>Claim rewards</H3>
      <div>
        {rewardsToken && rewards?.exact.gt(0) ? (
          <>
            Claim{' '}
            <CountUp
              end={rewards?.simpleRounded}
              decimals={6}
              suffix={` ${rewardsToken.symbol}`}
            />
            .
          </>
        ) : (
          'No rewards to claim.'
        )}
      </div>
    </Row>
  );
};

const Confirm: FC<{}> = () => {
  const { rewards } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();

  return rewardsToken && rewards?.exact.gt(0) ? (
    <>
      <P>
        <CountUp
          end={rewards.simpleRounded}
          decimals={6}
          suffix={` ${rewardsToken.symbol}`}
        />{' '}
        will be claimed.
      </P>
      <P>
        You will continue to earn any available rewards with your staked
        balance.
      </P>
    </>
  ) : null;
};

const Form: FC<{}> = () => {
  const { rewards } = useRewardsEarned();

  const contract = useCurrentStakingRewardsContractCtx();

  const setFormManifest = useSetFormManifest();

  const valid = !!rewards?.exact.gt(0);

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
