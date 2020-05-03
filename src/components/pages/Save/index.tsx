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
import { CountUp } from '../../core/CountUp';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { FontSize, Size } from '../../../theme';
import { useSignerContext } from '../../../context/SignerProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { SavingsContractFactory } from '../../../typechain/SavingsContractFactory';
import { MusdFactory } from '../../../typechain/MusdFactory';
import { TransactionDetailsDropdown } from '../../forms/TransactionDetailsDropdown';
import {
  useApy,
  useSavingsBalance,
  useIncreasingNumber,
} from '../../../web3/hooks';

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

const CreditBalance = styled.div`
  margin-bottom: 20px;
  img {
    width: 46px;
    margin-right: 10px;
  }
`;

const CreditBalanceCountUp = styled(CountUp)`
  font-size: ${FontSize.insane};
  font-weight: bold;
  font-family: monospace; // TODO get a font like the main font family, but monospace
`;

const APYCountUp = styled(CountUp)`
  font-size: ${FontSize.xl};
`;

const CentredRow = styled(FormRow)`
  text-align: center;
`;

const TransactionTypeRow = styled(FormRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.l} 0`};

  > * {
    padding: 0 8px;
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
      signer && mUSDAddress ? MusdFactory.connect(mUSDAddress, signer) : null,
    [signer, mUSDAddress],
  );

  const savingsBalance = useSavingsBalance(account);
  const savingsBalanceIncreasing = useIncreasingNumber(
    savingsBalance.simple,
    // TODO we could potentially use the APY for the increment and interval;
    // these are fake numbers.
    0.0000001,
    100,
  );

  const apy = useApy();

  const apyPercentage = useMemo<number | null>(
    () => (apy ? parseFloat(formatUnits(apy, 16)) : null),
    [apy],
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
      if (!savingsBalance.exact) {
        setError(Reasons.FetchingData);
        return;
      }

      if (inputAmount.gt(savingsBalance.exact)) {
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
    savingsBalance,
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
    } else if (savingsBalance.simple) {
      setQuantity(savingsBalance.simple.toString());
    }
  }, [mUSD, savingsBalance, setQuantity, transactionType]);

  const handleUnlock = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onUnlock']>
  >(() => {
    const manifest = {
      iface: mUSDContract,
      fn: 'approve',
      args: [
        mUSDSavingsAddress,
        parseUnits(mUSD.totalSupply as string, mUSD.decimals),
      ],
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
      <CentredRow>
        <H3 borderTop>Your mUSD savings balance</H3>
        <CreditBalance>
          <MUSDIconTransparent />
          <CreditBalanceCountUp
            end={savingsBalanceIncreasing || 0}
            decimals={8}
          />
        </CreditBalance>
      </CentredRow>
      <CentredRow>
        <H3 borderTop>Current APY</H3>
        <APYCountUp
          end={apyPercentage || 0}
          suffix="%"
          decimals={2}
        />
      </CentredRow>
      <TransactionTypeRow>
        <TransactionTypeButton
          type="button"
          size={Size.l}
          disabled={transactionType === TransactionType.Deposit}
          onClick={handleDepositButton}
        >
          Deposit
        </TransactionTypeButton>
        <div>or</div>
        <TransactionTypeButton
          type="button"
          size={Size.l}
          disabled={transactionType === TransactionType.Withdraw}
          onClick={handleWithdrawButton}
        >
          Withdraw
        </TransactionTypeButton>
      </TransactionTypeRow>
      <H3 borderTop>
        {transactionType === TransactionType.Deposit
          ? 'Depositing'
          : 'Withdrawing'}
      </H3>
      <FormRow>
        <TokenAmountInput
          name="input"
          tokenValue={input.token.address}
          amountValue={input.formValue}
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
        {input.amount.simple && input.token.symbol ? (
          <TransactionDetailsDropdown>
            <>
              <P size={1}>
                You are{' '}
                {transactionType === TransactionType.Deposit
                  ? 'depositing'
                  : 'withdrawing'}{' '}
                <CountUp
                  end={input.amount.simple}
                  suffix={` ${input.token.symbol}`}
                />
                .
              </P>
              {transactionType === TransactionType.Deposit ? (
                <P size={1}>
                  This amount can be withdrawn at any time, without a fee.
                </P>
              ) : null}
            </>
          </TransactionDetailsDropdown>
        ) : null}
      </FormRow>
    </Form>
  );
};
