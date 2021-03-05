import React, { FC, useMemo, useState } from 'react';
import { BoostedSavingsVault__factory } from '@mstable/protocol/types/generated/factories/BoostedSavingsVault__factory';
import { ISavingsContractV2__factory } from '@mstable/protocol/types/generated/factories/ISavingsContractV2__factory';

import styled from 'styled-components';
import { useThrottleFn } from 'react-use';
import { BigNumber } from 'ethers';
import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import {
  SaveWrapper__factory,
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
import { BigDecimalInputValue } from '../../../../hooks/useBigDecimalInputs';
import { sanitizeMassetError } from '../../../../utils/strings';
import { Basset } from '../../../../graphql/protocol';
import { BassetState } from '../../../../context/DataProvider/types';

const formId = 'SaveDepositAMM';

const depositPurpose = {
  present: 'Depositing savings',
  past: 'Deposited savings',
};

const depositAndStakePurpose = {
  present: 'Depositing and staking savings',
  past: 'Deposited and staked savings',
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
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const vaultBalance = vault?.account?.rawBalance ?? BigDecimal.ZERO;
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

  const isDepositingSave = inputAddress === saveAddress;
  const isDepositingBasset = inputAddress && bassets.includes(inputAddress);

  const inputToken = useTokenSubscription(inputAddress);

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      inputToken?.balance &&
      inputToken.balance.simple < inputAmount.simple
    ) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [inputAmount, inputToken]);

  const inputAddressOptions = useMemo(() => {
    return [
      { address: massetAddress as string },
      ...bassets.map(address => ({ address })),
    ];
  }, [massetAddress, bassets]);

  const [outputAmount, setOutputAmount] = useState<{
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  }>({});

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (
      isDepositingSave ||
      !inputAmount ||
      !saveExchangeRate ||
      !outputAmount?.value
    )
      return {};

    return {
      value: outputAmount.value
        .divPrecisely(inputAmount)
        .divPrecisely(saveExchangeRate),
    };
    // return { value: BigDecimal.ONE.divPrecisely(saveExchangeRate) };
  }, [inputAmount, isDepositingSave, outputAmount.value, saveExchangeRate]);

  const basset = inputAddress && massetState?.bAssets[inputAddress];

  const masset = useMemo(
    () =>
      massetAddress && signer
        ? Masset__factory.connect(massetAddress, signer)
        : undefined,
    [massetAddress, signer],
  );

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _masset: Masset | undefined,
      _basset: BassetState | undefined | '',
      _inputValue?: BigDecimal,
      _inputAddress?: string,
      _exchangeRate?: BigDecimal | undefined,
    ) => {
      if (!(_inputValue && _inputAddress && _exchangeRate)) return;
      if (_inputValue.simple <= 0) return;

      if (_masset && _basset) {
        setOutputAmount({ fetching: true });

        const promise = (() => {
          return _masset.getMintOutput(_inputAddress, _inputValue.exact);
        })();

        return promise
          .then((mintOutput: BigNumber): void => {
            setOutputAmount({
              value: new BigDecimal(mintOutput).setDecimals(
                _basset.token.decimals,
              ),
            });
          })
          .catch((_error: Error): void => {
            setOutputAmount({
              error: sanitizeMassetError(_error),
            });
          });
      }
      setOutputAmount({});
    },
    1000,
    [masset, basset, inputAmount, inputAddress, saveExchangeRate],
  );

  // const scaledInputAmount = useMemo<BigDecimal | undefined>(
  //   () =>
  //     basset && outputAmount.value
  //       ? outputAmount.value
  //           .divRatioPrecisely(basset.ratio)
  //           .setDecimals(basset.token.decimals)
  //       : outputAmount.value,
  //   [basset, outputAmount],
  // );

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const { minOutputAmount, minOutputIMUSD } = useMemo(() => {
    const _minOutputAmount = BigDecimal.maybeParse(
      outputAmount?.value && slippageSimple
        ? (outputAmount?.value.simple * (1 - slippageSimple / 100)).toFixed(
            outputAmount?.value.decimals,
          )
        : undefined,
    );

    return {
      minOutputAmount: _minOutputAmount,
      minOutputIMUSD:
        saveExchangeRate && _minOutputAmount?.divPrecisely(saveExchangeRate),
    };
  }, [outputAmount?.value, saveExchangeRate, slippageSimple]);

  const depositApprove = useMemo(
    () => ({
      spender: isDepositingBasset
        ? (saveWrapperAddress as string)
        : (saveAddress as string),
      amount: outputAmount?.value,
      address: inputAddress as string,
    }),
    [
      isDepositingBasset,
      saveWrapperAddress,
      saveAddress,
      outputAmount?.value,
      inputAddress,
    ],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      outputAddressOptions={[
        {
          address: saveAddress,
          balance: isDepositingSave ? vaultBalance : undefined,
          label: isDepositingSave ? `${saveTokenSymbol} Vault` : undefined,
        },
      ]}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      error={error}
      exchangeRate={exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string);
        }
      }}
      outputAddressDisabled
    >
      <>
        {!saveAndStake && (
          <SendButton
            valid={valid}
            title={`Mint ${saveTokenSymbol}`}
            handleSend={async () => {
              if (
                signer &&
                saveAddress &&
                massetAddress &&
                massetState &&
                inputAmount &&
                inputAddress
              ) {
                if (massetName === 'mbtc') {
                  console.log(
                    'FLIP DIS',
                    inputAmount?.simple,
                    outputAmount?.value?.simple,
                    minOutputAmount?.simple,
                    inputAddress,
                    saveWrapperAddress,
                  );

                  if (
                    canDepositWithWrapper &&
                    isDepositingBasset &&
                    outputAmount?.value &&
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
                        minOutputAmount.exact, // 0, // minOutput
                        false,
                      ],
                      depositPurpose,
                      formId,
                    );
                    manifest.setFallbackGasLimit(580000);
                    return propose(manifest);
                  }
                }
                // if (inputAddress === massetAddress) {
                //   return propose<
                //     Interfaces.SavingsContract,
                //     'depositSavings(uint256)'
                //   >(
                //     new TransactionManifest(
                //       ISavingsContractV2__factory.connect(
                //         saveAddress,
                //         signer,
                //       ),
                //       'depositSavings(uint256)',
                //       [inputAmount.exact],
                //       depositPurpose,
                //       formId,
                //     ),
                //   );
                // }

                // if (
                //   canDepositWithWrapper &&
                //   isDepositingBasset &&
                //   scaledInputAmount
                // ) {
                //   const manifest = new TransactionManifest<
                //     Interfaces.SaveWrapper,
                //     'saveViaMint'
                //   >(
                //     SaveWrapper__factory.connect(
                //       saveWrapperAddress as string,
                //       signer,
                //     ),
                //     'saveViaMint',
                //     [inputAddress, scaledInputAmount.exact, false],
                //     depositPurpose,
                //     formId,
                //   );
                //   manifest.setFallbackGasLimit(580000);
                //   return propose(manifest);
                // }

                // TODO: via Curve
              }
            }}
            approve={depositApprove}
          />
        )}
      </>
      {inputAddress !== massetState?.address && (
        <Info
          minOutputAmount={minOutputIMUSD}
          slippageFormValue={slippageFormValue}
          onSetSlippage={setSlippage}
        />
      )}
    </AssetExchange>
  );
};
