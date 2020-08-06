import React, { FC, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { BigNumber } from 'ethers/utils';
import styled from 'styled-components';

import { useTokenAllowance } from '../../../../context/DataProvider/TokensProvider';
import { useAccount } from '../../../../context/UserProvider';
import { useSignerContext } from '../../../../context/SignerProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../../forms/TransactionForm';
import { ApproveButton } from '../../../forms/ApproveButton';
import { TokenAmount } from '../../../core/TokenAmount';
import { NumberFormat } from '../../../core/Amount';
import { H3, H4 } from '../../../core/Typography';
import { useEarnAdminDispatch, useEarnAdminState } from './EarnAdminProvider';
import { Interfaces, SendTxManifest } from '../../../../types';
import { RewardsDistributorFactory } from '../../../../typechain/RewardsDistributorFactory';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { Button } from '../../../core/Button';

const Row = styled.div`
  margin-bottom: 16px;
`;

const Confirm: FC<{}> = () => {
  const {
    data: { rewardsToken, rewardsDistributor },
    useCustomRecipients,
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
      Object.entries(recipientAmounts)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, { custom }]) => (useCustomRecipients ? !!custom : !custom))
        .reduce<[string[], BigNumber[]]>(
          ([addresses, amounts], [recipient, { amount }]) =>
            amount?.exact
              ? [
                  [...addresses, recipient],
                  [...amounts, (amount as BigDecimal).exact],
                ]
              : [addresses, amounts],
          [[], []],
        ),
    [recipientAmounts, useCustomRecipients],
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

  const token = rewardsToken || { decimals: 18, symbol: 'MTA' };

  return (
    <>
      <Row>
        <H3 borderTop>Total amount</H3>
        <TokenAmount
          symbol={token.symbol}
          amount={totalFunds}
          decimalPlaces={6}
          format={NumberFormat.Countup}
          countup={{ decimals: 6 }}
        />
      </Row>
      <Row>
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
      </Row>
    </>
  );
};

const Input: FC<{}> = () => {
  const {
    data: { rewardsToken, rewardsDistributor },
    totalFunds,
  } = useEarnAdminState();
  const spender = rewardsDistributor?.id;

  return rewardsToken && spender ? (
    <Row>
      {totalFunds &&
      rewardsToken?.allowances[spender]?.exact.lt(totalFunds.exact) ? (
        <>
          <H3 borderTop>Approve amount</H3>
          <p>
            Approve transfer of {totalFunds?.simple} {rewardsToken.symbol}
          </p>
          <ApproveButton
            address={rewardsToken.address}
            spender={spender}
            amount={totalFunds}
          />
        </>
      ) : null}
    </Row>
  ) : (
    <Skeleton />
  );
};

const CustomRecipients: FC<{}> = () => {
  const [recipientValue, setRecipientValue] = useState<string>();
  const { recipientAmounts } = useEarnAdminState();
  const {
    addCustomRecipient,
    removeCustomRecipient,
    setRecipientAmount,
  } = useEarnAdminDispatch();

  return (
    <div>
      <Row>
        <H4>Recipients</H4>
        <div>
          <input
            placeholder="Recipient"
            onChange={e => setRecipientValue(e.target.value)}
          />
          <Button
            onClick={() => {
              if (recipientValue) {
                addCustomRecipient(recipientValue);
                setRecipientValue(undefined);
              }
            }}
          >
            Add recipient
          </Button>
        </div>
        <code>
          {Object.keys(recipientAmounts)
            .filter(recipient => recipientAmounts[recipient].custom)
            .map(recipient => (
              <div key={recipient}>
                <div>Address: {recipient}</div>
                <div>
                  Amount: {recipientAmounts[recipient].amount?.format()}
                </div>
                <div>
                  Set amount:{' '}
                  <input
                    type="number"
                    onChange={e => {
                      setRecipientAmount(recipient, e.currentTarget.value);
                    }}
                  />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      removeCustomRecipient(recipient);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
        </code>
      </Row>
    </div>
  );
};

const Inputs: FC<{ reason?: string }> = ({ reason }) => {
  const { useCustomRecipients } = useEarnAdminState();
  const { toggleCustomRecipients } = useEarnAdminDispatch();
  return (
    <div>
      {reason ? (
        <Row>
          <H3 borderTop>Validation</H3>
          <div>{reason}</div>
        </Row>
      ) : null}
      <Row>
        <Button onClick={toggleCustomRecipients}>
          Toggle custom recipients
        </Button>
      </Row>
      {useCustomRecipients ? (
        <Row>
          <H3 borderTop>Custom recipients/amounts</H3>
          <CustomRecipients />
        </Row>
      ) : null}
      <Input />
    </div>
  );
};

export const DistributeRewardsForm: FC<{}> = () => {
  const account = useAccount();
  const {
    data: { rewardsDistributor, rewardsToken },
    totalFunds,
  } = useEarnAdminState();
  const spender = rewardsDistributor?.id;

  const allowance = useTokenAllowance(rewardsToken?.address, spender);

  const reason = useMemo<string | undefined>(() => {
    if (!account) return 'Not connected';
    if (!(spender && rewardsDistributor && allowance)) return 'Fetching data';
    if (!rewardsDistributor?.fundManagers.includes(account.toLowerCase()))
      return 'Not a fund manager';
    if (!totalFunds?.exact.gt(0)) return 'Funds not allocated';
    if (allowance.exact.lt(totalFunds?.exact)) return 'Exceeds approved amount';
    return undefined;
  }, [account, allowance, rewardsDistributor, spender, totalFunds]);

  const valid = !reason;

  return (
    <FormProvider formId="adminStakingRewards">
      <TransactionForm
        confirmLabel="Distribute rewards"
        transactionsLabel="Distribute rewards transactions"
        input={<Inputs reason={reason} />}
        confirm={<Confirm />}
        valid={valid}
      />
    </FormProvider>
  );
};
