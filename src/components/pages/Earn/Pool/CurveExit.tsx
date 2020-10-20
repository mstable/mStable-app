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
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider';
import { H3, P } from '../../../core/Typography';
import { StakeAmountInput } from '../../../forms/StakeAmountInput';
import { CurveProtip } from './CurveProtip';
import { ExternalLink } from '../../../core/ExternalLink';
import { useCurveContracts } from '../../../../context/earn/CurveProvider';

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
                end={amount.simple}
                decimals={2}
                suffix={` ${stakingToken.symbol}`}
              />
              {isExiting && rewards.exact.gt(0) ? (
                <>
                  {' '}
                  and claim rewards of{' '}
                  <CountUp
                    end={rewards.simple}
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

const ExitForm: FC = () => {
  const curveContracts = useCurveContracts();

  const setFormManifest = useSetFormManifest();

  const {
    exit: { amount, valid },
  } = useStakingRewardsContractState();

  useEffect(() => {
    if (valid && amount) {
      const manifest: SendTxManifest<Interfaces.Gauge, 'withdraw(uint256)'> = {
        args: [amount.exact],
        iface: curveContracts.musdGauge,
        fn: 'withdraw(uint256)',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, amount, curveContracts.musdGauge]);

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
    <>
      <CurveProtip
        alt="Withdraw from the pool"
        href="https://www.curve.fi/musd/withdraw"
        imgSrc="/media/curve-withdraw.gif"
        title="Withdraw with Curve for more options"
      >
        <P>
          You can use the{' '}
          <ExternalLink href="https://www.curve.fi/musd/withdraw">
            Curve UI
          </ExternalLink>{' '}
          to withdraw from the pool, claim rewards and unstake.
        </P>
      </CurveProtip>
      <FormProvider formId="exit">
        <ExitForm />
      </FormProvider>
    </>
  );
};
