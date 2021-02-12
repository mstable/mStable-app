import React, { FC, useEffect, useMemo } from 'react';
import { useThrottleFn } from 'react-use';
import { BigNumber, bigNumberify } from 'ethers/utils';

import { getUnixTime } from 'date-fns';
import { useTokens, useTokensState } from '../../../../context/TokensProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';

import { BigDecimalInputValues } from '../../../../hooks/useBigDecimalInputs';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { sanitizeMassetError } from '../../../../utils/strings';
import { Interfaces } from '../../../../types';

import { Mbtc } from '../../../../typechain/Mbtc';

import {
  ManyToOneAssetExchange,
  MultiAssetExchangeProvider,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../../forms/MultiAssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { MassetState } from '../../../../context/DataProvider/types';
import {
  BannerMessage,
  useSetBannerMessage,
} from '../../../../context/AppProvider';
import { PageHeader, PageAction } from '../../PageHeader';
import { MassetPage } from '../../MassetPage';
import { MbtcFactory } from '../../../../typechain/MbtcFactory';

const formId = 'mint';

const MintLogic: FC = () => {
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const signer = useSigner();
  const tokenState = useTokensState();

  const massetState = useSelectedMassetState() as MassetState;
  const massetAddress = massetState.address;

  const [inputValues, outputAmount, slippage] = useMultiAssetExchangeState();
  const [inputCallbacks, setOutputAmount] = useMultiAssetExchangeDispatch();

  const inputTokens = useTokens(Object.keys(inputValues));

  const masset = useMemo(
    () =>
      massetAddress && signer
        ? MbtcFactory.connect(massetAddress, signer)
        : undefined,
    [massetAddress, signer],
  );

  const { exchangeRate, minOutputAmount } = useMemo(() => {
    const totalInputAmount = Object.values(inputValues)
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
      totalInputAmount &&
      totalInputAmount.exact.gt(0) &&
      outputAmount.value &&
      outputAmount.value.exact.gt(0)
        ? { value: outputAmount.value.divPrecisely(totalInputAmount) }
        : { fetching: outputAmount.fetching };

    const _minOutputAmount = BigDecimal.maybeParse(
      outputAmount.value && slippage.simple
        ? (outputAmount.value.simple * (1 - slippage.simple / 100)).toFixed(
            outputAmount.value.decimals,
          )
        : undefined,
    );

    return {
      exchangeRate: _exchangeRate,
      minOutputAmount: _minOutputAmount,
    };
  }, [
    inputValues,
    massetState.bAssets,
    outputAmount.fetching,
    outputAmount.value,
    slippage.simple,
  ]);

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (_masset: Mbtc | undefined, _inputValues: BigDecimalInputValues) => {
      if (_masset) {
        const touched = Object.values(_inputValues).filter(v => v.touched);

        if (touched.length > 0) {
          setOutputAmount({ fetching: true });

          const promise = (() => {
            if (touched.length === 1) {
              const [{ address, amount }] = touched;
              return _masset.getMintOutput(
                address,
                (amount as BigDecimal).exact,
              );
            }

            const inputs = touched.map(v => v.address);
            const amounts = touched.map(v => (v.amount as BigDecimal).exact);
            return _masset.getMintMultiOutput(inputs, amounts);
          })();

          return promise
            .then((mintOutput: BigNumber): void => {
              setOutputAmount({
                value: new BigDecimal(mintOutput),
              });
            })
            .catch((_error: Error): void => {
              setOutputAmount({
                error: sanitizeMassetError(_error),
              });
            });
        }
      } else {
        setOutputAmount({});
      }
    },
    1000,
    [masset, inputValues],
  );

  const setMaxCallbacks = useMemo(
    () =>
      Object.fromEntries(
        inputTokens.map(({ address, balance }) => [
          address,
          () => {
            inputCallbacks[address].setAmount(balance);
          },
        ]),
      ),
    [inputTokens, inputCallbacks],
  );

  const inputLabel = useMemo(
    () =>
      Object.values(inputValues)
        .filter(v => v.touched)
        .map(v => inputTokens.find(t => t.address === v.address)?.symbol)
        .join('/'),
    [inputTokens, inputValues],
  );

  const error = useMemo(() => {
    const touched = Object.keys(inputValues).find(t => inputValues[t].touched);

    if (!touched) return;

    const addressesBalanceTooLow = Object.keys(inputValues).filter(t =>
      inputValues[t].amount?.exact.gt(
        tokenState.tokens[t]?.balance?.exact ?? 0,
      ),
    );

    if (addressesBalanceTooLow.length)
      return `Insufficient ${addressesBalanceTooLow
        .map(t => tokenState.tokens[t]?.symbol)
        .join(', ')} balance`;

    const addressesApprovalNeeded = Object.keys(inputValues).filter(t =>
      inputValues[t].amount?.exact.gt(
        tokenState.tokens[t]?.allowances[massetState.address]?.exact ?? 0,
      ),
    );

    if (addressesApprovalNeeded.length)
      return `Approval for ${addressesApprovalNeeded
        .map(t => tokenState.tokens[t]?.symbol)
        .join(', ')} needed`;

    return outputAmount.error;
  }, [inputValues, massetState.address, outputAmount.error, tokenState.tokens]);

  return (
    <ManyToOneAssetExchange
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputLabel={massetState.token.symbol}
      outputAddress={massetState.address}
      setMaxCallbacks={setMaxCallbacks}
      spender={massetState.address}
      minOutputAmount={minOutputAmount}
      error={error}
    >
      <SendButton
        valid={!error}
        title="Mint"
        handleSend={() => {
          if (masset && walletAddress && minOutputAmount) {
            const touched = Object.values(inputValues).filter(v => v.touched);

            if (touched.length === 1) {
              const [{ address, amount }] = touched;
              return propose<Interfaces.Masset, 'mint'>(
                new TransactionManifest(
                  masset,
                  'mint',
                  [
                    address,
                    (amount as BigDecimal).exact,
                    minOutputAmount.exact,
                    walletAddress,
                  ],
                  { past: 'Minted', present: 'Minting' },
                  formId,
                ),
              );
            }

            const addresses = touched.map(v => v.address);
            const amounts = touched.map(v => (v.amount as BigDecimal).exact);

            return propose<Interfaces.Masset, 'mintMulti'>(
              new TransactionManifest(
                masset,
                'mintMulti',
                [addresses, amounts, minOutputAmount.exact, walletAddress],
                { past: 'Minted', present: 'Minting' },
                formId,
              ),
            );
          }
        }}
      />
    </ManyToOneAssetExchange>
  );
};

export const Mint: FC = () => {
  const massetState = useSelectedMassetState();
  const setBannerMessage = useSetBannerMessage();

  const { invariantStartingCap, invariantStartTime, invariantCapFactor } =
    massetState ?? {};

  const tvlCap = useMemo(() => {
    if (!invariantStartingCap || !invariantStartTime || !invariantCapFactor)
      return;

    const currentTime = getUnixTime(Date.now());

    const weeksSinceLaunch = Math.floor(
      (currentTime - invariantStartTime) / 604800,
    );

    if (weeksSinceLaunch > 12) return;

    const maxK = invariantStartingCap.add(
      invariantCapFactor.mul(bigNumberify(weeksSinceLaunch).pow(2)),
    );

    return new BigDecimal(maxK);
  }, [invariantCapFactor, invariantStartTime, invariantStartingCap]);

  useEffect(() => {
    if (!tvlCap) return;

    // TODO: - Add URL for TVL cap
    const message: BannerMessage = {
      title: `Current TVL cap is ${tvlCap.format(2, false)} mBTC. `,
      emoji: '⚠️',
      visible: true,
      url: '#',
    };

    setBannerMessage(message);
  }, [setBannerMessage, tvlCap]);

  const inputAssets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(massetState?.bAssets ?? {}).map(
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

  return massetState ? (
    <MultiAssetExchangeProvider assets={inputAssets}>
      <PageHeader
        action={PageAction.Mint}
        subtitle={`Convert into ${massetState.token.symbol}`}
      />
      <MassetPage>
        <MintLogic />
      </MassetPage>
    </MultiAssetExchangeProvider>
  ) : null;
};
