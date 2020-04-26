import React, {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';
import { formatUnits, parseUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';
import { Form, FormRow, SubmitButton } from '../../core/Form';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { Reasons, TransactionType, useSaveState } from './state';
import {
  useKnownAddress,
  useMUSDSavings,
} from '../../../context/KnownAddressProvider';
import { useTokenWithBalance } from '../../../context/TokensProvider';
import { ContractNames, Interfaces, SendTxManifest } from '../../../types';
import { Button } from '../../core/Button';
import { H3, P } from '../../core/Typography';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { FontSize, Size } from '../../../theme';
import { useCreditBalancesSubscription } from '../../../graphql/generated';
import { parseAmounts } from '../../../web3/amounts';
import { useSignerContext } from '../../../context/SignerProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { SavingsContractFactory } from '../../../typechain/SavingsContractFactory';
import { MUSDFactory } from '../../../typechain/MUSDFactory';
import { TransactionDetailsDropdown } from '../../forms/TransactionDetailsDropdown';

const mapReasonToMessage = (reason: Reasons): string => {
  switch (reason) {
    case Reasons.FetchingData:
      return 'Fetching data';
    case Reasons.AmountMustBeSet:
      return 'Amount must be set';
    case Reasons.AmountMustBeGreaterThanZero:
      return 'Amount must be greater than zero';
    case Reasons.DepositAmountMustNotExceedTokenBalance:
      return 'Deposit amount must not exceed token balance';
    case Reasons.TokenMustBeSelected:
      return 'Token must be selected';
    case Reasons.WithdrawAmountMustNotExceedSavingsBalance:
      return 'Withdraw amount must not exceed savings balance';
    case Reasons.MUSDMustBeUnlocked:
      return 'mUSD must be unlocked first';
    default:
      throw new Error('Unhandled reason');
  }
};

const CreditBalanceRow = styled(FormRow)`
  text-align: center;
`;

const CreditBalance = styled.div`
  font-size: ${FontSize.insane};
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 100%;

  img {
    width: 46px;
    margin-right: 10px;
  }
`;

const TransactionTypeRow = styled(FormRow)`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.l} 0`};

  > :first-child {
    margin-right: ${({ theme }) => theme.spacing.l};
  }
`;

const TransactionTypeButton = styled(Button)`
  opacity: ${({ disabled }) =>
    disabled ? '1' : '0.3'}; // disabled == selected
`;

/**
 * Savings form component
 *
 */
export const Save: FC<{}> = () => {
  const [
    { transactionType, input, error },
    { setError, setToken, setTransactionType, setQuantity },
  ] = useSaveState();

  const {
    token: { address: inputAddress },
    amount: { exact: inputAmount },
  } = input;

  const errorMessage = useMemo(
    () => (error === null ? undefined : mapReasonToMessage(error)),
    [error],
  );

  /**
   * Ref for tracking if the form inputs were touched
   */
  const touched = useRef<boolean>(false);

  const { account } = useWallet();

  const signer = useSignerContext();

  const sendTransaction = useSendTransaction();

  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  const mUSD = useTokenWithBalance(mUSDAddress);
  const mUSDSavings = useMUSDSavings();

  const mUSDSavingsContract = useMemo(
    () =>
      signer && mUSDSavingsAddress
        ? SavingsContractFactory.connect(mUSDSavingsAddress, signer)
        : null,
    [signer, mUSDSavingsAddress],
  );

  const mUSDContract = useMemo(
    () =>
      signer && mUSDAddress ? MUSDFactory.connect(mUSDAddress, signer) : null,
    [signer, mUSDAddress],
  );

  const creditBalances = useCreditBalancesSubscription({
    variables: { account: account ? account.toLowerCase() : '' },
    skip: !account,
  });

  const creditBalanceDecimal =
    creditBalances.data?.account?.creditBalances[0]?.amount || '0.00';

  const creditBalanceQ = useMemo(
    () =>
      parseAmounts({
        amount: { simple: creditBalanceDecimal, exact: null, formatted: null },
        token: { decimals: 18, address: null, symbol: null },
      }),
    [creditBalanceDecimal],
  );

  const tokenAddresses = useMemo<string[]>(
    () => (mUSDAddress ? [mUSDAddress] : []),
    [mUSDAddress],
  );

  const needsUnlock = useMemo<boolean>(
    () =>
      !!(
        transactionType === TransactionType.Deposit &&
        inputAmount &&
        mUSDSavings?.allowance?.lte(inputAmount)
      ),
    [transactionType, inputAmount, mUSDSavings],
  );

  // Set initial values and `touched` ref
  useEffect(() => {
    if (touched.current) return;

    if (inputAmount) {
      touched.current = true;
      return;
    }

    // Set mUSD if the form wasn't touched
    if (mUSD) {
      setToken(mUSD as Required<typeof mUSD>);
    }
  }, [touched, inputAmount, setToken, mUSD]);

  // Run validation
  useEffect(() => {
    if (!touched.current) return;

    if (!inputAmount) {
      setError(Reasons.AmountMustBeSet);
      return;
    }

    if (!inputAmount.gte(0)) {
      setError(Reasons.AmountMustBeGreaterThanZero);
      return;
    }

    if (!inputAddress) {
      setError(Reasons.TokenMustBeSelected);
      return;
    }

    if (transactionType === TransactionType.Deposit) {
      if (!mUSD.balance) {
        setError(Reasons.FetchingData);
        return;
      }

      if (inputAmount.gt(mUSD.balance)) {
        setError(Reasons.DepositAmountMustNotExceedTokenBalance);
        return;
      }

      if (needsUnlock) {
        setError(Reasons.MUSDMustBeUnlocked);
        return;
      }
    }

    if (transactionType === TransactionType.Withdraw) {
      if (!creditBalanceQ.amount.exact) {
        setError(Reasons.FetchingData);
        return;
      }

      if (inputAmount.gt(creditBalanceQ.amount.exact)) {
        setError(Reasons.WithdrawAmountMustNotExceedSavingsBalance);
        return;
      }
    }

    setError(null);
  }, [
    needsUnlock,
    setError,
    inputAmount,
    inputAddress,
    mUSD.balance,
    creditBalanceQ,
    transactionType,
    touched,
  ]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (!error && mUSDSavingsContract && inputAmount) {
        if (transactionType === TransactionType.Deposit) {
          const manifest: SendTxManifest<
            Interfaces.SavingsContract,
            'depositSavings'
          > = {
            iface: mUSDSavingsContract,
            args: [inputAmount],
            fn: 'depositSavings',
          };
          sendTransaction(manifest);
        } else if (transactionType === TransactionType.Withdraw) {
          const manifest: SendTxManifest<
            Interfaces.SavingsContract,
            'redeem'
          > = {
            iface: mUSDSavingsContract,
            args: [inputAmount],
            fn: 'redeem',
          };
          sendTransaction(manifest);
        }
      }
    },
    [error, mUSDSavingsContract, inputAmount, transactionType, sendTransaction],
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
      if (mUSD?.balance) {
        setQuantity(formatUnits(mUSD.balance, mUSD.decimals));
      }
    } else if (creditBalanceDecimal) {
      setQuantity(creditBalanceDecimal);
    }
  }, [mUSD, creditBalanceDecimal, setQuantity, transactionType]);

  const handleUnlock = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onUnlock']>
  >(() => {
    const manifest = {
      iface: mUSDContract,
      fn: 'approve',
      args: [mUSDSavingsAddress, parseUnits(mUSD.totalSupply, mUSD.decimals)],
    };
    sendTransaction(manifest);
  }, [mUSD, mUSDSavingsAddress, sendTransaction, mUSDContract]);

  const handleDepositButton = useCallback(() => {
    setTransactionType(TransactionType.Deposit);
  }, [setTransactionType]);

  const handleWithdrawButton = useCallback(() => {
    setTransactionType(TransactionType.Withdraw);
  }, [setTransactionType]);

  return (
    <Form onSubmit={handleSubmit}>
      <CreditBalanceRow>
        <H3>Your mUSD savings balance</H3>
        <CreditBalance>
          <MUSDIconTransparent />
          {creditBalanceQ.amount.formatted}
        </CreditBalance>
      </CreditBalanceRow>
      <TransactionTypeRow>
        <TransactionTypeButton
          type="button"
          size={Size.l}
          disabled={transactionType === TransactionType.Deposit}
          onClick={handleDepositButton}
        >
          Deposit
        </TransactionTypeButton>
        <TransactionTypeButton
          type="button"
          size={Size.l}
          disabled={transactionType === TransactionType.Withdraw}
          onClick={handleWithdrawButton}
        >
          Withdraw
        </TransactionTypeButton>
      </TransactionTypeRow>
      <H3>
        {transactionType === TransactionType.Deposit
          ? 'Depositing'
          : 'Withdrawing'}
      </H3>
      <FormRow>
        <TokenAmountInput
          name="input"
          tokenValue={input.token.address}
          amountValue={input.amount.simple || ''}
          onChangeToken={handleChangeToken}
          onChangeAmount={handleChangeAmount}
          onSetMax={handleSetMax}
          tokenAddresses={tokenAddresses}
          error={errorMessage}
          needsUnlock={needsUnlock}
          onUnlock={handleUnlock}
        />
      </FormRow>
      <FormRow>
        <SubmitButton
          type="submit"
          size={Size.l}
          disabled={!touched.current || !!errorMessage}
        >
          {transactionType === TransactionType.Deposit ? 'Deposit' : 'Withdraw'}
        </SubmitButton>
        <TransactionDetailsDropdown>
          <>
            <P>
              You are
              {transactionType === TransactionType.Deposit
                ? 'depositing'
                : 'withdrawing'}{' '}
              {input.amount.formatted}.
            </P>
            <P>How about some more details here explaining what the deal is?</P>
            <P>
              Details are really nice and they might go on for a few lines. Here
              is another sentence. Watch out, this sentence ends with an
              exclamation mark!
            </P>
          </>
        </TransactionDetailsDropdown>
      </FormRow>
    </Form>
  );
};
