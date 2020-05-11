import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { BigNumber, bigNumberify, formatUnits, parseUnits } from 'ethers/utils';
import { A } from 'hookrouter';
import { useWallet } from 'use-wallet';
import { ContractNames, Interfaces, SendTxManifest } from '../../../types';
import { useKnownAddress } from '../../../context/KnownAddressProvider';
import { useSignerContext } from '../../../context/SignerProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { useTokenWithBalance } from '../../../context/TokensProvider';
import { useMassetQuery } from '../../../graphql/generated';
import { ForgeValidatorFactory } from '../../../typechain/ForgeValidatorFactory';
import { Erc20DetailedFactory } from '../../../typechain/Erc20DetailedFactory';
import { MassetFactory } from '../../../typechain/MassetFactory';
import { Size } from '../../../theme';
import { TransactionDetailsDropdown } from '../../forms/TransactionDetailsDropdown';
import { Form, FormRow, SubmitButton } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { ReactComponent as ArrowsSVG } from '../arrows.svg';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { Fields, Reasons, TransactionType, useSwapState } from './state';
import { formatExactAmount } from '../../../web3/amounts';
import { CountUp } from '../../core/CountUp';

const mapForgeValidatorResponseToReason = (response: string): Reasons => {
  switch (response) {
    case 'bAsset not allowed in mint':
      return Reasons.BAssetNotAllowedInMint;
    case 'Must be below implicit max weighting':
      return Reasons.MustBeBelowImplicitMaxWeighting;
    case 'Must redeem overweight bAssets':
      return Reasons.MustRedeemOverweightBAssets;
    case 'bAssets must remain under max weight':
      return Reasons.BAssetsMustRemainUnderMaxWeight;
    case 'bAssets must remain above implicit min weight':
      return Reasons.BAssetsMustRemainAboveImplicitMinWeight;
    case 'Input length should be equal':
      return Reasons.InputLengthShouldBeEqual;
    default:
      throw new Error(`Unknown response ${response}`);
  }
};

const mapReasonToMessage = (reason: Reasons): string => {
  switch (reason) {
    case Reasons.AmountMustBeSet:
      return 'Amount must be set';
    case Reasons.AmountMustBeGreaterThanZero:
      return 'Amount must be greater than zero';
    case Reasons.AmountMustNotExceedBalance:
      return 'Amount must not exceed balance';
    case Reasons.AmountCouldNotBeParsed:
      return 'Amount could not be parsed';
    case Reasons.TokenMustBeSelected:
      return 'Token must be selected';
    case Reasons.TokenMustBeUnlocked:
      return 'Token must be unlocked';
    case Reasons.FetchingData:
      return 'Fetching data...';
    case Reasons.ValidationFailed:
      return 'Validation failed';

    // TODO edit messages for these:
    case Reasons.BAssetNotAllowedInMint:
      return 'bAsset not allowed in mint';
    case Reasons.MustBeBelowImplicitMaxWeighting:
      return 'Must be below implicit max weighting';
    case Reasons.MustRedeemOverweightBAssets:
      return 'Must redeem overweight bAssets';
    case Reasons.BAssetsMustRemainUnderMaxWeight:
      return 'bAssets must remain under max weight';
    case Reasons.BAssetsMustRemainAboveImplicitMinWeight:
      return 'bAssets must remain above implicit min weight';
    case Reasons.InputLengthShouldBeEqual:
      return 'Input length should be equal';

    default:
      return 'Unknown reason';
  }
};

const SwapDirectionButton = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;

  svg {
    width: 40px;
    height: 40px;
  }
`;

export const Swap: FC<{}> = () => {
  const [state, dispatch] = useSwapState();
  const {
    values: {
      input,
      output,
      input: { token: { address: inputAddress } = { address: null } },
      output: { token: { address: outputAddress } = { address: null } },
      feeAmountSimple,
    },
    transactionType,
    error,
  } = state;
  const {
    swapTransactionType,
    setError,
    setMUSD,
    setFeeRate,
    setToken,
    setQuantity,
  } = dispatch;

  /**
   * Ref for tracking if the form inputs were touched
   */
  const touched = useRef<boolean>(false);

  /**
   * Error message strings (mapped from reasons)
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
              : 'formError']: mapReasonToMessage(error.reason),
          },
    [error],
  );

  /**
   * Blockchain goodies
   */
  const signer = useSignerContext();
  const sendTransaction = useSendTransaction();
  const { account } = useWallet();
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSDForgeValidatorAddress = useKnownAddress(
    ContractNames.mUSDForgeValidator,
  );

  const forgeValidatorContract = useMemo(
    () =>
      signer && mUSDForgeValidatorAddress
        ? ForgeValidatorFactory.connect(mUSDForgeValidatorAddress, signer)
        : null,
    [signer, mUSDForgeValidatorAddress],
  );
  const mUSDContract = useMemo(
    () =>
      signer && mUSDAddress ? MassetFactory.connect(mUSDAddress, signer) : null,
    [signer, mUSDAddress],
  );
  const inputTokenContract = useMemo(
    () =>
      signer && inputAddress
        ? Erc20DetailedFactory.connect(inputAddress, signer)
        : null,
    [signer, inputAddress],
  );

  /**
   * GraphQL data
   */
  // TODO use loading prop
  const { data: { masset: mUSD } = {} } = useMassetQuery({
    variables: { id: mUSDAddress || '' },
  });
  const allTokenAddresses = useMemo<string[]>(
    () => (mUSD ? [mUSD.id, ...mUSD.basket.bassets.map(b => b.id)] : []),
    [mUSD],
  );
  const { basket: { bassets = [] } = {}, feeRate } = mUSD || {};

  /**
   * Subsets of data from inputs/outputs
   */
  const allBassets = useMemo(
    () =>
      bassets.map(
        ({
          id: addr,
          isTransferFeeCharged,
          vaultBalance,
          ratio,
          maxWeight,
          token: { decimals },
        }) => ({
          addr,
          isTransferFeeCharged,
          vaultBalance: parseUnits(vaultBalance, decimals),
          ratio,
          maxWeight,
          // TODO map basset status enum from string
          status: '1',
        }),
      ),
    [bassets],
  );

  const inputToken = useTokenWithBalance(inputAddress);
  const outputToken = useTokenWithBalance(outputAddress);

  const inputItems = useMemo(
    () => [
      {
        label: 'Balance',
        value: formatExactAmount(inputToken.balance, inputToken.decimals),
      },
    ],
    [inputToken],
  );
  const outputItems = useMemo(
    () => [
      {
        label: 'Balance',
        value: formatExactAmount(outputToken.balance, outputToken.decimals),
      },
      ...(feeAmountSimple
        ? [
            {
              label: 'Note',
              // TODO ideally 'see details' would open up the details
              value: 'Redemption fee applies (see details below)',
            },
          ]
        : []),
    ],
    [outputToken, feeAmountSimple],
  );

  /**
   * Flag for whether mUSD needs approval to spend the input token (for minting)
   */
  const needsUnlock = useMemo<boolean>(
    () =>
      !!(
        transactionType === TransactionType.Mint &&
        input.token.address &&
        input.amount.exact &&
        outputToken.allowance &&
        outputToken.allowance[input.token.address]?.lte(input.amount.exact)
      ),
    [transactionType, input, outputToken],
  );

  const submitButtonDisabled = useMemo<boolean>(
    () =>
      !(
        error === null &&
        input.amount.exact &&
        input.token.address &&
        output.amount.exact &&
        output.token.address &&
        !needsUnlock
      ),
    [error, needsUnlock, input, output],
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
        mUSDContract &&
        input.amount.exact &&
        input.token.address &&
        output.token.address &&
        output.amount.exact
      ) {
        // TODO rename, this is rather direction than mint/redeem
        const args: [string, string, BigNumber, string] =
          transactionType === TransactionType.Mint
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
          iface: mUSDContract,
          fn: 'swap',
          args,
        };
        sendTransaction(manifest);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactionType, mUSDContract, error, input, output, sendTransaction],
  );

  // Set the `touched` state when an amount is first set
  useEffect(() => {
    if (touched.current) return;

    if (output.amount.simple || input.amount.simple) {
      touched.current = true;
    }
  }, [touched, input, output]);

  // Set mUSD if the form wasn't touched
  useEffect(() => {
    if (touched.current) return;

    if (mUSD) {
      setMUSD({
        address: mUSD.id,
        decimals: mUSD.token.decimals,
        symbol: mUSD.token.symbol,
      });
    }
  }, [mUSDAddress, touched, setMUSD, mUSD]);

  // Set fee rate (should just happen once)
  useEffect(() => {
    if (feeRate) setFeeRate(bigNumberify(feeRate));
  }, [feeRate, setFeeRate]);

  /**
   * Effect: perform validation
   */
  useEffect(() => {
    if (!touched.current) {
      // No validation needed if the form wasn't touched yet
      return;
    }

    if (input.amount.simple && !input.token.address) {
      setError(Reasons.TokenMustBeSelected, Fields.Input);
      return;
    }

    if (!input.amount.simple) {
      setError(Reasons.AmountMustBeSet, Fields.Input);
      return;
    }

    if (
      (output.amount.simple || transactionType === TransactionType.Redeem) &&
      !output.token.address
    ) {
      setError(Reasons.TokenMustBeSelected, Fields.Output);
      return;
    }

    if (input.amount.exact?.lte(0)) {
      setError(Reasons.AmountMustBeGreaterThanZero, Fields.Input);
      return;
    }

    if (!input.amount.exact || !output.amount.exact) {
      setError(Reasons.AmountCouldNotBeParsed, Fields.Input);
      return;
    }

    if (inputToken?.balance && input.amount.exact?.gt(inputToken.balance)) {
      setError(Reasons.AmountMustNotExceedBalance, Fields.Input);
      return;
    }

    if (needsUnlock) {
      setError(Reasons.TokenMustBeUnlocked, Fields.Input);
      return;
    }

    if (!(mUSD && forgeValidatorContract && input.amount.simple)) {
      setError(Reasons.FetchingData);
      return;
    }

    const totalSupply = parseUnits(
      mUSD.token.totalSupply as string,
      mUSD.token.decimals,
    );

    // TODO typechain bug: return values parsed differently
    if (transactionType === TransactionType.Mint) {
      forgeValidatorContract
        .validateMint(
          totalSupply,
          allBassets.find(b => b.addr === inputAddress) as NonNullable<
            Parameters<typeof forgeValidatorContract['validateMint']>[1]
          >,
          input.amount.exact,
        )
        .then(({ isValid, reason }) => {
          setError(isValid ? null : mapForgeValidatorResponseToReason(reason));
        })
        .catch(error_ => {
          // eslint-disable-next-line no-console
          console.error(error_);
          setError(Reasons.ValidationFailed);
        });
    } else {
      forgeValidatorContract
        .validateRedemption(
          mUSD.basket.failed,
          totalSupply,
          allBassets,
          [allBassets.findIndex(b => b.addr === outputAddress) as number],
          [output.amount.exact],
        )
        .then(({ '0': isValid, '1': reason }) => {
          setError(isValid ? null : mapForgeValidatorResponseToReason(reason));
        })
        .catch(error_ => {
          // eslint-disable-next-line no-console
          console.error(error_);
          setError(Reasons.ValidationFailed);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, output, touched, needsUnlock]);

  return (
    <Form error={formError} onSubmit={handleSubmit}>
      <FormRow>
        <H3>Send</H3>
        <TokenAmountInput
          amountValue={input.formValue}
          tokenAddresses={allTokenAddresses}
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
        onClick={swapTransactionType}
        title="Change direction"
      >
        <ArrowsSVG />
      </SwapDirectionButton>
      <FormRow>
        <H3>Receive</H3>
        <TokenAmountInput
          amountValue={output.formValue}
          tokenAddresses={allTokenAddresses}
          tokenValue={outputAddress}
          name={Fields.Output}
          onChangeAmount={setQuantity}
          onChangeToken={setToken}
          items={outputItems}
          error={outputError}
        />
      </FormRow>
      <div>
        <SubmitButton
          type="submit"
          size={Size.l}
          disabled={submitButtonDisabled}
        >
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
                    This includes a redemption fee of{' '}
                    <CountUp end={parseFloat(feeAmountSimple)} suffix=" mUSD" />
                    .
                  </P>
                  <P size={1}>
                    Read more about the mStable redemption fee{' '}
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
