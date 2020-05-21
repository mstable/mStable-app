import React, { FC, useCallback, useEffect, useMemo } from 'react';
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
import { Fields } from './types';
import { useSwapState } from './state';

export const Swap: FC<{}> = () => {
  const [
    {
      values: {
        input,
        output,
        input: { token: { address: inputAddress } = { address: null } },
        output: { token: { address: outputAddress } = { address: null } },
        feeAmountSimple,
      },
      valid,
      inputError,
      outputError,
      needsUnlock,
    },
    { setToken, setQuantity, updateMassetData },
  ] = useSwapState();

  const inputToken = useTokenWithBalance(input.token.address);
  const outputToken = useTokenWithBalance(output.token.address);

  const mUsdData = useMusdData();
  const { token: mUsdToken, bAssets } = mUsdData;
  useEffect(() => {
    updateMassetData(mUsdData);
  }, [updateMassetData, mUsdData]);

  const isMint =
    output.token.address && output.token.address === mUsdToken.address;

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

      if (account && valid && mUsdContract) {
        if (isMint) {
          const manifest: SendTxManifest<Interfaces.Masset, 'mint'> = {
            iface: mUsdContract,
            fn: 'mint',
            args: [
              input.token.address as string,
              input.amount.exact as BigNumber,
            ],
          };
          sendTransaction(manifest);
        } else {
          const manifest: SendTxManifest<Interfaces.Masset, 'swap'> = {
            iface: mUsdContract,
            fn: 'swap',
            args: [
              input.token.address as string,
              output.token.address as string,
              input.amount.exact as BigNumber,
              account,
            ],
          };
          sendTransaction(manifest);
        }
      }
    },
    [account, valid, input, mUsdContract, isMint, output, sendTransaction],
  );

  return (
    <Form onSubmit={handleSubmit}>
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
