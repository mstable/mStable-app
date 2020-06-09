import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { formatUnits, parseUnits } from 'ethers/utils';

import {
  useMusdData,
  useMusdSavingsAllowance,
  useSavingsBalance,
} from '../../../context/DataProvider/DataProvider';
import { useTokenWithBalance } from '../../../context/DataProvider/TokensProvider';
import { Color } from '../../../theme';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { ToggleInput } from '../../forms/ToggleInput';
import { formatExactAmount } from '../../../web3/amounts';
import { TransactionType } from './types';
import { useSaveDispatch, useSaveState } from './SaveProvider';
import { useKnownAddress } from '../../../context/DataProvider/KnownAddressProvider';
import { ContractNames } from '../../../types';

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

  const mUsd = useMusdData();
  const mUsdAddress = mUsd?.token.address || null;

  const mUsdToken = useTokenWithBalance(mUsdAddress);
  const allowance = useMusdSavingsAllowance();
  const savingsBalance = useSavingsBalance();
  const savingsContractAddress = useKnownAddress(ContractNames.mUSDSavings);
  const approveQuantity = useMemo(
    () => parseUnits('1844674400000', mUsdToken.decimals),
    [mUsdToken],
  );

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
        allowance?.lt(inputAmount)
      ),
    [transactionType, inputAmount, allowance],
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
          spender={savingsContractAddress as string}
          approveQuantity={approveQuantity}
        />
      </FormRow>
    </>
  );
};
