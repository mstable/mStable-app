import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';

import styled from 'styled-components';
import { useTokenWithBalance } from '../../../context/DataProvider/TokensProvider';
import { RATIO_SCALE, SCALE } from '../../../web3/constants';
import { formatExactAmount } from '../../../web3/amounts';
import { FormRow } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { Fields } from './types';
import { useSwapDispatch, useSwapState } from './SwapProvider';

const PromoRow = styled(FormRow)`
  font-weight: bold;
  h3 {
    text-transform: uppercase;
  }
  p {
    font-size: 16px;
  }
`;

export const SwapInput: FC<{}> = () => {
  const {
    values: {
      input,
      output,
      input: { token: { address: inputAddress } = { address: null } },
      output: { token: { address: outputAddress } = { address: null } },
    },
    inputError,
    outputError,
    needsUnlock,
    touched,
    mAssetData: { token: mUsdToken, bAssets = [], feeRate } = {},
  } = useSwapState();
  const { setToken, setQuantity } = useSwapDispatch();

  const mAssetAddress = mUsdToken?.address;
  const inputToken = useTokenWithBalance(input.token.address);
  const outputToken = useTokenWithBalance(output.token.address);

  const [inputAddresses, outputAddresses] = useMemo<
    [string[], string[]]
  >(() => {
    if (!(bAssets && mAssetAddress)) return [[], []];

    const bAssetAddresses = bAssets.map(b => b.address);
    return [bAssetAddresses, [mAssetAddress, ...bAssetAddresses]];
  }, [bAssets, mAssetAddress]);

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
      ...(feeRate
        ? [
            {
              label: 'Low fee 🎉',
              // TODO ideally 'see details' would open up the details
              value: `To celebrate our beta launch, fees are at ${formatExactAmount(
                feeRate,
                16,
                '%',
                false,
                3,
              )}`,
              highlight: true,
            },
          ]
        : []),
    ],
    [outputToken, feeRate],
  );

  /**
   * Handle setting the max amount for the input token
   */
  const handleSetMax = useCallback(() => {
    const inputBasset = bAssets.find(b => b.address === input.token.address);
    const outputBasset = bAssets.find(b => b.address === output.token.address);
    const isMint = output.token.address === mUsdToken?.address;

    if (isMint) {
      if (inputBasset?.token.balance && mUsdToken) {
        const ratioedInputBalance = inputBasset.token.balance
          .mul(inputBasset.ratio)
          .div(RATIO_SCALE);
        // Determining max possible mint without pushing bAsset over max weight uses below formula
        // M = ((t * maxW) - c)/(1-maxW)
        // num = ((t * maxW) - c)
        const num1 = parseUnits(mUsdToken.totalSupply, mUsdToken.decimals)
          .mul(inputBasset.maxWeight)
          .div(SCALE);
        const num2 = parseUnits(
          inputBasset.vaultBalance,
          inputBasset.token.decimals,
        )
          .mul(inputBasset.ratio)
          .div(RATIO_SCALE);
        const num = num1.sub(num2);
        // den = (1-maxW)
        const den = SCALE.sub(inputBasset.maxWeight);

        const maxMint = den.gt(0) ? num.mul(SCALE).div(den) : num;
        const clampedMax = maxMint.gt(ratioedInputBalance)
          ? ratioedInputBalance
          : maxMint;
        setQuantity(Fields.Input, formatUnits(clampedMax, 18));
      }
      return;
    }

    if (
      mUsdToken?.totalSupply &&
      inputBasset?.token.decimals &&
      inputBasset?.token.balance &&
      outputBasset
    ) {
      const ratioedInputBalance = inputBasset.token.balance
        .mul(inputBasset.ratio)
        .div(RATIO_SCALE);
      const inputVaultBalance = parseUnits(
        inputBasset.vaultBalance,
        inputBasset.token.decimals,
      )
        .mul(inputBasset.ratio)
        .div(RATIO_SCALE);

      const outputVaultBalance = parseUnits(
        outputBasset.vaultBalance,
        outputBasset.token.decimals,
      )
        .mul(outputBasset.ratio)
        .div(RATIO_SCALE);

      const inputMaxWeight = parseUnits(mUsdToken.totalSupply, 18)
        .mul(inputBasset.maxWeight)
        .div(SCALE);

      let maxIncrease = inputMaxWeight.gt(inputVaultBalance)
        ? inputMaxWeight.sub(inputVaultBalance)
        : new BigNumber(0);
      maxIncrease = maxIncrease.gt(ratioedInputBalance)
        ? ratioedInputBalance
        : maxIncrease;
      const maxDecrease = outputVaultBalance;

      setQuantity(
        Fields.Input,
        formatUnits(
          maxIncrease.lt(maxDecrease) ? maxIncrease : maxDecrease,
          18,
        ),
      );
    }
  }, [
    setQuantity,
    bAssets,
    input.token.address,
    output.token.address,
    mUsdToken,
  ]);

  useEffect(() => {
    if (bAssets && !inputAddress && !touched) {
      const { token, address } = bAssets[0] || {};
      if (token && address) {
        setToken(Fields.Input, { ...token, address });
      }
    }
  }, [inputAddress, setToken, bAssets, touched]);

  return (
    <>
      <PromoRow>
        <H3>Swap</H3>
        <P>mStable offers zero-slippage 1:1 stablecoin swaps.</P>
      </PromoRow>
      <FormRow>
        <H3>Send</H3>
        <TokenAmountInput
          amountValue={input.formValue}
          tokenAddresses={inputAddresses}
          tokenValue={inputAddress}
          name={Fields.Input}
          onChangeAmount={setQuantity}
          onChangeToken={setToken}
          onSetMax={
            input.token.address && output.token.address
              ? handleSetMax
              : undefined
          }
          needsUnlock={needsUnlock}
          items={inputItems}
          error={inputError}
          spender={mAssetAddress}
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
    </>
  );
};
