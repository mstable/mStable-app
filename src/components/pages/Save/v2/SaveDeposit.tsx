import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { AddressZero } from 'ethers/constants';
import { BigNumber } from 'ethers/utils';

import { MassetState } from '../../../../context/DataProvider/types';
import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { useEthBalance } from '../../../../context/EthProvider';

import { SaveWrapperFactory } from '../../../../typechain/SaveWrapperFactory';
import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { UniswapRouter02Factory } from '../../../../typechain/UniswapRouter02Factory';
import { SavingsContractFactory } from '../../../../typechain/SavingsContractFactory';

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
            position,
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
  present: 'Depositing savings',
  past: 'Deposited savings',
};

const depositAndStakePurpose = {
  present: 'Depositing and staking savings',
  past: 'Deposited and staked savings',
};

export const SaveDeposit: FC<{
  saveAndStake?: boolean;
}> = ({ saveAndStake }) => {
  const signer = useSigner();
  const propose = usePropose();
  const ethBalance = useEthBalance();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const bassets = Object.keys(massetState?.bAssets ?? {});
  const savingsContract = massetState?.savingsContracts.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const vaultBalance = vault?.account?.rawBalance;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [uniswapAmountOut, setUniswapAmountOut] = useState<{
    fetching: boolean;
    amount?: BigNumber;
    error?: string;
  }>({ fetching: false });
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const isDepositingSave = inputAddress === saveAddress;
  const isDepositingBasset = inputAddress && bassets.includes(inputAddress);
  const isDepositingETH = inputAddress && inputAddress === AddressZero;

  const inputToken = useTokenSubscription(inputAddress);

  const uniswap = useMemo(
    () =>
      signer
        ? UniswapRouter02Factory.connect(ADDRESSES.UNISWAP_ROUTER02, signer)
        : undefined,
    [signer],
  );

  const error = useMemo<string | undefined>(() => {
    if (inputAmount) {
      const inputBalance = isDepositingETH ? ethBalance : inputToken?.balance;
      if (inputBalance?.simple && inputBalance.simple < inputAmount.simple) {
        return 'Insufficient balance';
      }
    }

    return undefined;
  }, [inputAmount, isDepositingETH, ethBalance, inputToken]);

  const inputAddressOptions = useMemo(() => {
    return [
      { address: massetAddress as string },
      { address: saveAddress as string },
      { address: AddressZero, balance: ethBalance, label: 'ETH', decimals: 18 },
      ...bassets.map(address => ({ address })),
    ];
  }, [massetAddress, saveAddress, bassets, ethBalance]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (isDepositingSave || !inputAmount || !saveExchangeRate) return {};

    if (isDepositingETH) {
      if (uniswapAmountOut.fetching) return { fetching: true };

      if (inputAmount.exact.eq(0) || !uniswapAmountOut.amount) return {};

      const uniswapRate = uniswapAmountOut.amount
        .mul(SCALE)
        .div(inputAmount.exact);

      return {
        value: new BigDecimal(
          uniswapRate.mul(saveExchangeRate.exact).div(SCALE),
        ),
      };
    }

    return { value: saveExchangeRate };
  }, [
    inputAmount,
    isDepositingETH,
    isDepositingSave,
    saveExchangeRate,
    uniswapAmountOut,
  ]);

  const depositApprove = useMemo(
    () => ({
      spender: saveAddress as string,
      amount: inputAmount,
      address: inputAddress as string,
    }),
    [inputAmount, inputAddress, saveAddress],
  );

  const stakeApprove = useMemo(
    () => ({
      spender: ADDRESSES.mUSD.SaveWrapper,
      amount: inputAmount,
      address: inputAddress as string,
    }),
    [inputAmount, inputAddress],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  useEffect(() => {
    setUniswapAmountOut({ fetching: true });
  }, [inputAmount, isDepositingETH]);

  useDebounce(
    () => {
      if (valid && isDepositingETH && inputAmount && uniswap && massetState) {
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
    5000,
    [inputAmount, isDepositingETH, valid, signer, massetState],
  );

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      inputAddress={inputAddress}
      inputAmount={inputAmount}
      inputLabel={isDepositingETH ? 'ETH' : undefined}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      outputLabel={isDepositingSave ? 'imUSD Vault' : undefined}
      outputBalance={isDepositingSave ? vaultBalance : undefined}
      error={error}
      exchangeRate={exchangeRate}
      // slippage={slippage}
      handleSetAddress={setInputAddress}
      handleSetAmount={setInputFormValue}
      handleSetMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string);
        }
      }}
    >
      {isDepositingSave ? (
        <SendButton
          valid={valid}
          title="Stake"
          handleSend={() => {
            if (
              signer &&
              saveAddress &&
              vaultAddress &&
              inputAmount &&
              inputAddress
            ) {
              return propose<Interfaces.BoostedSavingsVault, 'stake(uint256)'>(
                new TransactionManifest(
                  BoostedSavingsVaultFactory.connect(vaultAddress, signer),
                  'stake(uint256)',
                  [inputAmount.exact],
                  {
                    present: 'Staking savings',
                    past: 'Staked savings',
                  },
                  formId,
                ),
              );
            }
          }}
        />
      ) : (
        <>
          {!saveAndStake && (
            <SendButton
              valid={valid}
              title="Deposit"
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
                        SavingsContractFactory.connect(saveAddress, signer),
                        'depositSavings(uint256)',
                        [inputAmount.exact],
                        depositPurpose,
                        formId,
                      ),
                    );
                  }

                  if (isDepositingBasset) {
                    return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                      new TransactionManifest(
                        SaveWrapperFactory.connect(
                          ADDRESSES.mUSD.SaveWrapper,
                          signer,
                        ),
                        'saveViaMint',
                        [inputAddress, inputAmount.exact, false],
                        depositPurpose,
                        formId,
                      ),
                    );
                  }

                  if (isDepositingETH && uniswap) {
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
                          ADDRESSES.mUSD.SaveWrapper,
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

                  // TODO: via Curve
                }
              }}
              approve={depositApprove}
            />
          )}
          <SendButton
            valid={valid}
            title="Deposit & Stake"
            handleSend={async () => {
              if (
                signer &&
                massetAddress &&
                massetState &&
                saveAddress &&
                inputAmount &&
                inputAddress
              ) {
                if (inputAddress === massetAddress) {
                  return propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                    new TransactionManifest(
                      SaveWrapperFactory.connect(saveAddress, signer),
                      'saveAndStake',
                      [inputAmount.exact],
                      depositAndStakePurpose,
                      formId,
                    ),
                  );
                }

                if (isDepositingBasset) {
                  return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                    new TransactionManifest(
                      SaveWrapperFactory.connect(
                        ADDRESSES.mUSD.SaveWrapper,
                        signer,
                      ),
                      'saveViaMint',
                      [inputAddress, inputAmount.exact, true],
                      depositAndStakePurpose,
                      formId,
                    ),
                  );
                }

                if (isDepositingETH && uniswap) {
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
                        ADDRESSES.mUSD.SaveWrapper,
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
                // TODO: via Curve
              }
            }}
            approve={stakeApprove}
          />
        </>
      )}
    </AssetExchange>
  );
};
