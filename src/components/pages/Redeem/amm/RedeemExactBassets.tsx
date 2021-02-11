import React, { FC, useMemo } from 'react';
import { useThrottleFn } from 'react-use';

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

import { MbtcFactory } from '../../../../typechain/MbtcFactory';
import { Mbtc } from '../../../../typechain/Mbtc';
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
    () => (signer ? MbtcFactory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  );

  const { exchangeRate, maxMassetAmount } = useMemo(() => {
    const outputAmount = Object.values(bassetAmounts)
      .filter(v => v.touched)
      .reduce((prev, v) => (v.amount as BigDecimal).add(prev), BigDecimal.ZERO);

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
    massetAmount.fetching,
    massetAmount.value,
    slippage.simple,
  ]);

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (_masset: Mbtc | undefined, _inputValues: BigDecimalInputValues) => {
      if (_masset) {
        const touched = Object.values(_inputValues).filter(v => v.touched);

        if (touched.length > 0) {
          setMassetAmount({ fetching: true });

          const inputs = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);
          _masset
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
      } else {
        setMassetAmount({});
      }
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

  return (
    <OneToManyAssetExchange
      exchangeRate={exchangeRate}
      inputAddress={massetState?.address as string}
      inputLabel={massetState?.token.symbol}
      outputLabel={outputLabel}
      maxOutputAmount={maxMassetAmount}
      error={error}
    >
      <SendButton
        valid={
          !error &&
          Object.values(bassetAmounts).filter(v => v.touched).length > 0
        }
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
