import React, { FC, useCallback, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import styled from 'styled-components';

import { useTokenAllowance } from '../../../../context/TokensProvider';
import { useOwnAccount } from '../../../../context/UserProvider';
import { TransactionForm } from '../../../forms/TransactionForm';
import { ApproveButton } from '../../../forms/ApproveButton';
import { TokenAmount } from '../../../core/TokenAmount';
import { NumberFormat } from '../../../core/Amount';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import { H3, H4 } from '../../../core/Typography';
import { useEarnAdminDispatch, useEarnAdminState } from './EarnAdminProvider';
import { Interfaces } from '../../../../types';
import { RewardsDistributor__factory } from '../../../../typechain';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { Button } from '../../../core/Button';
import { useSigner } from '../../../../context/OnboardProvider';

const Row = styled.div`
  margin-bottom: 16px;
`;

const Confirm: FC = () => {
  const {
    data: { rewardsToken },
    totalFunds,
    recipientAmounts,
  } = useEarnAdminState();

  const token = rewardsToken || { decimals: 18, symbol: 'MTA' };

  return (
    <>
      <Row>
        <H3>Total amount</H3>
        <TokenAmount
          symbol={token.symbol}
          amount={totalFunds}
          decimalPlaces={6}
          format={NumberFormat.Countup}
          countup={{ decimals: 6 }}
        />
      </Row>
      <Row>
        <H3>Breakdown</H3>
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

const Input: FC = () => {
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
          <H3>Approve amount</H3>
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
    <ThemedSkeleton />
  );
};

const CustomRecipients: FC = () => {
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
          <H3>Validation</H3>
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
          <H3>Custom recipients/amounts</H3>
          <CustomRecipients />
        </Row>
      ) : null}
      <Input />
    </div>
  );
};

export const DistributeRewardsForm: FC = () => {
  const account = useOwnAccount();
  const signer = useSigner();
  const {
    data: { rewardsDistributor, rewardsToken },
    useCustomRecipients,
    recipientAmounts,
    totalFunds,
  } = useEarnAdminState();

  const rewardsDistributorAddress = rewardsDistributor?.id;

  const allowance = useTokenAllowance(
    rewardsToken?.address,
    rewardsDistributorAddress,
  );

  const reason = useMemo<string | undefined>(() => {
    if (!account) {
      return 'Not connected';
    }

    if (!(rewardsDistributorAddress && rewardsDistributor && allowance)) {
      return 'Fetching data';
    }

    if (!rewardsDistributor?.fundManagers.includes(account.toLowerCase())) {
      return 'Not a fund manager';
    }

    if (!totalFunds?.exact.gt(0)) {
      return 'Funds not allocated';
    }

    if (allowance.exact.lt(totalFunds?.exact)) {
      return 'Exceeds approved amount';
    }
    return undefined;
  }, [
    account,
    allowance,
    rewardsDistributor,
    rewardsDistributorAddress,
    totalFunds,
  ]);

  const valid = !reason;

  const createTransaction = useCallback(
    (
      formId: string,
    ): TransactionManifest<
      Interfaces.RewardsDistibutor,
      'distributeRewards'
    > | void => {
      const contract =
        signer && rewardsDistributorAddress
          ? RewardsDistributor__factory.connect(
              rewardsDistributorAddress,
              signer,
            )
          : undefined;

      const args: [string[], BigNumber[]] = Object.entries(recipientAmounts)
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
        );

      if (contract && args.length > 0) {
        return new TransactionManifest(
          contract,
          'distributeRewards',
          args,
          {
            present: 'Distributing rewards',
            past: 'Distributed rewards',
          },
          formId,
        );
      }
    },
    [signer, recipientAmounts, rewardsDistributorAddress, useCustomRecipients],
  );

  return (
    <TransactionForm
      confirm={<Confirm />}
      confirmLabel="Distribute rewards"
      createTransaction={createTransaction}
      formId="distributeRewards"
      input={<Inputs reason={reason} />}
      valid={valid}
    />
  );
};
