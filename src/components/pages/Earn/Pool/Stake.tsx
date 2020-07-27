import React, { FC, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Interfaces, SendTxManifest } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { FormRow } from '../../../core/Form';
import { H3 } from '../../../core/Typography';
import {
  useStakingRewardContractDispatch,
  useStakingRewardsContractState,
  useCurrentStakingToken,
  useCurrentStakingRewardsContractCtx,
} from '../StakingRewardsContractProvider';
import { CountUp } from '../../../core/CountUp';

const Input: FC<{}> = () => {
  const {
    stake: { formValue, error, needsUnlock },
    stakingRewardsContract,
  } = useStakingRewardsContractState();
  const {
    setStakeAmount,
    setMaxStakeAmount,
  } = useStakingRewardContractDispatch();

  const stakingToken = useCurrentStakingToken();

  if (!stakingRewardsContract) {
    return <Skeleton height={300} />;
  }

  const { address } = stakingRewardsContract;

  return (
    <FormRow>
      <H3>Stake {stakingToken?.symbol}</H3>
      <div>
        <TokenAmountInput
          needsUnlock={needsUnlock}
          amountValue={formValue}
          error={error}
          name="stake"
          spender={address}
          onChangeAmount={setStakeAmount}
          onSetMax={setMaxStakeAmount}
          tokenAddresses={[stakingToken?.address as string]}
          tokenDisabled
          tokenValue={stakingToken?.address || null}
        />
      </div>
    </FormRow>
  );
};

const Confirm: FC<{}> = () => {
  const {
    stake: { amount },
  } = useStakingRewardsContractState();
  const stakingToken = useCurrentStakingToken();

  return amount && stakingToken ? (
    <div>
      You are depositing{' '}
      <CountUp end={amount?.simpleRounded} suffix={` ${stakingToken.symbol}`} />{' '}
      into this staking rewards pool.
    </div>
  ) : null;
};

const Form: FC<{}> = () => {
  const {
    stake: { amount, valid },
  } = useStakingRewardsContractState();
  const contract = useCurrentStakingRewardsContractCtx();

  const setFormManifest = useSetFormManifest();

  useEffect(() => {
    if (valid && amount && contract) {
      const manifest: SendTxManifest<
        Interfaces.StakingRewards,
        'stake(uint256)'
      > = {
        args: [amount.exact],
        iface: contract,
        fn: 'stake(uint256)',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, amount, contract]);

  return (
    <TransactionForm
      confirmLabel="Stake"
      confirm={<Confirm />}
      input={<Input />}
      transactionsLabel="Stake transactions"
      valid={valid}
    />
  );
};

export const Stake: FC<{}> = () => (
  <FormProvider formId="stake">
    <Form />
  </FormProvider>
);
