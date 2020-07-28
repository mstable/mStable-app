import React, { FC, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers/utils';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../../forms/TransactionForm';
import { ApproveButton } from '../../../forms/ApproveButton';
import { TokenAmount } from '../../../core/TokenAmount';
import { NumberFormat } from '../../../core/Amount';
import { H3 } from '../../../core/Typography';
import { useEarnAdminState } from './EarnAdminProvider';
import { Interfaces, SendTxManifest } from '../../../../types';
import { useSignerContext } from '../../../../context/SignerProvider';
import { RewardsDistributorFactory } from '../../../../typechain/RewardsDistributorFactory';
import { BigDecimal } from '../../../../web3/BigDecimal';

const Confirm: FC<{}> = () => {
  const {
    data: { rewardsToken, rewardsDistributor },
    totalFunds,
    recipientAmounts,
  } = useEarnAdminState();

  const rewardsDistributorAddress = rewardsDistributor?.id;

  const setFormManifest = useSetFormManifest();
  const signer = useSignerContext();
  const iface = useMemo(
    () =>
      signer && rewardsDistributorAddress
        ? RewardsDistributorFactory.connect(rewardsDistributorAddress, signer)
        : undefined,
    [rewardsDistributorAddress, signer],
  );

  const args = useMemo<[string[], BigNumber[]]>(
    () =>
      Object.keys(recipientAmounts).reduce<[string[], BigNumber[]]>(
        ([addresses, amounts], address) =>
          recipientAmounts[address]?.amount?.exact
            ? [
                [...addresses, address],
                [
                  ...amounts,
                  (recipientAmounts[address].amount as BigDecimal).exact,
                ],
              ]
            : [addresses, amounts],
        [[], []],
      ),
    [recipientAmounts],
  );

  useEffect(() => {
    if (iface && args.length > 0) {
      const manifest: SendTxManifest<
        Interfaces.RewardsDistibutor,
        'distributeRewards'
      > = {
        args,
        iface,
        fn: 'distributeRewards',
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [iface, setFormManifest, args]);

  return rewardsToken ? (
    <>
      <div>
        <H3 borderTop>Total amount</H3>
        <TokenAmount
          symbol={rewardsToken.symbol}
          amount={totalFunds}
          decimalPlaces={6}
          format={NumberFormat.Countup}
          countup={{ decimals: 6 }}
        />
      </div>
      <div>
        <H3 borderTop>Breakdown</H3>
        <code>
          {Object.keys(recipientAmounts)
            .sort()
            .map(key => (
              <div key={key}>
                <div>{key}</div>
                <div>
                  {recipientAmounts[key].amount
                    ? `${recipientAmounts[key].amount?.format()} (${
                        recipientAmounts[key].amount?.exact
                      })`
                    : '-'}
                </div>
                <br />
              </div>
            ))}
        </code>
      </div>
    </>
  ) : (
    <Skeleton />
  );
};

const Input: FC<{ reason?: string }> = ({ reason }) => {
  const {
    data: { rewardsToken, rewardsDistributor },
    totalFunds,
  } = useEarnAdminState();
  const spender = rewardsDistributor?.id;

  return rewardsToken && spender ? (
    <div>
      {reason ? (
        <div>
          <H3 borderTop>Validation</H3>
          <div>{reason}</div>
        </div>
      ) : null}
      {totalFunds &&
      rewardsToken?.allowances[spender]?.exact.lt(totalFunds.exact) ? (
        <div>
          <H3 borderTop>Approve amount</H3>
          <p>
            Approve transfer of {totalFunds?.simple} {rewardsToken.symbol}
          </p>
          <ApproveButton
            address={rewardsToken.address}
            spender={spender}
            amount={totalFunds}
            decimals={rewardsToken.decimals}
          />
        </div>
      ) : null}
    </div>
  ) : (
    <Skeleton />
  );
};

export const DistributeRewardsForm: FC<{}> = () => {
  const { account } = useWallet();
  const {
    data: { rewardsDistributor, rewardsToken },
    totalFunds,
  } = useEarnAdminState();
  const spender = rewardsDistributor?.id;

  const reason = useMemo<string | undefined>(() => {
    if (!account) return 'Not connected';
    if (!(spender && rewardsDistributor)) return 'Fetching data';
    if (!rewardsDistributor?.fundManagers.includes(account.toLowerCase()))
      return 'Not a fund manager';
    if (!totalFunds?.exact.gt(0)) return 'Funds not allocated';
    if (rewardsToken?.allowances[spender]?.exact.lt(totalFunds?.exact))
      return 'Exceeds approved amount';
    return undefined;
  }, [account, rewardsDistributor, rewardsToken, spender, totalFunds]);

  const valid = !reason;

  return (
    <FormProvider formId="adminStakingRewards">
      <TransactionForm
        confirmLabel="Distribute rewards"
        transactionsLabel="Distribute rewards transactions"
        input={<Input reason={reason} />}
        confirm={<Confirm />}
        valid={valid}
      />
    </FormProvider>
  );
};
