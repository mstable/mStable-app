import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';

import { RATIO_SCALE, SCALE } from '../../../web3/constants';
import { formatExactAmount } from '../../../web3/amounts';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { Fields } from './types';
import { useSwapDispatch, useSwapState } from './SwapProvider';
import { BigDecimal } from '../../../web3/BigDecimal';

export const SwapInput: FC<{}> = () => {
  const {
    values: {
      input,
      output,
      feeAmountSimple,
      input: { token: { address: inputAddress } = { address: null } },
      output: { token: { address: outputAddress } = { address: null } },
    },
    inputError,
    outputError,
    needsUnlock,
    touched,
    dataState,
  } = useSwapState();
  const { setToken, setInputQuantity, setOutputQuantity } = useSwapDispatch();

  const { mAsset, bAssets = {} } = dataState || {};
  const mAssetAddress = mAsset?.address;
  const feeRate = mAsset?.feeRate;

  const [inputAddresses, outputAddresses] = useMemo<
    [string[], string[]]
  >(() => {
    if (!(bAssets && mAssetAddress)) return [[], []];

    const bAssetAddresses = Object.keys(bAssets).sort();
    return [bAssetAddresses, [mAssetAddress, ...bAssetAddresses]];
  }, [bAssets, mAssetAddress]);

  const outputItems = useMemo(
    () =>
      feeRate && feeAmountSimple
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
        : [],
    [feeRate, feeAmountSimple],
  );

  /**
   * Handle setting the max amount for the input token
   */
  const handleSetMax = useCallback(() => {
    if (!(inputAddress && outputAddress)) return;

    const inputBasset = bAssets[inputAddress];
    const outputBasset = bAssets[outputAddress];
    const isMint = outputAddress === mAssetAddress;

    if (isMint) {
      if (inputBasset?.balance && mAsset) {
        const ratioedInputBalance = inputBasset.balance.exact
          .mul(inputBasset.ratio)
          .div(RATIO_SCALE);
        // Determining max possible mint without pushing bAsset over max weight uses below formula
        // M = ((t * maxW) - c)/(1-maxW)
        // num = ((t * maxW) - c)
        const num1 = mAsset.totalSupply.exact
          .mul(inputBasset.maxWeight)
          .div(SCALE);
        const num2 = inputBasset.totalVault.exact
          .mul(inputBasset.ratio)
          .div(RATIO_SCALE);
        const num = num1.sub(num2);
        // den = (1-maxW)
        const den = SCALE.sub(inputBasset.maxWeight);

        const maxMint = den.gt(0) ? num.mul(SCALE).div(den) : num;
        const clampedMax = maxMint.gt(ratioedInputBalance)
          ? ratioedInputBalance
          : maxMint;
        setInputQuantity(formatUnits(clampedMax, 18));
      }
      return;
    }

    if (mAsset?.totalSupply && outputBasset) {
      const ratioedInputBalance = inputBasset.balance.exact
        .mul(inputBasset.ratio)
        .div(RATIO_SCALE);
      const inputVaultBalance = inputBasset.totalVault.exact
        .mul(inputBasset.ratio)
        .div(RATIO_SCALE);

      const outputVaultBalance = outputBasset.totalVault.exact
        .mul(outputBasset.ratio)
        .div(RATIO_SCALE);

      const inputMaxWeight = mAsset.totalSupply.exact
        .mul(inputBasset.maxWeight)
        .div(SCALE);

      let maxIncrease = inputMaxWeight.gt(inputVaultBalance)
        ? inputMaxWeight.sub(inputVaultBalance)
        : new BigNumber(0);
      maxIncrease = maxIncrease.gt(ratioedInputBalance)
        ? ratioedInputBalance
        : maxIncrease;
      const maxDecrease = outputVaultBalance;

      setInputQuantity(
        formatUnits(
          maxIncrease.lt(maxDecrease) ? maxIncrease : maxDecrease,
          18,
        ),
      );
    }
  }, [
    inputAddress,
    outputAddress,
    bAssets,
    mAssetAddress,
    mAsset,
    setInputQuantity,
  ]);

  useEffect(() => {
    if (bAssets && !inputAddress && !touched) {
      const [first] = Object.values(bAssets);
      if (first) {
        setToken(Fields.Input, {
          address: first.address,
          decimals: first.decimals,
          symbol: first.symbol,
        });
      }
    }
  }, [inputAddress, setToken, bAssets, touched]);

  const approveAmount = useMemo(
    () =>
      input.amount.exact && input.token.decimals
        ? new BigDecimal(input.amount.exact, input.token.decimals)
        : undefined,
    [input.amount, input.token.decimals],
  );

  return (
    <>
      <FormRow>
        <H3>Send</H3>
        <TokenAmountInput
          amountValue={input.formValue}
          approveAmount={approveAmount}
          tokenAddresses={inputAddresses}
          tokenValue={inputAddress}
          name={Fields.Input}
          onChangeAmount={setInputQuantity}
          onChangeToken={setToken}
          onSetMax={
            input.token.address && output.token.address
              ? handleSetMax
              : undefined
          }
          needsUnlock={needsUnlock}
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
          onChangeAmount={setOutputQuantity}
          onChangeToken={setToken}
          items={outputItems}
          error={outputError}
        />
      </FormRow>
    </>
  );
};
