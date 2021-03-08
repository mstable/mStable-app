import React, { FC, useMemo, useState } from 'react';
import { ISavingsContractV2__factory } from '@mstable/protocol/types/generated/factories/ISavingsContractV2__factory';

import styled from 'styled-components';
import { useThrottleFn } from 'react-use';
import { BigNumber } from 'ethers';
import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import {
  SaveWrapperV2__factory,
  Masset,
  Masset__factory,
} from '../../../../typechain';

import { Interfaces } from '../../../../types';
import { ADDRESSES } from '../../../../constants';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { sanitizeMassetError } from '../../../../utils/strings';
import { BassetState } from '../../../../context/DataProvider/types';
import {
  getBounds,
  getEstimatedOutput,
  getPenaltyMessage,
} from '../../amm/utils';

const formId = 'SaveDepositAMM';

const depositPurpose = {
  present: 'Depositing savings',
  past: 'Deposited savings',
};

const Info = styled(TransactionInfo)`
  margin-top: 0.5rem;
`;

export const SaveDepositAMM: FC<{
  saveAndStake?: boolean;
}> = ({ saveAndStake }) => {
  const signer = useSigner();
  const propose = usePropose();
  const massetName = useSelectedMassetName();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveTokenSymbol = savingsContract?.token?.symbol ?? '';
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;
  const saveWrapperAddress = ADDRESSES[massetName]?.SaveWrapper;
  const canDepositWithWrapper = !!(
    savingsContract?.active && !!saveWrapperAddress
  );

  const bassets = useMemo(
    () =>
      canDepositWithWrapper ? Object.keys(massetState?.bAssets ?? {}) : [],
    [canDepositWithWrapper, massetState?.bAssets],
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const isDepositingBasset = inputAddress && bassets.includes(inputAddress);

  const inputToken = useTokenSubscription(inputAddress);

  const [bAssetOutputAmount, setBAssetOutputAmount] = useState<{
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  }>({});

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      inputToken?.balance &&
      inputToken.balance.simple < inputAmount.simple
    ) {
      return 'Insufficient balance';
    }

    return bAssetOutputAmount?.error;
  }, [bAssetOutputAmount, inputAmount, inputToken]);

  const inputAddressOptions = useMemo(() => {
    return [
      { address: massetAddress as string },
      ...bassets.map(address => ({ address })),
    ];
  }, [massetAddress, bassets]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (!inputAmount || !saveExchangeRate) return {};

    if (bAssetOutputAmount?.value && inputAmount?.simple > 0) {
      return {
        value: bAssetOutputAmount.value
          .divPrecisely(inputAmount)
          .divPrecisely(saveExchangeRate),
      };
    }
    return { value: BigDecimal.ONE.divPrecisely(saveExchangeRate) };
  }, [inputAmount, bAssetOutputAmount, saveExchangeRate]);

  const basset = inputAddress && massetState?.bAssets[inputAddress];

  const masset = useMemo(
    () =>
      massetAddress && signer
        ? Masset__factory.connect(massetAddress, signer)
        : undefined,
    [massetAddress, signer],
  );

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _masset: Masset | undefined,
      _basset: BassetState | undefined | '',
      _inputValue?: BigDecimal,
      _inputAddress?: string,
    ) => {
      if (!(_inputValue && _inputAddress)) return;
      if (_inputValue.simple <= 0) return;

      if (_masset && _basset) {
        setBAssetOutputAmount({ fetching: true });

        const promise = (() => {
          return _masset.getMintOutput(_inputAddress, _inputValue.exact);
        })();

        return promise
          .then((mintOutput: BigNumber): void => {
            setBAssetOutputAmount({
              value: new BigDecimal(mintOutput).setDecimals(
                _basset.token.decimals,
              ),
            });
          })
          .catch((_error: Error): void => {
            setBAssetOutputAmount({
              error: sanitizeMassetError(_error),
            });
          });
      }
      setBAssetOutputAmount({});
    },
    1000,
    [masset, basset, inputAmount, inputAddress],
  );

  const { minOutputAmount, minOutputSaveAmount } = useMemo(() => {
    const _minOutputAmount = BigDecimal.maybeParse(
      (bAssetOutputAmount?.value &&
        slippageSimple &&
        (bAssetOutputAmount?.value.simple * (1 - slippageSimple / 100)).toFixed(
          bAssetOutputAmount?.value.decimals,
        )) ||
        undefined,
    );
    const _minOutputSaveAmount =
      saveExchangeRate && _minOutputAmount?.divPrecisely(saveExchangeRate);

    return {
      minOutputAmount: _minOutputAmount,
      minOutputSaveAmount: _minOutputSaveAmount,
    };
  }, [bAssetOutputAmount, saveExchangeRate, slippageSimple]);

  const penaltyBonusAmount = useMemo<number | undefined>(() => {
    if (!(minOutputAmount && inputAmount)) return;

    const { min, max } = getBounds(inputAmount.simple);
    if (!min || !max) return;

    const output = getEstimatedOutput(minOutputAmount.simple, slippageSimple);
    if (!output) return;

    const penalty = output / inputAmount.simple;
    const percentage = penalty > 1 ? (penalty - 1) * 100 : (1 - penalty) * -100;

    if (output < min || output > max) return percentage;
  }, [inputAmount, minOutputAmount, slippageSimple]);

  const penaltyBonusWarning = useMemo<string | undefined>(
    () => getPenaltyMessage(penaltyBonusAmount),
    [penaltyBonusAmount],
  );

  const depositApprove = useMemo(
    () => ({
      spender: isDepositingBasset
        ? (saveWrapperAddress as string)
        : (saveAddress as string),
      // if no bAssetAmount, fallback to mAssetAmount
      amount: bAssetOutputAmount?.value ?? inputAmount,
      address: inputAddress as string,
    }),
    [
      isDepositingBasset,
      saveWrapperAddress,
      saveAddress,
      bAssetOutputAmount,
      inputAmount,
      inputAddress,
    ],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      outputAddressOptions={[{ address: saveAddress }]}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      error={error ?? penaltyBonusWarning}
      exchangeRate={exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={() =>
        inputToken && setInputFormValue(inputToken.balance.string)
      }
      outputAddressDisabled
    >
      {!saveAndStake && (
        <SendButton
          valid={valid}
          title={`Mint ${saveTokenSymbol}`}
          penaltyBonusAmount={penaltyBonusAmount}
          handleSend={async () => {
            if (
              signer &&
              saveAddress &&
              massetAddress &&
              massetState &&
              inputAmount &&
              inputAddress
            ) {
              if (inputAddress === massetAddress) {
                return propose<
                  Interfaces.SavingsContract,
                  'depositSavings(uint256)'
                >(
                  new TransactionManifest(
                    ISavingsContractV2__factory.connect(saveAddress, signer),
                    'depositSavings(uint256)',
                    [inputAmount.exact],
                    depositPurpose,
                    formId,
                  ),
                );
              }

              if (
                canDepositWithWrapper &&
                isDepositingBasset &&
                minOutputAmount
              ) {
                const manifest = new TransactionManifest<
                  Interfaces.SaveWrapperV2,
                  'saveViaMint'
                >(
                  SaveWrapperV2__factory.connect(
                    saveWrapperAddress as string,
                    signer,
                  ),
                  'saveViaMint',
                  [
                    inputAddress,
                    inputAmount.exact,
                    minOutputAmount.exact,
                    false,
                  ],
                  depositPurpose,
                  formId,
                );
                manifest.setFallbackGasLimit(580000);
                return propose(manifest);
              }
            }
          }}
          approve={depositApprove}
        />
      )}
      {inputAddress !== massetState?.address && (
        <Info
          minOutputAmount={minOutputSaveAmount}
          slippageFormValue={slippageFormValue}
          onSetSlippage={setSlippage}
        />
      )}
    </AssetExchange>
  );
};
