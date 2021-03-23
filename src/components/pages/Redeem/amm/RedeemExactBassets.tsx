import React, { FC, useMemo } from 'react';
import { useThrottleFn } from 'react-use';
import { Masset__factory } from '@mstable/protocol/types/generated/factories/Masset__factory';
import { Masset } from '@mstable/protocol/types/generated/Masset';

import { usePropose } from '../../../../context/TransactionsProvider';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import {
  useTokens,
  useTokenSubscription,
} from '../../../../context/TokensProvider';

import { Interfaces } from '../../../../types';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { BigDecimalInputValues } from '../../../../hooks/useBigDecimalInputs';
import { sanitizeMassetError } from '../../../../utils/strings';

import { SendButton } from '../../../forms/SendButton';
import {
  MultiAssetExchangeProvider,
  OneToManyAssetExchange,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../../forms/MultiAssetExchange';
import { getBounds, getPenaltyMessage } from '../../amm/utils';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

const formId = 'redeem';

const RedeemExactBassetsLogic: FC = () => {
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const signer = useSigner();
  const massetState = useSelectedMassetState() as MassetState;
  const massetAddress = massetState.address;
  const massetToken = useTokenSubscription(massetState.address);
  const massetBalance = massetToken?.balance;

  const [bassetAmounts, massetAmount, slippage] = useMultiAssetExchangeState();
  const [, setMassetAmount] = useMultiAssetExchangeDispatch();

  const outputTokens = useTokens(Object.keys(bassetAmounts));

  const masset = useMemo(
    () => (signer ? Masset__factory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  const { exchangeRate, maxMassetAmount } = useMemo(() => {
    const outputAmount = Object.values(bassetAmounts)
      .filter(v => v.touched)
      .reduce(
        (prev, v) =>
          prev.add(
            (v.amount as BigDecimal).mulRatioTruncate(
              massetState.bAssets[v.address].ratio,
            ),
          ),
        BigDecimal.ZERO,
      );

    const _exchangeRate: { value?: BigDecimal; fetching?: boolean } =
      outputAmount && massetAmount.value && outputAmount.exact.gt(0)
        ? { value: massetAmount.value.divPrecisely(outputAmount) }
        : { fetching: massetAmount.fetching };

    const _maxMassetAmount = BigDecimal.maybeParse(
      massetAmount.value && slippage.simple
        ? (massetAmount.value.simple * (1 + slippage.simple / 100)).toFixed(
            massetAmount.value.decimals,
          )
        : undefined,
    );

    return {
      exchangeRate: _exchangeRate,
      maxMassetAmount: _maxMassetAmount,
    };
  }, [
    bassetAmounts,
    massetState.bAssets,
    massetAmount.fetching,
    massetAmount.value,
    slippage.simple,
  ]);

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (_masset: Masset | undefined, _inputValues: BigDecimalInputValues) => {
      if (_masset) {
        const touched = Object.values(_inputValues).filter(v => v.touched);

        if (touched.length > 0) {
          setMassetAmount({ fetching: true });

          const inputs = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);
          return _masset
            .getRedeemExactBassetsOutput(inputs, amounts)
            .then(_massetAmount => {
              setMassetAmount({
                value: new BigDecimal(_massetAmount),
              });
            })
            .catch((_error: Error): void => {
              setMassetAmount({
                error: sanitizeMassetError(_error),
              });
            });
        }
      }
      setMassetAmount({});
    },
    1000,
    [masset, bassetAmounts],
  );

  const outputLabel = useMemo(
    () =>
      Object.values(bassetAmounts)
        .filter(v => v.touched)
        .map(v => outputTokens.find(t => t.address === v.address)?.symbol)
        .join('/'),
    [outputTokens, bassetAmounts],
  );

  const error = useMemo(() => {
    const touched = Object.values(bassetAmounts).filter(v => v.touched);

    if (touched.length === 0) {
      return;
    }

    if (
      massetBalance &&
      maxMassetAmount &&
      maxMassetAmount.exact.gt(massetBalance.exact)
    ) {
      return 'Insufficient balance';
    }

    return massetAmount.error;
  }, [bassetAmounts, massetAmount.error, massetBalance, maxMassetAmount]);

  const penaltyBonusAmount = useMemo<number | undefined>(() => {
    if (!maxMassetAmount) return;

    const inputAmount = Object.keys(bassetAmounts)
      .map(address => bassetAmounts[address].amount?.simple ?? 0)
      .reduce((a, b) => a + b);

    const { min, max } = getBounds(inputAmount);
    if (!min || !max) return;

    const output =
      exchangeRate?.value && inputAmount * (exchangeRate.value.simple ?? 0);
    if (!output) return;

    const penalty = output / inputAmount;
    const percentage = penalty > 1 ? (penalty - 1) * -100 : (1 - penalty) * 100;

    if (output < min || output > max) return percentage;
  }, [bassetAmounts, exchangeRate.value, maxMassetAmount]);

  const penaltyBonusWarning = useMemo<string | undefined>(
    () => getPenaltyMessage(penaltyBonusAmount),
    [penaltyBonusAmount],
  );

  const massetPrice = useSelectedMassetPrice();

  return (
    <OneToManyAssetExchange
      exchangeRate={exchangeRate}
      inputAddress={massetState?.address as string}
      inputLabel={massetState?.token.symbol}
      outputLabel={outputLabel}
      maxOutputAmount={maxMassetAmount}
      error={error ?? penaltyBonusWarning}
      price={massetPrice}
    >
      <SendButton
        valid={!error && Object.values(bassetAmounts).some(v => v.touched)}
        penaltyBonusAmount={penaltyBonusAmount}
        title="Redeem"
        handleSend={() => {
          if (masset && walletAddress && maxMassetAmount) {
            const touched = Object.values(bassetAmounts).filter(v => v.touched);

            if (touched.length === 0) return;

            const addresses = touched.map(v => v.address);
            const amounts = touched.map(v => (v.amount as BigDecimal).exact);

            return propose<Interfaces.Masset, 'redeemExactBassets'>(
              new TransactionManifest(
                masset,
                'redeemExactBassets',
                [addresses, amounts, maxMassetAmount.exact, walletAddress],
                { past: 'Redeemed', present: 'Redeeming' },
                formId,
              ),
            );
          }
        }}
      />
    </OneToManyAssetExchange>
  );
};

export const RedeemExactBassets: FC = () => {
  const massetState = useSelectedMassetState() as MassetState;
  const inputAssets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(massetState.bAssets).map(
          ([
            address,
            {
              token: { decimals },
            },
          ]) => [address, { decimals }],
        ),
      ),
    [massetState],
  );

  return (
    <MultiAssetExchangeProvider assets={inputAssets}>
      <RedeemExactBassetsLogic />
    </MultiAssetExchangeProvider>
  );
};
