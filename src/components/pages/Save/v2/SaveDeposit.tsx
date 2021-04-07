import React, { FC, useMemo, useState } from 'react';
import { constants } from 'ethers';
import {
  BoostedSavingsVault__factory,
  ISavingsContractV2__factory,
} from '@mstable/protocol/types/generated';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useNetworkPrices } from '../../../../context/EthProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import {
  useETH,
  useTokenSubscription,
} from '../../../../context/TokensProvider';

import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { useSlippage } from '../../../../hooks/useSimpleInput';
import { ADDRESSES } from '../../../../constants';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import {
  getPenaltyMessage,
  getPenaltyPercentage,
} from '../../../../utils/ammUtils';
import { SaveWrapper__factory } from '../../../../typechain';
import { AddressOption, Interfaces, SubscribedToken } from '../../../../types';

import { AssetExchange } from '../../../forms/AssetExchange';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { SendButton } from '../../../forms/SendButton';

import { useSaveOutput } from './useSaveOutput';
import { SaveRoutes } from './types';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

const formId = 'SaveDeposit';

const titles = {
  [SaveRoutes.Save]: 'Save',
  [SaveRoutes.Stake]: 'Deposit to Vault',
  [SaveRoutes.SaveAndStake]: 'Save and deposit to Vault',
  [SaveRoutes.MintAndSave]: 'Mint and save',
  [SaveRoutes.MintAndStake]: 'Mint and deposit to Vault',
  [SaveRoutes.BuyAndSave]: 'Swap and save',
  [SaveRoutes.BuyAndStake]: 'Swap and deposit to Vault',
};

const purposes = {
  [SaveRoutes.Save]: {
    past: 'Deposited savings',
    present: 'Depositing savings',
  },
  [SaveRoutes.Stake]: {
    past: 'Deposited to Vault',
    present: 'Depositing to Vault',
  },
  [SaveRoutes.SaveAndStake]: {
    past: 'Deposited to Vault',
    present: 'Depositing to Vault',
  },
  [SaveRoutes.MintAndSave]: {
    past: 'Minted and deposited savings',
    present: 'Minting and depositing savings',
  },
  [SaveRoutes.MintAndStake]: {
    past: 'Minted and deposited to Vault',
    present: 'Minting and depositing to Vault',
  },
  [SaveRoutes.BuyAndSave]: {
    past: 'Swapped and deposited savings',
    present: 'Swapping and depositing savings',
  },
  [SaveRoutes.BuyAndStake]: {
    past: 'Swapped and deposited to Vault',
    present: 'Swapping and depositing to Vault',
  },
};

const withSlippage = new Set([
  SaveRoutes.MintAndSave,
  SaveRoutes.MintAndStake,
  SaveRoutes.BuyAndSave,
  SaveRoutes.BuyAndStake,
]);

const withBasset = new Set([SaveRoutes.MintAndSave, SaveRoutes.MintAndStake]);

const withEth = new Set([SaveRoutes.BuyAndSave, SaveRoutes.BuyAndStake]);

export const SaveDeposit: FC<{
  saveAndStake?: boolean;
}> = ({ saveAndStake }) => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState() as MassetState;
  const ETH = useETH();
  const {
    address: massetAddress,
    bassetRatios,
    savingsContracts: {
      v2: {
        latestExchangeRate: { rate: saveExchangeRate } = {},
        address: saveAddress,
        boostedSavingsVault: { address: vaultAddress } = {},
        token: saveToken,
      },
    },
  } = massetState;

  const inputAddressOptions = useMemo<AddressOption[]>(
    () => [
      massetState.token,
      ...(saveAndStake
        ? [massetState.savingsContracts.v2.token as SubscribedToken]
        : []),
      ...Object.values(massetState.bAssets).map(b => b.token),
      ETH,
    ],
    [
      ETH,
      massetState.bAssets,
      massetState.savingsContracts.v2.token,
      massetState.token,
      saveAndStake,
    ],
  );

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    (() => {
      // Select the highest masset-denominated balance (ignore ETH)
      const [[first]] = ([
        ...Object.values(massetState.bAssets).map(b => [
          b.address,
          b.token.balance.simple ?? 0,
        ]),
        [massetState.address, massetState.token.balance.simple ?? 0],
      ] as [string, number][]).sort(
        (a, b) => (b[1] as number) - (a[1] as number),
      );
      return first;
    })(),
  );

  const inputToken = useTokenSubscription(inputAddress);
  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput(
    '0',
    inputToken?.decimals,
  );

  const saveRoute = useMemo<SaveRoutes>(() => {
    if (inputAddress === saveAddress) return SaveRoutes.Stake;

    if (inputAddress === massetAddress) {
      return saveAndStake ? SaveRoutes.SaveAndStake : SaveRoutes.Save;
    }

    if (inputAddress === constants.AddressZero) {
      return saveAndStake ? SaveRoutes.BuyAndStake : SaveRoutes.BuyAndSave;
    }

    return saveAndStake ? SaveRoutes.MintAndStake : SaveRoutes.MintAndSave;
  }, [inputAddress, massetAddress, saveAddress, saveAndStake]);

  const saveOutput = useSaveOutput(saveRoute, inputAddress, inputAmount);

  const [slippageSimple, slippageFormValue, handleSetSlippage] = useSlippage();

  const error = useMemo(() => {
    if (!inputAmount?.simple) return 'Enter an amount';

    if (inputAmount && inputToken?.balance) {
      if (inputAmount.simple > inputToken.balance.simple) {
        return 'Insufficient balance';
      }

      if (!inputAddress) {
        return 'Must select an asset';
      }

      if (inputAmount.exact.eq(0)) {
        return 'Amount must be greater than zero';
      }
    }

    if (saveOutput.fetching) return 'Validating…';

    return saveOutput.error;
  }, [
    inputAmount,
    saveOutput.fetching,
    saveOutput.error,
    inputToken,
    inputAddress,
  ]);

  const { eth: ethPrice } = useNetworkPrices();
  const massetPrice = useSelectedMassetPrice();

  const outputs = useMemo<{
    outputImasset?: BigDecimal;
    outputMasset?: BigDecimal;
    minOutputImasset?: BigDecimal;
    minOutputMasset?: BigDecimal;
    exchangeRate?: BigDecimal;
    penaltyBonus: {
      percentage?: number;
      message?: string;
    };
  }>(() => {
    if (
      !saveOutput.value?.amount ||
      !slippageSimple ||
      !saveExchangeRate ||
      !inputAddress ||
      !inputAmount?.exact.gt(0) ||
      !ethPrice
    ) {
      return { penaltyBonus: {} };
    }

    if (saveRoute === SaveRoutes.Stake) {
      // 1:1 for this
      return {
        minOutputImasset: inputAmount,
        exchangeRate: BigDecimal.parse('1'),
        penaltyBonus: {},
      };
    }

    const { amount: outputMasset } = saveOutput.value;

    // Apply slippage
    const minOutputMasset = BigDecimal.parse(
      (outputMasset.simple * (1 - slippageSimple / 100)).toFixed(
        outputMasset.decimals,
      ),
      outputMasset.decimals,
    );

    // Scale input to mAsset units, if necessary
    const inputMasset = withBasset.has(saveRoute)
      ? inputAmount.mulRatioTruncate(bassetRatios[inputAddress]).setDecimals(18)
      : inputAmount;

    // If coming from ETH, convert to mAsset value
    const ethPriceExact = BigDecimal.parse(ethPrice.toFixed(10)).exact;
    const inputMassetValue =
      withEth.has(saveRoute) && massetPrice
        ? inputAmount
            .mulTruncate(ethPriceExact)
            .divPrecisely(BigDecimal.parse(massetPrice.toFixed(10)))
        : inputMasset;

    // Scale amounts to imAsset value
    const inputImasset = inputMassetValue.divPrecisely(saveExchangeRate);
    const outputImasset = outputMasset.divPrecisely(saveExchangeRate);
    const minOutputImasset = minOutputMasset.divPrecisely(saveExchangeRate);

    // Rate == output in imAsset/input in mAsset
    const _exchangeRate = outputImasset.divPrecisely(inputMasset);

    const percentage = getPenaltyPercentage(inputImasset, outputImasset);
    const message = getPenaltyMessage(percentage);

    return {
      outputImasset,
      outputMasset,
      minOutputImasset,
      minOutputMasset,
      exchangeRate: _exchangeRate,
      penaltyBonus: {
        percentage,
        message,
      },
    };
  }, [
    massetPrice,
    bassetRatios,
    ethPrice,
    inputAddress,
    inputAmount,
    saveExchangeRate,
    saveOutput.value,
    saveRoute,
    slippageSimple,
  ]);

  const approve = useMemo(() => {
    if (
      !inputAddress ||
      !saveAddress ||
      !vaultAddress ||
      withEth.has(saveRoute)
    ) {
      return;
    }

    const spender =
      saveRoute === SaveRoutes.Save
        ? saveAddress
        : saveRoute === SaveRoutes.Stake
        ? vaultAddress
        : ADDRESSES.SAVE_WRAPPER;

    return {
      spender,
      address: inputAddress,
      amount: inputAmount,
    };
  }, [vaultAddress, inputAddress, inputAmount, saveAddress, saveRoute]);

  const hasSlippage = withSlippage.has(saveRoute);

  const exchangeRate = useMemo(
    () => ({
      ...saveOutput,
      value: outputs.exchangeRate,
    }),
    [outputs.exchangeRate, saveOutput],
  );

  const outputAddressOptions = useMemo(
    () => [
      saveAndStake && saveToken
        ? {
            address: vaultAddress as string,
            label: `${saveToken.symbol} Vault`,
            custom: true,
            symbol: `v-${saveToken.symbol}`,
          }
        : (saveToken as SubscribedToken),
    ],
    [saveAndStake, saveToken, vaultAddress],
  );

  return (
    <AssetExchange
      error={error ?? hasSlippage ? outputs.penaltyBonus.message : undefined}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={() => {
        if (inputToken) setInputFormValue(inputToken.balance.string);
      }}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      inputAddressOptions={inputAddressOptions}
      exchangeRate={exchangeRate}
      outputAddressDisabled
      outputAddress={outputAddressOptions[0].address}
      outputAddressOptions={outputAddressOptions}
    >
      <SendButton
        approve={approve}
        penaltyBonusAmount={
          hasSlippage ? outputs.penaltyBonus.percentage : undefined
        }
        valid={!error}
        title={error ?? titles[saveRoute]}
        handleSend={() => {
          if (
            !error &&
            signer &&
            inputAmount &&
            inputAddress &&
            saveOutput.value &&
            vaultAddress &&
            outputs.minOutputImasset
          ) {
            const purpose = purposes[saveRoute];
            switch (saveRoute) {
              case SaveRoutes.BuyAndSave:
              case SaveRoutes.BuyAndStake:
                return propose<Interfaces.SaveWrapper, 'saveViaUniswapETH'>(
                  new TransactionManifest(
                    SaveWrapper__factory.connect(
                      ADDRESSES.SAVE_WRAPPER,
                      signer,
                    ),
                    'saveViaUniswapETH',
                    [
                      massetAddress,
                      saveAddress,
                      vaultAddress,
                      ADDRESSES.UNISWAP_ROUTER02,
                      (saveOutput.value.amountOut as BigDecimal).exact,
                      saveOutput.value.path as string[],
                      (outputs.minOutputMasset as BigDecimal).exact,
                      saveRoute === SaveRoutes.BuyAndStake,
                      { value: inputAmount.exact },
                    ],
                    purpose,
                    formId,
                  ),
                );

              case SaveRoutes.MintAndSave:
              case SaveRoutes.MintAndStake:
                return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                  new TransactionManifest(
                    SaveWrapper__factory.connect(
                      ADDRESSES.SAVE_WRAPPER,
                      signer,
                    ),
                    'saveViaMint',
                    [
                      massetAddress,
                      saveAddress,
                      vaultAddress,
                      inputAddress,
                      inputAmount.exact,
                      (outputs.minOutputMasset as BigDecimal).exact,
                      saveRoute === SaveRoutes.MintAndStake,
                    ],
                    purpose,
                    formId,
                  ),
                );

              case SaveRoutes.SaveAndStake:
                return propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                  new TransactionManifest(
                    SaveWrapper__factory.connect(
                      ADDRESSES.SAVE_WRAPPER,
                      signer,
                    ),
                    'saveAndStake',
                    [
                      massetAddress,
                      saveAddress,
                      vaultAddress,
                      inputAmount.exact,
                    ],
                    purpose,
                    formId,
                  ),
                );

              case SaveRoutes.Save:
                return propose<
                  Interfaces.SavingsContract,
                  'depositSavings(uint256)'
                >(
                  new TransactionManifest(
                    ISavingsContractV2__factory.connect(saveAddress, signer),
                    'depositSavings(uint256)',
                    [inputAmount.exact],
                    purpose,
                    formId,
                  ),
                );

              case SaveRoutes.Stake:
                return propose<
                  Interfaces.BoostedSavingsVault,
                  'stake(uint256)'
                >(
                  new TransactionManifest(
                    BoostedSavingsVault__factory.connect(vaultAddress, signer),
                    'stake(uint256)',
                    [inputAmount.exact],
                    purpose,
                    formId,
                  ),
                );

              default:
                break;
            }
          }
        }}
      />
      <TransactionInfo
        minOutputAmount={outputs.minOutputImasset}
        slippageFormValue={hasSlippage ? slippageFormValue : undefined}
        onSetSlippage={hasSlippage ? handleSetSlippage : undefined}
        saveExchangeRate={saveExchangeRate}
      />
    </AssetExchange>
  );
};
