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
  useRewardsEarned,
  useStakingRewardContractDispatch,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider';
import { H3, P } from '../../../core/Typography';
import { StakeAmountInput } from '../../../forms/StakeAmountInput';
import { useCurveContracts } from '../../../../context/earn/CurveProvider';
import { Button } from '../../../core/Button';
import { Tabs } from '../types';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const Input: FC = () => {
  const { stakingRewardsContract } = useStakingRewardsContractState();

  if (!stakingRewardsContract) {
    return <Skeleton height={300} />;
  }

  return (
    <Row>
      <H3 borderTop>Withdraw stake or exit</H3>
      <StakeAmountInput />
    </Row>
  );
};

const ExitFormConfirm: FC = () => {
  const { rewards, platformRewards } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();
  const stakingToken = useCurrentStakingToken();
  const { setActiveTab } = useStakingRewardContractDispatch();
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
                end={amount.simple}
                decimals={2}
                suffix={` ${stakingToken.symbol}`}
              />
              {rewards.exact.gt(0) && (
                <>
                  {' '}
                  and claim rewards of{' '}
                  <CountUp end={rewards.simple} decimals={6} suffix=" MTA" />
                </>
              )}
              .
            </P>
            {platformRewards?.exact.gt(0) && (
              <>
                <P>
                  <CountUp
                    end={platformRewards.simple}
                    decimals={6}
                    suffix=" CRV"
                  />{' '}
                  must be claimed separately.
                </P>
                <Button
                  onClick={() => {
                    setActiveTab(Tabs.Claim);
                  }}
                >
                  Claim CRV
                </Button>
              </>
            )}
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

const ExitForm: FC = () => {
  const { musdGauge } = useCurveContracts();

  const setFormManifest = useSetFormManifest();

  const {
    exit: { amount, valid },
  } = useStakingRewardsContractState();

  useEffect(() => {
    if (valid && amount && musdGauge) {
      const manifest: SendTxManifest<Interfaces.CurveGauge, 'withdraw(uint256)'> = {
        args: [amount.exact],
        iface: musdGauge,
        fn: 'withdraw(uint256)',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, amount, musdGauge]);

  return (
    <TransactionForm
      confirmLabel="Withdraw"
      confirm={<ExitFormConfirm />}
      input={<Input />}
      transactionsLabel="Transactions"
      valid={valid}
    />
  );
};

export const CurveExit: FC = () => {
  return (
    <FormProvider formId="exit">
      <ExitForm />
    </FormProvider>
  );
};
