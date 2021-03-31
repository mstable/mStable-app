import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import {
  FeederPool__factory,
  Masset__factory,
} from '@mstable/protocol/types/generated';

import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { AddressOption, Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';

import { AssetSwap } from '../../../forms/AssetSwap';
import { SendButton } from '../../../forms/SendButton';
import { PageAction, PageHeader } from '../../PageHeader';
import { MassetState } from '../../../../context/DataProvider/types';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { MassetPage } from '../../MassetPage';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { useEstimatedOutput } from '../../../../hooks/useEstimatedOutput';
import { BigDecimalInputValue } from '../../../../hooks/useBigDecimalInputs';

const formId = 'swap';

const Info = styled(TransactionInfo)`
  margin-top: 0.5rem;
`;

const Container = styled(AssetSwap)`
  ${({ theme }) => theme.mixins.card};

  > * {
    margin: 0;
  }
  > *:not(:first-child) {
    margin: 0.25rem 0;
  }
`;

const SwapLogic: FC = () => {
  const massetState = useSelectedMassetState() as MassetState;
  const { address: massetAddress, bAssets, fAssets, feederPools } = massetState;

  const signer = useSigner();
  const walletAddress = useWalletAddress();
  const propose = usePropose();

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const assetsByBalance = useMemo(
    () =>
      Object.values(bAssets).sort((a, b) =>
        a.balanceInMasset.exact.lt(b.balanceInMasset.exact) ? 1 : -1,
      ),
    [bAssets],
  );

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    assetsByBalance?.[0]?.address,
  );
  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    assetsByBalance?.[1]?.address,
  );

  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);
  const inputDecimals = inputToken?.decimals;

  const [inputAmount, inputFormValue, setInputAmount] = useBigDecimalInput(
    '0',
    {
      decimals: inputDecimals,
    },
  );

  const currentFeederAddress = Object.values(feederPools).find(
    ({ fasset: { address } }) =>
      address === inputAddress || address === outputAddress,
  )?.address;

  const bassetOptions = useMemo(
    () => Object.keys(bAssets).map(address => ({ address })),
    [bAssets],
  );

  const fassetOptions = Object.values(feederPools).map(fp => ({
    address: fp.fasset.address,
  }));

  const massetContract = useMemo(
    () => (signer ? Masset__factory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  const feederPoolContract = useMemo(
    () =>
      signer && currentFeederAddress
        ? FeederPool__factory.connect(currentFeederAddress, signer)
        : undefined,
    [currentFeederAddress, signer],
  );

  const {
    estimatedOutputAmount: swapOutput,
    exchangeRate,
    feeRate,
  } = useEstimatedOutput(
    { ...inputToken, amount: inputAmount } as BigDecimalInputValue,
    { ...outputToken } as BigDecimalInputValue,
  );

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount';

    if (inputAmount) {
      if (!inputToken) {
        return 'Select asset to send';
      }

      if (!outputToken) {
        return 'Select asset to receive';
      }

      if (
        inputToken?.balance &&
        inputAmount.exact.gt(inputToken.balance.exact)
      ) {
        return 'Insufficient balance';
      }
    }

    if (swapOutput.fetching) return 'Validating…';

    return swapOutput.error;
  }, [
    inputAmount,
    swapOutput.fetching,
    swapOutput.error,
    inputToken,
    outputToken,
  ]);

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    inputAmount,
    swapOutput?.value,
  );

  const approve = useMemo(
    () =>
      inputAddress
        ? {
            spender:
              inputAddress === currentFeederAddress
                ? currentFeederAddress
                : massetAddress,
            address: inputAddress,
            amount: inputAmount,
          }
        : undefined,
    [inputAddress, inputAmount, massetAddress, currentFeederAddress],
  );

  const massetPrice = useSelectedMassetPrice();

  const valid = !error && !!swapOutput.value;

  const fAssetAddress = currentFeederAddress
    ? fAssets[currentFeederAddress].address
    : undefined;

  const combinedAddressOptions = useMemo<{
    input: AddressOption[];
    output: AddressOption[];
  }>(() => {
    const addressOptions = [
      { address: massetAddress },
      ...bassetOptions,
      ...fassetOptions,
    ];

    if (!fAssetAddress)
      return { input: addressOptions, output: addressOptions };

    const input =
      outputAddress === fAssetAddress
        ? [{ address: massetAddress }, ...bassetOptions]
        : addressOptions;

    const output =
      inputAddress === fAssetAddress
        ? [{ address: massetAddress }, ...bassetOptions]
        : addressOptions;

    return { input, output };
  }, [
    massetAddress,
    bassetOptions,
    fassetOptions,
    fAssetAddress,
    outputAddress,
    inputAddress,
  ]);

  return (
    <Container
      inputAddressOptions={combinedAddressOptions.input}
      outputAddressOptions={combinedAddressOptions.output}
      error={penaltyBonus?.message}
      exchangeRate={exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputAmount}
      handleSetInputMax={(): void => {
        setInputAmount(inputToken?.balance.string);
      }}
      handleSetOutputAddress={setOutputAddress}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress ?? combinedAddressOptions.output[0].address}
      outputFormValue={swapOutput.value?.string}
      isFetching={swapOutput?.fetching}
      inputDecimals={inputDecimals}
    >
      <SendButton
        valid={valid}
        title={error ?? 'Swap'}
        approve={approve}
        penaltyBonusAmount={(!error && penaltyBonus?.percentage) || undefined}
        handleSend={() => {
          if (
            massetContract &&
            walletAddress &&
            inputAmount &&
            minOutputAmount &&
            inputAddress &&
            outputAddress
          ) {
            const isMassetMint =
              bAssets[inputAddress]?.address && outputAddress === massetAddress;

            const isMassetRedeem =
              bAssets[outputAddress]?.address && inputAddress === massetAddress;

            const isBassetSwap =
              [inputAddress, outputAddress].filter(
                address => bAssets[address]?.address,
              ).length === 2;

            const isFassetSwap = !!Object.keys(fAssets)
              .filter(address => fAssets[address].address !== massetAddress)
              .find(
                address =>
                  fAssets[address].address === inputAddress ||
                  fAssets[address].address === outputAddress,
              );

            // mAsset mint
            if (isMassetMint) {
              return propose<Interfaces.Masset, 'mint'>(
                new TransactionManifest(
                  massetContract,
                  'mint',
                  [
                    inputAddress,
                    inputAmount.exact,
                    minOutputAmount.exact,
                    walletAddress,
                  ],
                  { past: 'Minted', present: 'Minting' },
                  formId,
                ),
              );
            }

            // mAsset redeem
            if (isMassetRedeem) {
              return propose<Interfaces.Masset, 'redeem'>(
                new TransactionManifest(
                  massetContract,
                  'redeem',
                  [
                    outputAddress,
                    inputAmount.exact,
                    minOutputAmount.exact,
                    walletAddress,
                  ],
                  { past: 'Redeemed', present: 'Redeeming' },
                  formId,
                ),
              );
            }

            // bAsset or fAsset swap
            if (isBassetSwap || isFassetSwap) {
              const contract = isFassetSwap
                ? feederPoolContract
                : massetContract;
              if (!contract) return;

              return propose<Interfaces.Masset | Interfaces.FeederPool, 'swap'>(
                new TransactionManifest(
                  contract,
                  'swap',
                  [
                    inputAddress,
                    outputAddress,
                    inputAmount.exact,
                    minOutputAmount.exact,
                    walletAddress,
                  ],
                  { present: 'Swapping', past: 'Swapped' },
                  formId,
                ),
              );
            }
          }
        }}
      />
      <Info
        feeAmount={feeRate?.value}
        feeLabel="Swap Fee"
        feeTip="The received amount includes a small swap fee. Swap fees are sent to Savers and Liquidity Providers."
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
        price={massetPrice}
      />
    </Container>
  );
};

export const Swap: FC = () => {
  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  return (
    <div>
      <PageHeader
        action={PageAction.Swap}
        subtitle={`Swap the underlying collateral of ${
          massetSymbol ?? 'mAsset'
        }`}
      />
      {massetState ? (
        <MassetPage asideVisible>
          <SwapLogic />
        </MassetPage>
      ) : (
        <Skeleton height={480} />
      )}
    </div>
  );
};
