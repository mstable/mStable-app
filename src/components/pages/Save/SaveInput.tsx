import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { formatUnits, parseUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';

import {
  useMusdData,
  useMusdSavings,
} from '../../../context/DataProvider/DataProvider';
import { useTokenWithBalance } from '../../../context/DataProvider/TokensProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import {
  useMusdContract,
  useSavingsContract,
} from '../../../context/DataProvider/ContractsProvider';
import { Color } from '../../../theme';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { ToggleInput } from '../../forms/ToggleInput';
import { formatExactAmount } from '../../../web3/amounts';
import { useSavingsBalance } from '../../../web3/hooks';
import { TransactionType } from './types';
import { useSaveState, useSaveDispatch } from './SaveProvider';

const TransactionTypeRow = styled(FormRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.l} 0`};

  > * {
    padding: 0 8px;
  }
`;

export const SaveInput: FC<{}> = () => {
  const {
    error,
    values: {
      transactionType,
      input: {
        amount: { exact: inputAmount },
      },
      input,
    },
  } = useSaveState();

  const { setToken, setTransactionType, setQuantity } = useSaveDispatch();

  const { account } = useWallet();

  const sendTransaction = useSendTransaction();

  const savingsContract = useSavingsContract();
  const savingsContractAddress = savingsContract?.address || null;

  const mUsdContract = useMusdContract();
  const mUsd = useMusdData();
  const mUsdAddress = mUsd?.token.address || null;

  const mUsdToken = useTokenWithBalance(mUsdAddress);
  const mUsdSavings = useMusdSavings();

  const savingsBalance = useSavingsBalance(account);

  const musdBalanceItem = useMemo(
    () =>
      mUsd
        ? [
            {
              label: 'Balance',
              value: formatExactAmount(
                mUsd.token.balance,
                mUsd.token.decimals,
                mUsd.token.symbol,
                true,
              ),
            },
          ]
        : [],
    [mUsd],
  );

  const tokenAddresses = useMemo<string[]>(
    () => (mUsdAddress ? [mUsdAddress] : []),
    [mUsdAddress],
  );

  const needsUnlock = useMemo<boolean>(
    () =>
      !!(
        transactionType === TransactionType.Deposit &&
        inputAmount &&
        mUsdSavings?.allowance?.lt(inputAmount)
      ),
    [transactionType, inputAmount, mUsdSavings],
  );

  const handleChangeToken = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onChangeToken']>
  >(
    (_, tokenDetails) => {
      setToken(tokenDetails);
    },
    [setToken],
  );

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onChangeAmount']>
  >(
    (_, simpleAmount) => {
      setQuantity(simpleAmount);
    },
    [setQuantity],
  );

  const handleSetMax = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onSetMax']>
  >(() => {
    if (transactionType === TransactionType.Deposit) {
      if (mUsdToken?.balance) {
        setQuantity(formatUnits(mUsdToken.balance, mUsdToken.decimals));
      }
    } else if (savingsBalance.creditsExact) {
      setQuantity(
        formatUnits(
          savingsBalance.creditsExact.gt('10000000')
            ? savingsBalance.creditsExact
            : 0,
          18,
        ),
        true,
      );
    }
  }, [mUsdToken, savingsBalance, setQuantity, transactionType]);

  const handleUnlock = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onUnlock']>
  >(() => {
    const manifest = {
      iface: mUsdContract,
      fn: 'approve',
      args: [
        savingsContractAddress,
        parseUnits('1844674400000', mUsdToken.decimals),
      ],
    };
    sendTransaction(manifest);
  }, [mUsdToken, savingsContractAddress, sendTransaction, mUsdContract]);

  const toggleTransactionType = useCallback(() => {
    setTransactionType(
      transactionType === TransactionType.Deposit
        ? TransactionType.Withdraw
        : TransactionType.Deposit,
    );
  }, [setTransactionType, transactionType]);

  return (
    <>
      <TransactionTypeRow>
        <div>Deposit</div>
        <ToggleInput
          onClick={toggleTransactionType}
          checked={transactionType === TransactionType.Withdraw}
          enabledColor={Color.blue}
          disabledColor={Color.green}
        />
        <div>Withdraw</div>
      </TransactionTypeRow>
      <FormRow>
        <H3>
          {transactionType === TransactionType.Deposit
            ? 'Depositing'
            : 'Withdrawing'}
        </H3>
        <TokenAmountInput
          name="input"
          tokenValue={input.token.address}
          amountValue={input.formValue}
          onChangeToken={handleChangeToken}
          onChangeAmount={handleChangeAmount}
          onSetMax={handleSetMax}
          tokenAddresses={tokenAddresses}
          tokenDisabled
          items={musdBalanceItem}
          error={error}
          needsUnlock={needsUnlock}
          onUnlock={handleUnlock}
        />
      </FormRow>
    </>
  );
};
