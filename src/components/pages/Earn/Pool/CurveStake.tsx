import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { ADDRESSES } from '../../../../constants';
import { useCurveContracts } from '../../../../context/earn/CurveProvider';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { Interfaces } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { H3, P } from '../../../core/Typography';
import {
  useCurrentStakingToken,
  useStakingRewardContractDispatch,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider';
import { CountUp } from '../../../core/CountUp';
import { ExternalLink } from '../../../core/ExternalLink';
import { PLATFORM_METADATA } from '../constants';
import { Protip } from '../../../core/Protip';
import { Tabs } from '../types';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const ExitLink = styled.span`
  border-bottom: 1px black solid;
  cursor: pointer;
`;

const Input: FC = () => {
  const {
    stake: { amount, formValue, error, needsUnlock },
    stakingRewardsContract,
  } = useStakingRewardsContractState();
  const {
    setStakeAmount,
    setMaxStakeAmount,
  } = useStakingRewardContractDispatch();

  const stakingToken = useCurrentStakingToken();

  const metadata = stakingRewardsContract
    ? PLATFORM_METADATA[stakingRewardsContract.pool.platform]
    : undefined;

  if (!stakingRewardsContract) {
    return <ThemedSkeleton height={300} />;
  }

  const { address, curve } = stakingRewardsContract;

  return (
    <Row>
      <H3>Deposit stake</H3>
      <div>
        <TokenAmountInput
          needsUnlock={needsUnlock}
          amountValue={formValue}
          error={error}
          exactDecimals
          name="stake"
          spender={curve ? ADDRESSES.CURVE.MUSD_GAUGE : address}
          onChangeAmount={setStakeAmount}
          onSetMax={setMaxStakeAmount}
          tokenAddresses={[stakingToken?.address as string]}
          tokenDisabled
          tokenValue={stakingToken?.address}
          approveAmount={amount}
        />
        {metadata && stakingToken?.balance.exact.lte(0) ? (
          <Protip title="Need tokens to stake?">
            <ExternalLink
              href={metadata.getPlatformLink(stakingRewardsContract)}
            >
              Get tokens to stake by contributing liquidity on {metadata.name}
            </ExternalLink>
          </Protip>
        ) : null}
      </div>
    </Row>
  );
};

const Confirm: FC = () => {
  const {
    stake: { amount },
  } = useStakingRewardsContractState();
  const stakingToken = useCurrentStakingToken();

  return amount && stakingToken ? (
    <div>
      You are staking{' '}
      <CountUp end={amount?.simple} suffix={` ${stakingToken.symbol}`} /> into
      this pool.
    </div>
  ) : null;
};

export const CurveStake: FC = () => {
  const {
    stake: { amount, valid },
    stakingRewardsContract: { expired = false, title = 'gauge' } = {},
  } = useStakingRewardsContractState();
  const { setActiveTab } = useStakingRewardContractDispatch();

  const { musdGauge } = useCurveContracts();

  const createTransaction = useCallback(
    (
      formId: string,
    ): TransactionManifest<
      Interfaces.CurveGauge,
      'deposit(uint256)'
    > | void => {
      if (valid && amount && musdGauge) {
        const body = `${amount.format()} into ${title}`;
        return new TransactionManifest(
          musdGauge,
          'deposit(uint256)',
          [amount.exact],
          {
            present: `Depositing ${body}`,
            past: `Deposited ${body}`,
          },
          formId,
        );
      }
    },
    [valid, amount, musdGauge, title],
  );

  return expired ? (
    <div>
      <H3>Pool expired</H3>
      <P>
        This pool has now expired; new stakes should not be deposited, and the
        pool should be{' '}
        <ExitLink
          onClick={() => {
            setActiveTab(Tabs.Exit);
          }}
        >
          exited
        </ExitLink>
        .
      </P>
    </div>
  ) : (
    <TransactionForm
      formId="curveStake"
      confirmLabel="Stake"
      confirm={<Confirm />}
      createTransaction={createTransaction}
      input={<Input />}
      valid={valid}
    />
  );
};
