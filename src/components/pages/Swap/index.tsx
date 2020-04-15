import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { ContractNames, SendTxManifest, TokenQuantity } from '../../../types';
import { useKnownAddress } from '../../../context/KnownAddressProvider';
import { useSignerContext } from '../../../context/SignerProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { useTokenWithBalance } from '../../../context/TokensProvider';
import { useMassetQuery } from '../../../graphql/generated';
import { ForgeValidatorFactory } from '../../../typechain/ForgeValidatorFactory';
import { ERC20DetailedFactory } from '../../../typechain/ERC20DetailedFactory';
import { MUSDFactory } from '../../../typechain/MUSDFactory';
import { parseAmounts } from '../../../web3/amounts';
import { Size } from '../../../theme';
import { TransactionDetailsDropdown } from '../../forms/TransactionDetailsDropdown';
import { Form, FormRow } from '../../core/Form';
import { Button } from '../../core/Button';
import { H3, P } from '../../core/Typography';
import { ReactComponent as ArrowsSVG } from '../arrows.svg';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { Fields, Reasons, TransactionType, useSwapState } from './state';

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

  svg {
    width: 40px;
    height: 40px;
  }
`;

const SubmitButton = styled(Button)`
  color: ${({ theme, disabled }) =>
    disabled ? theme.color.blackTransparent : theme.color.foreground};
  border-color: ${({ theme, disabled }) =>
    disabled ? theme.color.blackTransparent : theme.color.foreground};
  background: ${({ theme, disabled }) =>
    disabled ? 'transparent' : theme.color.gold};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  line-height: 2.5rem;
`;

// Unit based deviation allowance, where 1 == 1e18
const grace = '1000000000000000000000000';

export const Swap: FC<{}> = () => {
  const [state, dispatch] = useSwapState();
  const {
    values: {
      input,
      output,
      input: { token: { address: inputAddress } = { address: null } },
      output: { token: { address: outputAddress } = { address: null } },
    },
    transactionType,
    error,
  } = state;
  const {
    swapTransactionType,
    setError,
    setMUSD,
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
      signer && mUSDAddress ? MUSDFactory.connect(mUSDAddress, signer) : null,
    [signer, mUSDAddress],
  );
  const inputTokenContract = useMemo(
    () =>
      signer && inputAddress
        ? ERC20DetailedFactory.connect(inputAddress, signer)
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
          targetWeight,
          token: { decimals },
        }) => ({
          addr,
          isTransferFeeCharged,
          vaultBalance: parseUnits(vaultBalance, decimals),
          ratio,
          targetWeight,
          // TODO map basset status enum from string
          status: '1',
        }),
      ),
    [bassets],
  );

  const inputToken = useTokenWithBalance(inputAddress);
  const outputToken = useTokenWithBalance(outputAddress);

  const [redemptionFee, netOutput] = useMemo<
    [TokenQuantity | null, TokenQuantity | null]
  >(() => {
    if (
      transactionType === TransactionType.Redeem &&
      feeRate &&
      input.amount.exact &&
      input.token.decimals
    ) {
      const { decimals } = input.token;

      // ethers BigNumber doesn't do scientific notation (1e18)
      const divisor = new BigNumber(10).pow(decimals);
      const feeAmountExact = input.amount.exact.mul(feeRate).div(divisor);
      const feeAmountSimple = formatUnits(feeAmountExact, decimals);

      const netOutputAmountExact = input.amount.exact.sub(feeAmountExact);
      const netOutputAmountSimple = formatUnits(netOutputAmountExact, decimals);

      return [
        parseAmounts({
          amount: {
            simple: feeAmountSimple,
            exact: feeAmountExact,
            formatted: null,
          },
          token: input.token,
        }),
        parseAmounts({
          amount: {
            simple: netOutputAmountSimple,
            exact: netOutputAmountExact,
            formatted: null,
          },
          token: output.token,
        }),
      ];
    }
    return [null, null];
  }, [feeRate, input, output, transactionType]);

  const inputItems = useMemo(
    () => [{ label: 'Balance', value: inputToken?.formattedBalance }],
    [inputToken],
  );

  const outputItems = useMemo(
    () => [
      { label: 'Balance', value: outputToken?.formattedBalance },
      ...(transactionType === TransactionType.Redeem &&
      redemptionFee?.amount?.formatted
        ? [{ label: 'Redemption fee', value: redemptionFee.amount.formatted }]
        : []),
    ],
    [outputToken, transactionType, redemptionFee],
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
        parseUnits(inputToken.totalSupply, inputToken.decimals),
      ],
    };
    sendTransaction(manifest);
  }, [inputToken, inputTokenContract, outputAddress, sendTransaction]);

  /**
   * Handle setting the max amount for the input token
   */
  const handleSetMax = useCallback(() => {
    if (inputToken?.formattedBalance) {
      setQuantity(Fields.Input, inputToken.formattedBalance);
    }
  }, [setQuantity, inputToken]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (
        error === null &&
        mUSDContract &&
        input.amount.exact &&
        input.token.address &&
        output.token.address &&
        output.amount.exact
      ) {
        if (transactionType === TransactionType.Mint) {
          const manifest: SendTxManifest<0, 'mint'> = {
            iface: mUSDContract,
            fn: 'mint',
            args: [input.token.address, input.amount.exact],
          };
          sendTransaction(manifest);
        } else if (transactionType === TransactionType.Redeem) {
          const manifest: SendTxManifest<0, 'redeem'> = {
            iface: mUSDContract,
            fn: 'redeem',
            args: [output.token.address, output.amount.exact],
          };
          sendTransaction(manifest);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactionType, mUSDContract, error, input, output, sendTransaction],
  );

  /**
   * Effect: perform validation
   */
  useEffect(() => {
    if (!touched.current) {
      // No validation needed if the form wasn't touched yet
      return;
    }

    if (!(input.amount.simple && output.amount.simple)) {
      setError(Reasons.AmountMustBeSet, Fields.Input);
      return;
    }

    if (input.amount.exact?.lte(0)) {
      setError(Reasons.AmountMustBeGreaterThanZero, Fields.Input);
      return;
    }

    if (input.amount.simple && !input.token.address) {
      setError(Reasons.TokenMustBeSelected, Fields.Input);
      return;
    }

    if (output.amount.simple && !output.token.address) {
      setError(Reasons.TokenMustBeSelected, Fields.Output);
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

    const totalSupply = parseUnits(mUSD.token.totalSupply, mUSD.token.decimals);

    const validatePromise =
      transactionType === TransactionType.Mint
        ? forgeValidatorContract.validateMint(
            totalSupply,
            grace,
            allBassets.find(b => b.addr === inputAddress) as NonNullable<
              Parameters<typeof forgeValidatorContract['validateMint']>[2]
            >,
            input.amount.exact,
          )
        : forgeValidatorContract.validateRedemption(
            mUSD.basket.failed,
            totalSupply,
            allBassets,
            grace,
            allBassets.findIndex(b => b.addr === outputAddress),
            output.amount.exact,
          );

    validatePromise
      .then(({ '0': isValid, '1': reason }) => {
        setError(isValid ? null : mapForgeValidatorResponseToReason(reason));
      })
      .catch(error_ => {
        // eslint-disable-next-line no-console
        console.error(error_);
        setError(Reasons.ValidationFailed);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, output, touched, needsUnlock]);

  // Set initial values
  useEffect(() => {
    if (touched.current) return;
    if (outputAddress) {
      touched.current = true;
      return;
    }
    // Set mUSD if the form wasn't touched
    if (mUSD) {
      setMUSD({
        address: mUSD.id,
        decimals: mUSD.token.decimals,
        symbol: mUSD.token.symbol,
      });
    }
  }, [outputAddress, mUSDAddress, touched, setMUSD, mUSD]);

  return (
    <Form error={formError} onSubmit={handleSubmit}>
      <H3>Send</H3>
      <FormRow>
        <TokenAmountInput
          amountValue={input.amount.simple || ''}
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
      <H3>Receive</H3>
      <FormRow>
        <TokenAmountInput
          amountValue={netOutput?.amount.simple || output.amount.simple || ''}
          tokenAddresses={allTokenAddresses}
          tokenValue={outputAddress}
          name={Fields.Output}
          onChangeAmount={setQuantity}
          onChangeToken={setToken}
          items={outputItems}
          error={outputError}
        />
      </FormRow>
      <SubmitButton type="submit" size={Size.l} disabled={submitButtonDisabled}>
        Swap
      </SubmitButton>
      <TransactionDetailsDropdown>
        <>
          <P>
            You are swapping {input.amount.formatted} for
            {output.amount.formatted} (1:1).
          </P>
          <P>How about some more details here explaining what the deal is?</P>
          <P>
            Details are really nice and they might go on for a few lines. Here
            is another sentence. Watch out, this sentence ends with an
            exclamation mark!
          </P>
        </>
      </TransactionDetailsDropdown>
    </Form>
  );
};
