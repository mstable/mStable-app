import React, { FC, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import styled from 'styled-components';
import { Interfaces, SendTxManifest } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { CountUp } from '../../../core/CountUp';
import {
  useCurrentRewardsToken,
  useCurrentStakingToken,
  useCurrentStakingRewardsContractCtx,
  useRewardsEarned,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider';
import { H3, P } from '../../../core/Typography';
import { StakeAmountInput } from '../../../forms/StakeAmountInput';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const Input: FC<{}> = () => {
  const { stakingRewardsContract } = useStakingRewardsContractState();

  if (!stakingRewardsContract) {
    return <Skeleton height={300} />;
  }

  return (
    <Row>
      <H3>Withdraw stake or exit</H3>
      <StakeAmountInput />
    </Row>
  );
};

const ExitFormConfirm: FC<{}> = () => {
  const { rewards } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();
  const stakingToken = useCurrentStakingToken();
  const {
    exit: { amount, isExiting },
  } = useStakingRewardsContractState();

  return (
    <div>
      {amount && rewardsToken && stakingToken && rewards ? (
        amount.exact.gt(0) ? (
          <>
            <P>
              This will return{' '}
              <CountUp
                end={amount.simpleRounded}
                decimals={2}
                suffix={` ${stakingToken.symbol}`}
              />
              {isExiting && rewards.exact.gt(0) ? (
                <>
                  {' '}
                  and claim rewards of{' '}
                  <CountUp
                    end={rewards.simpleRounded}
                    decimals={6}
                    suffix={` ${rewardsToken.symbol}`}
                  />
                </>
              ) : null}
              .
            </P>
            {isExiting ? (
              <P>
                No more rewards will be earned in this pool until another stake
                is deposited.
              </P>
            ) : (
              <P>
                You will continue to earn rewards with your remaining stake.
              </P>
            )}
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

const StyledTransactionForm = styled(TransactionForm)`
  h3 {
    border-top: 0;
  }
`;

const ExitForm: FC<{}> = () => {
  const contract = useCurrentStakingRewardsContractCtx();

  const setFormManifest = useSetFormManifest();

  const {
    exit: { amount, valid, isExiting },
  } = useStakingRewardsContractState();

  useEffect(() => {
    if (valid && contract && amount) {
      if (isExiting) {
        const manifest: SendTxManifest<Interfaces.StakingRewards, 'exit'> = {
          args: [],
          iface: contract,
          fn: 'exit',
        };
        setFormManifest(manifest);
      } else {
        const manifest: SendTxManifest<
          Interfaces.StakingRewards,
          'withdraw'
        > = {
          args: [amount.exact],
          iface: contract,
          fn: 'withdraw',
        };
        setFormManifest(manifest);
      }
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, contract, amount, isExiting]);

  return (
    <StyledTransactionForm
      confirmLabel={isExiting ? 'Exit' : 'Withdraw'}
      confirm={<ExitFormConfirm />}
      input={<Input />}
      transactionsLabel="Transactions"
      valid={valid}
    />
  );
};

export const Exit: FC<{}> = () => (
  <FormProvider formId="exit">
    <ExitForm />
  </FormProvider>
);
