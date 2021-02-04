import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { AddressZero } from 'ethers/constants';
import { BigNumber } from 'ethers/utils';

import { MassetState } from '../../../../context/DataProvider/types';
import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useEthBalance } from '../../../../context/EthProvider';

import { SaveWrapperFactory } from '../../../../typechain/SaveWrapperFactory';
import { UniswapRouter02Factory } from '../../../../typechain/UniswapRouter02Factory';

import { Interfaces } from '../../../../types';
import {
  ADDRESSES,
  PERCENT_SCALE,
  RATIO_SCALE,
  SCALE,
} from '../../../../constants';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { UniswapRouter02 } from '../../../../typechain/UniswapRouter02';

const formId = 'SaveDeposit';

interface UniswapBassetOutput {
  path: [string, string];
  amountOut: BigNumber;
  normalizedAmountOut: BigNumber;
  position: number;
}

const getUniswapBassetOutputForETH = async (
  uniswap: UniswapRouter02,
  inputAmount: BigDecimal,
  massetState: MassetState,
): Promise<UniswapBassetOutput> => {
  const bassetAmountsOut = [
    ...(await Promise.all(
      ADDRESSES.CURVE['3POOL_COINS'].map(async (address, position) => {
        try {
          const path = [ADDRESSES.WETH, address];

          const [, amountOut] = await uniswap.getAmountsOut(
            inputAmount.exact,
            path,
          );

          const { ratio } = massetState.bAssets[address];
          const normalizedAmountOut = amountOut.mul(ratio).div(RATIO_SCALE);

          return {
            path,
            normalizedAmountOut,
            amountOut,
            position: position + 1, // position 0 is mUSD
          };
        } catch {
          //
        }
      }),
    )),
  ].filter(Boolean) as UniswapBassetOutput[];

  const optimalBasset = bassetAmountsOut.reduce((prev, current) =>
    current.normalizedAmountOut.gt(prev.normalizedAmountOut) ? current : prev,
  );

  if (!optimalBasset) {
    throw new Error('No Uniswap path found');
  }

  return optimalBasset;
};

const depositPurpose = {
  present: 'Depositing ETH',
  past: 'Deposited ETH',
};

const depositAndStakePurpose = {
  present: 'Depositing ETH and staking',
  past: 'Deposited ETH and staked',
};

export const SaveDepositETH: FC<{
  saveAndStake?: boolean;
}> = ({ saveAndStake }) => {
  const signer = useSigner();
  const propose = usePropose();
  const ethBalance = useEthBalance();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [uniswapAmountOut, setUniswapAmountOut] = useState<{
    fetching: boolean;
    amount?: BigNumber;
    error?: string;
  }>({ fetching: false });
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    AddressZero,
  );

  const uniswap = useMemo(
    () =>
      signer
        ? UniswapRouter02Factory.connect(ADDRESSES.UNISWAP_ROUTER02, signer)
        : undefined,
    [signer],
  );

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      ethBalance?.simple &&
      ethBalance.simple < inputAmount.simple
    ) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [inputAmount, ethBalance]);

  const inputAddressOptions = useMemo(() => {
    return [
      {
        address: AddressZero,
        balance: ethBalance,
        symbol: 'ETH',
        decimals: 18,
        custom: true,
      },
    ];
  }, [ethBalance]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (!inputAmount || !saveExchangeRate) return {};

    if (uniswapAmountOut.fetching) return { fetching: true };

    if (inputAmount.exact.eq(0) || !uniswapAmountOut.amount) return {};

    const uniswapRate = uniswapAmountOut.amount
      .mul(SCALE)
      .div(inputAmount.exact);

    return {
      value: new BigDecimal(uniswapRate).divPrecisely(saveExchangeRate),
    };
  }, [inputAmount, saveExchangeRate, uniswapAmountOut]);

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  useEffect(() => {
    setUniswapAmountOut({ fetching: true });
  }, [inputAmount]);

  useDebounce(
    () => {
      if (valid && inputAmount && uniswap && massetState) {
        getUniswapBassetOutputForETH(uniswap, inputAmount, massetState)
          .then(optimalBasset => {
            setUniswapAmountOut({
              amount: optimalBasset.normalizedAmountOut,
              fetching: false,
            });
          })
          .catch(_error => {
            setUniswapAmountOut({ error: _error, fetching: false });
          });
      }
    },
    2000,
    [inputAmount, valid, signer, massetState],
  );

  return (
    <AssetExchange
      inputAddress={inputAddress}
      inputAddressDisabled
      inputAddressOptions={inputAddressOptions}
      inputAmount={inputAmount}
      inputLabel="ETH"
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      error={error}
      exchangeRate={exchangeRate}
      handleSetAddress={setInputAddress}
      handleSetAmount={setInputFormValue}
      handleSetMax={() => {
        if (ethBalance) {
          setInputFormValue(ethBalance.string);
        }
      }}
    >
      <>
        {!saveAndStake && (
          <SendButton
            valid={valid}
            title="Mint imUSD"
            handleSend={async () => {
              if (
                signer &&
                saveAddress &&
                massetAddress &&
                massetState &&
                uniswap &&
                inputAmount &&
                inputAddress
              ) {
                const {
                  amountOut,
                  path,
                  position,
                } = await getUniswapBassetOutputForETH(
                  uniswap,
                  inputAmount,
                  massetState,
                );

                const minOutCurve = amountOut
                  .mul(PERCENT_SCALE)
                  .mul(99)
                  .div(SCALE);

                propose<Interfaces.SaveWrapper, 'saveViaUniswapETH'>(
                  new TransactionManifest(
                    SaveWrapperFactory.connect(
                      ADDRESSES.mUSD.SaveWrapper as string,
                      signer,
                    ),
                    'saveViaUniswapETH',
                    [
                      amountOut,
                      path,
                      position,
                      minOutCurve,
                      false,
                      { value: inputAmount.exact },
                    ],
                    depositPurpose,
                    formId,
                  ),
                );
              }
            }}
          />
        )}
        <SendButton
          valid={valid}
          title="Mint & Deposit to Vault"
          handleSend={async () => {
            if (
              signer &&
              uniswap &&
              massetAddress &&
              massetState &&
              saveAddress &&
              inputAmount &&
              inputAddress
            ) {
              const {
                amountOut,
                path,
                position,
              } = await getUniswapBassetOutputForETH(
                uniswap,
                inputAmount,
                massetState,
              );

              const minOutCurve = amountOut
                .mul(PERCENT_SCALE)
                .mul(99)
                .div(SCALE);

              propose<Interfaces.SaveWrapper, 'saveViaUniswapETH'>(
                new TransactionManifest(
                  SaveWrapperFactory.connect(
                    ADDRESSES.mUSD.SaveWrapper as string,
                    signer,
                  ),
                  'saveViaUniswapETH',
                  [
                    amountOut,
                    path,
                    position,
                    minOutCurve,
                    true,
                    { value: inputAmount.exact },
                  ],
                  depositAndStakePurpose,
                  formId,
                ),
              );
            }
          }}
        />
      </>
    </AssetExchange>
  );
};
