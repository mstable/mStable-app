import React, { FC, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import {
  CURVE_ADDRESSES,
  useCurveContracts,
} from '../../../../context/earn/CurveProvider';
import { Interfaces, SendTxManifest } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
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
    return <Skeleton height={300} />;
  }

  const { address, curve } = stakingRewardsContract;

  return (
    <Row>
      <H3 borderTop>Deposit stake</H3>
      <div>
        <TokenAmountInput
          needsUnlock={needsUnlock}
          amountValue={formValue}
          error={error}
          exactDecimals
          name="stake"
          spender={curve ? CURVE_ADDRESSES.MUSD_GAUGE : address}
          onChangeAmount={setStakeAmount}
          onSetMax={setMaxStakeAmount}
          tokenAddresses={[stakingToken?.address as string]}
          tokenDisabled
          tokenValue={stakingToken?.address || null}
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

const Form: FC = () => {
  const {
    stake: { amount, valid },
    stakingRewardsContract: { expired = false } = {},
  } = useStakingRewardsContractState();
  const { setActiveTab } = useStakingRewardContractDispatch();

  const curveContracts = useCurveContracts();
  const setFormManifest = useSetFormManifest();

  useEffect(() => {
    if (valid && amount) {
      const manifest: SendTxManifest<
        Interfaces.CurveGauge,
        'deposit(uint256)'
      > = {
        args: [amount.exact],
        iface: curveContracts.musdGauge,
        fn: 'deposit(uint256)',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, amount, curveContracts.musdGauge]);

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
      confirmLabel="Stake"
      confirm={<Confirm />}
      input={<Input />}
      transactionsLabel="Stake transactions"
      valid={valid}
    />
  );
};

export const CurveStake: FC = () => {
  return (
    <FormProvider formId="curveStake">
      <Form />
    </FormProvider>
  );
};
