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
import { Interfaces } from '../../../../types';
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
    margin: 0.5rem 0;
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

  const currentFeederAddress = Object.keys(feederPools).find(
    address =>
      feederPools[address].fasset.address === inputAddress ||
      feederPools[address].fasset.address === outputAddress,
  );

  const bassetOptions = useMemo(
    () => Object.keys(bAssets).map(address => ({ address })),
    [bAssets],
  );

  const fassetOptions = useMemo(
    () =>
      Object.keys(feederPools).map(address => ({
        address: feederPools[address].fasset.address,
      })),
    [feederPools],
  );

  const addressOptions = [
    { address: massetAddress },
    ...bassetOptions,
    ...fassetOptions,
  ];

  const masset = useMemo(
    () => (signer ? Masset__factory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  const fasset = useMemo(
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

    if (swapOutput.error) return swapOutput.error;

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
  }, [swapOutput.error, inputAmount, inputToken, outputToken]);

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    inputAmount,
    swapOutput?.value,
  );

  const approve = useMemo(
    () =>
      inputAddress
        ? {
            spender: massetAddress,
            address: inputAddress,
            amount: inputAmount,
          }
        : undefined,
    [inputAddress, inputAmount, massetAddress],
  );

  const massetPrice = useSelectedMassetPrice();

  return (
    <Container
      inputAddressOptions={(() => {
        if (!currentFeederAddress) return addressOptions;
        const fAssetAddress = fAssets[currentFeederAddress].address;
        if (outputAddress === fAssetAddress) {
          return [{ address: massetAddress }, ...bassetOptions];
        }
        return addressOptions;
      })()}
      outputAddressOptions={(() => {
        if (!currentFeederAddress) return addressOptions;
        const fAssetAddress = fAssets[currentFeederAddress].address;
        if (inputAddress === fAssetAddress) {
          return [{ address: massetAddress }, ...bassetOptions];
        }
        return addressOptions;
      })()}
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
      outputAddress={outputAddress ?? addressOptions[0].address}
      outputFormValue={swapOutput.value?.string}
      isFetching={swapOutput?.fetching}
    >
      <SendButton
        valid={!error && !!swapOutput.value}
        title={error ?? 'Swap'}
        approve={approve}
        penaltyBonusAmount={penaltyBonus?.percentage}
        handleSend={() => {
          if (
            masset &&
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
                  masset,
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
                  masset,
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
              const contract = isFassetSwap ? fasset : masset;
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
