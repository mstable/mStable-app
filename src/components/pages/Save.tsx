import React, {
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { BigNumber, parseUnits } from 'ethers/utils';
import { TokenAmountInput } from '../forms/TokenAmountInput';
import { Form, FormRow } from '../core/Form';
import { useKnownAddress } from '../../context/KnownAddressProvider';
import { ContractNames } from '../../types';
import { useTokenWithBalance } from '../../context/TokensProvider';
import { formatDecimal } from '../../web3/strings';
import { Button } from '../core/Button';
import { Size } from '../../theme';
import { TransactionDetailsDropdown } from '../forms/TransactionDetailsDropdown';
import { P } from '../core/Typography';

enum Action {
  Deposit,
  Withdraw,
}

/**
 * Savings form component
 *
 */
export const Save: FC<{}> = () => {
  // Tokens
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSDToken = useTokenWithBalance(mUSDAddress);
  // const mUSDSavings = useMUSDSavings();

  const decimals = mUSDToken?.decimals;
  const mUSDBalance = mUSDToken?.balance;

  // Form-specific state
  const [error, setError] = useState<string>();
  const [action, setAction] = useState<Action>(Action.Deposit);

  // Input state
  const [amountDecimal, setAmountDecimal] = useState<string>();
  const [amount, setAmount] = useState<BigNumber>();

  // Balances state
  // TODO later: remove fake value, get this value with the contract or subgraph
  const [savingBalance] = useState<BigNumber>(new BigNumber((1e20).toString()));

  // Parse the decimal amount
  useEffect(() => {
    if (!amountDecimal || amountDecimal === '') return;

    try {
      const parsed = parseUnits(amountDecimal, decimals).toString();
      setAmount(new BigNumber(parsed));
    } catch (error_) {
      setError('Invalid amount');
    }
  }, [amountDecimal, decimals]);

  // Validate the amount
  useEffect(() => {
    if (amount == null) return;

    if (amount.lte(0)) {
      setError('Amount must be greater than zero');
    } else if (
      action === Action.Withdraw &&
      savingBalance &&
      amount.gt(savingBalance)
    ) {
      setError(`Saving balance exceeded`);
    } else if (
      action === Action.Deposit &&
      mUSDBalance &&
      amount.gt(mUSDBalance)
    ) {
      setError(`mUSD balance exceeded`);
    } else {
      setError(undefined);
    }
  }, [action, amount, savingBalance, mUSDBalance]);

  const selectDeposit = useCallback(() => {
    setAction(Action.Deposit);
  }, []);

  const selectWithdraw = useCallback(() => {
    setAction(Action.Withdraw);
  }, []);

  const handleChangeAmount = useCallback((_amount: string) => {
    setAmountDecimal(_amount);
  }, []);

  const handleSubmit = useCallback<FormEventHandler>(
    event => {
      event.preventDefault();

      // TODO send a transaction with the values
      // eslint-disable-next-line no-console
      console.log({ action, amount });
    },
    [action, amount],
  );

  const handleSetMax = useCallback(() => {
    const max = action === Action.Deposit ? mUSDBalance : savingBalance;
    if (max && decimals) setAmountDecimal(formatDecimal(max, decimals));
  }, [action, savingBalance, mUSDBalance, decimals, setAmountDecimal]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <Button
          type="button"
          size={Size.m}
          disabled={action === Action.Deposit}
          onClick={selectDeposit}
        >
          Deposit
        </Button>
        <Button
          type="button"
          size={Size.m}
          disabled={action === Action.Withdraw}
          onClick={selectWithdraw}
        >
          Withdraw
        </Button>
      </FormRow>
      <FormRow>
        <TokenAmountInput
          error={error}
          name="TODO"
          amountValue={amountDecimal}
          onChangeAmount={handleChangeAmount}
          onSetMax={handleSetMax}
          tokenValue={mUSDAddress}
          tokenAddresses={mUSDAddress ? [mUSDAddress] : []}
        />
      </FormRow>
      <FormRow>
        <Button type="submit" size={Size.m}>
          Submit
        </Button>
      </FormRow>
      <FormRow>
        <TransactionDetailsDropdown>
          <>
            <P>
              You are depositing {amountDecimal?.toString()} into the mUSD
              savings contract.
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
