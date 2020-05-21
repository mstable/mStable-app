import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';
import { A } from 'hookrouter';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { useTokenWithBalance } from '../../../context/DataProvider/TokensProvider';
import {
  useErc20Contract,
  useMusdContract,
} from '../../../context/DataProvider/ContractsProvider';
import { useMusdData } from '../../../context/DataProvider/DataProvider';
import { Size } from '../../../theme';
import { TransactionDetailsDropdown } from '../../forms/TransactionDetailsDropdown';
import { Form, FormRow, SubmitButton } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { formatExactAmount } from '../../../web3/amounts';
import { Interfaces, SendTxManifest } from '../../../types';
import { CountUp } from '../../core/CountUp';
import { ReactComponent as ArrowsSVG } from '../arrows.svg';
import { Fields, Mode } from './types';
import { useSwapState } from './state';

const SwapDirectionButton = styled.div<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;

  svg {
    width: 40px;
    height: 40px;
  }

  ${({ disabled }) => (disabled ? 'opacity: 0.5; cursor: not-allowed;' : '')}
`;

export const Swap: FC<{}> = () => {
  const [
    {
      mode,
      values: {
        input,
        output,
        input: { token: { address: inputAddress } = { address: null } },
        output: { token: { address: outputAddress } = { address: null } },
        feeAmountSimple,
      },
      error,
    },
    { invertDirection, setToken, setQuantity, setError, updateMassetData },
  ] = useSwapState();

  const inputToken = useTokenWithBalance(input.token.address);
  const outputToken = useTokenWithBalance(output.token.address);

  const needsUnlock = useMemo<boolean>(
    () =>
      !!(
        mode === Mode.MintSingle &&
        input.token.address &&
        input.amount.exact &&
        outputToken.allowance &&
        outputToken.allowance[input.token.address]?.lt(input.amount.exact)
      ),
    [mode, input, outputToken],
  );

  const mUsdData = useMusdData();
  const { token: mUsdToken, bAssets } = mUsdData;
  useEffect(() => {
    updateMassetData(mUsdData);
  }, [updateMassetData, mUsdData]);

  const touched = useRef<boolean>(false);
  useEffect(() => {
    if (touched.current) return;

    if (output.amount.simple || input.amount.simple) {
      touched.current = true;
    }
  }, [touched, input, output]);

  // TODO this validation should also highlight invalid pairs (e.g. when
  // weight limits are in effect)
  useEffect(() => {
    if (!touched.current) {
      // No validation needed if the form wasn't touched yet
      return;
    }

    if (input.amount.simple && !input.token.address) {
      setError('Token must be selected', Fields.Input);
      return;
    }

    if (!input.amount.simple) {
      setError('Amount must be set', Fields.Input);
      return;
    }

    if (input.amount.exact?.lte(0)) {
      setError('Amount must be greater than zero', Fields.Input);
      return;
    }

    if (inputToken?.balance && input.amount.exact?.gt(inputToken.balance)) {
      setError('Insufficient balance', Fields.Input);
      return;
    }

    if (output.amount.simple && !output.token.address) {
      setError('Token must be selected', Fields.Output);
      return;
    }

    if (needsUnlock) {
      setError('Token must be approved', Fields.Input);
      return;
    }

    // TODO this should only happen when the field is unset, but currently
    // there is a bug that doesn't set it initially (when it could be inferred)
    if (!input.amount.exact || (output.token.address && !output.amount.exact)) {
      setError('Amount must be set', Fields.Output);
      return;
    }

    setError(null);
  }, [inputToken, mUsdToken, needsUnlock, setError, input, output]);

  /**
   * Error message strings
   */
  const { formError, inputError, outputError } = useMemo<{
    formError?: string;
    inputError?: string;
    outputError?: string;
  }>(
    () =>
      error === null
        ? {}
        : {
            [error.field === Fields.Input
              ? 'inputError'
              : error.field === Fields.Output
              ? 'outputError'
              : 'formError']: error.reason,
          },
    [error],
  );

  /**
   * Blockchain goodies
   */
  const sendTransaction = useSendTransaction();
  const inputTokenContract = useErc20Contract(inputAddress);
  const { account } = useWallet();
  const mUsdContract = useMusdContract();

  const [inputAddresses, outputAddresses] = useMemo<
    [string[], string[]]
  >(() => {
    if (!(bAssets && mUsdToken?.address)) return [[], []];

    const bAssetAddresses = bAssets.map(b => b.address);
    return [bAssetAddresses, [mUsdToken.address, ...bAssetAddresses]];
  }, [bAssets, mUsdToken]);

  const inputItems = useMemo(
    () => [
      {
        label: 'Balance',
        value: formatExactAmount(
          inputToken.balance,
          inputToken.decimals,
          inputToken.symbol,
          true,
        ),
      },
    ],
    [inputToken],
  );

  const outputItems = useMemo(
    () => [
      {
        label: 'Balance',
        value: formatExactAmount(
          outputToken.balance,
          outputToken.decimals,
          outputToken.symbol,
          true,
        ),
      },
      ...(feeAmountSimple
        ? [
            {
              label: 'Note',
              // TODO ideally 'see details' would open up the details
              value: 'Swap fee applies (see details below)',
            },
          ]
        : []),
    ],
    [outputToken, feeAmountSimple],
  );

  const valid = useMemo<boolean>(
    () =>
      !!(
        error === null &&
        input.amount.exact &&
        input.token.address &&
        output.amount.exact &&
        output.token.address
      ),
    [error, input, output],
  );

  /**
   * Handle the unlocking of bAssets
   */
  const handleUnlock = useCallback(() => {
    const manifest = {
      iface: inputTokenContract,
      fn: 'approve',
      args: [
        outputAddress,
        parseUnits(inputToken.totalSupply as string, inputToken.decimals),
      ],
    };
    sendTransaction(manifest);
  }, [inputToken, inputTokenContract, outputAddress, sendTransaction]);

  /**
   * Handle setting the max amount for the input token
   */
  const handleSetMax = useCallback(() => {
    if (inputToken?.balance) {
      // TODO because of weight limits; under less-than-ideal
      // conditions, the max valid swap can be lower than the user's balance
      setQuantity(
        Fields.Input,
        formatUnits(inputToken.balance, inputToken.decimals),
      );
    }
  }, [setQuantity, inputToken]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (
        account &&
        error === null &&
        mUsdContract &&
        input.amount.exact &&
        input.token.address &&
        output.token.address &&
        output.amount.exact
      ) {
        const args: [string, string, BigNumber, string] =
          mode === Mode.MintSingle
            ? [
                input.token.address,
                output.token.address,
                input.amount.exact,
                account,
              ]
            : [
                output.token.address,
                input.token.address,
                input.amount.exact,
                account,
              ];
        const manifest: SendTxManifest<Interfaces.Masset, 'swap'> = {
          iface: mUsdContract,
          fn: 'swap',
          args,
        };
        sendTransaction(manifest);
      }
    },
    [account, error, input, mUsdContract, mode, output, sendTransaction],
  );

  return (
    <Form error={formError} onSubmit={handleSubmit}>
      <FormRow>
        <H3>Send</H3>
        <TokenAmountInput
          amountValue={input.formValue}
          tokenAddresses={inputAddresses}
          tokenValue={inputAddress}
          name={Fields.Input}
          onChangeAmount={setQuantity}
          onChangeToken={setToken}
          onSetMax={handleSetMax}
          onUnlock={handleUnlock}
          needsUnlock={needsUnlock}
          items={inputItems}
          error={inputError}
        />
      </FormRow>
      <SwapDirectionButton
        onClick={invertDirection}
        title="Change direction"
        disabled={mode === Mode.MintSingle}
      >
        <ArrowsSVG />
      </SwapDirectionButton>
      <FormRow>
        <H3>Receive</H3>
        <TokenAmountInput
          amountValue={output.formValue}
          tokenAddresses={outputAddresses}
          tokenValue={outputAddress}
          name={Fields.Output}
          onChangeAmount={setQuantity}
          onChangeToken={setToken}
          items={outputItems}
          error={outputError}
        />
      </FormRow>
      <div>
        <SubmitButton type="submit" size={Size.l} disabled={!valid}>
          Swap
        </SubmitButton>
        {input.amount.simple &&
        input.token.symbol &&
        output.amount.simple &&
        output.token.symbol ? (
          <TransactionDetailsDropdown>
            <>
              <P size={1}>
                You are swapping{' '}
                <CountUp
                  end={input.amount.simple}
                  suffix={` ${input.token.symbol}`}
                />{' '}
                for{' '}
                <CountUp
                  end={output.amount.simple}
                  suffix={` ${output.token.symbol}`}
                />
                {feeAmountSimple ? '' : ' (1:1)'}.
              </P>
              {feeAmountSimple ? (
                <>
                  <P size={1}>
                    This includes a swap fee of{' '}
                    <CountUp
                      end={parseFloat(feeAmountSimple)}
                      decimals={4}
                      suffix=" mUSD"
                    />
                    .
                  </P>
                  <P size={1}>
                    Read more about the mStable swap fee{' '}
                    <A href="https://docs.mstable.org/mstable-assets/massets/minting-and-redemption#redeeming">
                      here
                    </A>
                    .
                  </P>
                </>
              ) : null}
            </>
          </TransactionDetailsDropdown>
        ) : null}
      </div>
    </Form>
  );
};
