import React, { FC, useMemo, useState } from 'react'
import { constants } from 'ethers'
import { BoostedSavingsVault__factory, ISavingsContractV2__factory, SaveWrapper__factory } from '@mstable/protocol/types/generated'

import { useSigner } from '../../../../context/AccountProvider'
import { usePropose } from '../../../../context/TransactionsProvider'
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'
import { useNetworkAddresses, useNetworkPrices } from '../../../../context/NetworkProvider'
import { MassetState } from '../../../../context/DataProvider/types'
import { useNativeToken, useTokenSubscription } from '../../../../context/TokensProvider'

import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { useSlippage } from '../../../../hooks/useSimpleInput'
import { BigDecimal } from '../../../../web3/BigDecimal'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { getPenaltyMessage, getPenaltyPercentage } from '../../../../utils/ammUtils'
import { AddressOption, Interfaces } from '../../../../types'

import { AssetExchange } from '../../../forms/AssetExchange'
import { TransactionInfo } from '../../../core/TransactionInfo'
import { SendButton } from '../../../forms/SendButton'

import { useSaveOutput } from './useSaveOutput'
import { SaveRoutes } from './types'
import { useSelectedMassetPrice } from '../../../../hooks/usePrice'
import { DEAD_ADDRESS } from '../../../../constants'

const formId = 'SaveDeposit'

const titles = {
  [SaveRoutes.Save]: 'Save',
  [SaveRoutes.Stake]: 'Deposit to Vault',
  [SaveRoutes.SaveAndStake]: 'Save and deposit to Vault',
  [SaveRoutes.MintAndSave]: 'Mint and save',
  [SaveRoutes.MintAndStake]: 'Mint and deposit to Vault',
  [SaveRoutes.BuyAndSave]: 'Swap and save',
  [SaveRoutes.BuyAndStake]: 'Swap and deposit to Vault',
  [SaveRoutes.SwapAndSave]: 'Swap and save',
  [SaveRoutes.SwapAndStake]: 'Swap and deposit to Vault',
}

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
  [SaveRoutes.SwapAndSave]: {
    past: 'Swapped and deposited savings',
    present: 'Swapping and depositing savings',
  },
  [SaveRoutes.SwapAndStake]: {
    past: 'Swapped and deposited to Vault',
    present: 'Swapping and depositing to Vault',
  },
}

const withSlippage = new Set([
  SaveRoutes.MintAndSave,
  SaveRoutes.MintAndStake,
  SaveRoutes.BuyAndSave,
  SaveRoutes.BuyAndStake,
  SaveRoutes.SwapAndSave,
  SaveRoutes.SwapAndStake,
])

const withNativeToken = new Set([SaveRoutes.BuyAndSave, SaveRoutes.BuyAndStake])

const withStake = new Set([SaveRoutes.MintAndStake, SaveRoutes.BuyAndStake, SaveRoutes.SwapAndStake])

export const SaveDeposit: FC = () => {
  const signer = useSigner()
  const propose = usePropose()
  const networkAddresses = useNetworkAddresses()

  const massetState = useSelectedMassetState() as MassetState
  const nativeToken = useNativeToken()

  const {
    address: massetAddress,
    token: massetToken,
    bAssets,
    fAssets,
    feederPools,
    savingsContracts: {
      v2: {
        latestExchangeRate: { rate: saveExchangeRate } = {},
        address: saveAddress,
        boostedSavingsVault: { address: vaultAddress } = {},
        token: saveToken,
      },
    },
  } = massetState

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    (() => {
      // Select the highest masset-denominated balance (ignore ETH)
      const [[first]] = ([
        ...Object.values(bAssets).map(b => [b.address, b.token.balance.simple ?? 0]),
        [massetAddress, massetToken.balance.simple ?? 0],
      ] as [string, number][]).sort((a, b) => (b[1] as number) - (a[1] as number))
      return first
    })(),
  )

  const [outputAddress, setOutputAddress] = useState<string | undefined>(saveAddress)

  const inputAddressOptions = useMemo<AddressOption[]>(() => {
    const inputs = [
      massetToken,
      ...(saveToken ? [saveToken] : []),
      ...Object.values(bAssets).map(b => b.token),
      ...Object.values(fAssets).map(b => b.token),
      nativeToken,
    ]

    if (outputAddress === saveAddress) {
      return inputs.filter(v => v.address !== saveAddress)
    }
    return inputs
  }, [massetToken, saveToken, saveAddress, bAssets, fAssets, nativeToken, outputAddress])

  const outputAddressOptions = useMemo(() => {
    if (!saveToken) return []
    if (!vaultAddress) return [saveToken as AddressOption]

    const vault = {
      address: vaultAddress as string,
      label: `${saveToken.symbol} Vault`,
      custom: true,
      symbol: `v-${saveToken.symbol}`,
    } as AddressOption

    if (inputAddress === saveAddress) return [vault]

    return [vault, saveToken as AddressOption]
  }, [saveToken, vaultAddress, saveAddress, inputAddress])

  const inputToken = useTokenSubscription(inputAddress)
  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput('0', inputToken?.decimals)

  const feederPoolAddress = useMemo<string | undefined>(() => {
    if (inputAddress) {
      return Object.values(feederPools).find(fp => fp.fasset.address === inputAddress)?.address
    }
  }, [feederPools, inputAddress])

  const saveRoute = useMemo<SaveRoutes>(() => {
    const saveAndStake = vaultAddress && outputAddress === vaultAddress

    if (inputAddress === saveAddress) return SaveRoutes.Stake

    if (inputAddress === massetAddress) {
      return saveAndStake ? SaveRoutes.SaveAndStake : SaveRoutes.Save
    }

    if (inputAddress === constants.AddressZero) {
      return saveAndStake ? SaveRoutes.BuyAndStake : SaveRoutes.BuyAndSave
    }

    if (feederPoolAddress) {
      return saveAndStake ? SaveRoutes.SwapAndStake : SaveRoutes.SwapAndSave
    }

    return saveAndStake ? SaveRoutes.MintAndStake : SaveRoutes.MintAndSave
  }, [vaultAddress, outputAddress, inputAddress, saveAddress, massetAddress, feederPoolAddress])

  const saveOutput = useSaveOutput(saveRoute, inputAddress, inputAmount)

  const { priceImpact, priceImpact: { impactWarning = false } = {} } = saveOutput?.value ?? {}

  const [slippageSimple, slippageFormValue, handleSetSlippage] = useSlippage()

  const error = useMemo(() => {
    if (!inputAmount?.simple) return 'Enter an amount'

    if (inputAmount && inputToken?.balance) {
      if (!inputAddress) {
        return 'Must select an asset'
      }

      if (inputAmount.exact.eq(0)) {
        return 'Amount must be greater than zero'
      }

      if (saveOutput.error) return saveOutput.error

      if (inputAmount.exact.gt(inputToken.balance.exact)) {
        return 'Insufficient balance'
      }
    }

    if (saveOutput.fetching) return 'Validating…'

    return saveOutput.error
  }, [inputAmount, saveOutput.fetching, saveOutput.error, inputToken, inputAddress])

  const networkPrices = useNetworkPrices()
  const nativeTokenPrice = networkPrices.value?.nativeToken
  const massetPrice = useSelectedMassetPrice()

  const outputs = useMemo<{
    outputImasset?: BigDecimal
    outputMasset?: BigDecimal
    minOutputImasset?: BigDecimal
    minOutputMasset?: BigDecimal
    exchangeRate?: BigDecimal
    penaltyBonus: {
      percentage?: number
      message?: string
    }
  }>(() => {
    if (
      !saveOutput.value?.amount ||
      !slippageSimple ||
      !saveExchangeRate ||
      !inputAddress ||
      !inputAmount?.exact.gt(0) ||
      !nativeTokenPrice
    ) {
      return { penaltyBonus: {} }
    }

    if (saveRoute === SaveRoutes.Stake) {
      // 1:1 for this
      return {
        minOutputImasset: inputAmount,
        exchangeRate: BigDecimal.ONE,
        penaltyBonus: {},
      }
    }

    const { amount: outputMasset } = saveOutput.value

    // Apply slippage
    const minOutputMasset = BigDecimal.fromSimple(outputMasset.simple * (1 - slippageSimple / 100), outputMasset.decimals)

    // Scale input to mAsset units, if necessary
    const inputBasset = bAssets[inputAddress]
    const inputFasset = feederPoolAddress && fAssets[feederPoolAddress]
    const inputMasset =
      inputBasset || inputFasset ? inputAmount.mulRatioTruncate((inputBasset || inputFasset).ratio).setDecimals(18) : inputAmount

    // If coming from ETH, convert to mAsset value
    const nativeTokenPriceExact = BigDecimal.fromSimple(nativeTokenPrice).exact
    const inputMassetValue =
      withNativeToken.has(saveRoute) && massetPrice
        ? inputAmount.mulTruncate(nativeTokenPriceExact).divPrecisely(BigDecimal.fromSimple(massetPrice))
        : inputMasset

    // Scale amounts to imAsset value
    const inputImasset = inputMassetValue.divPrecisely(saveExchangeRate)
    const outputImasset = outputMasset.divPrecisely(saveExchangeRate)
    const minOutputImasset = minOutputMasset.divPrecisely(saveExchangeRate)

    // Rate == output in imAsset/input in mAsset
    const _exchangeRate = outputImasset.divPrecisely(inputMasset)

    const percentage = getPenaltyPercentage(inputImasset, outputImasset)
    const message = getPenaltyMessage(percentage)

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
    }
  }, [
    saveOutput.value,
    slippageSimple,
    saveExchangeRate,
    inputAddress,
    inputAmount,
    nativeTokenPrice,
    saveRoute,
    bAssets,
    feederPoolAddress,
    fAssets,
    massetPrice,
  ])

  const approve = useMemo(() => {
    if (
      !inputAddress ||
      !saveAddress ||
      !networkAddresses ||
      (withStake.has(saveRoute) && !vaultAddress) ||
      withNativeToken.has(saveRoute)
    ) {
      return
    }

    const spender =
      saveRoute === SaveRoutes.Save ? saveAddress : saveRoute === SaveRoutes.Stake ? (vaultAddress as string) : networkAddresses.SaveWrapper

    return {
      spender,
      address: inputAddress,
      amount: inputAmount,
    }
  }, [vaultAddress, inputAddress, inputAmount, saveAddress, saveRoute, networkAddresses])

  const hasSlippage = withSlippage.has(saveRoute)

  const exchangeRate = useMemo(
    () => ({
      ...saveOutput,
      value: outputs.exchangeRate,
    }),
    [outputs.exchangeRate, saveOutput],
  )

  return (
    <AssetExchange
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={() => {
        if (inputToken) setInputFormValue(inputToken.balance.string)
      }}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      inputAddressOptions={inputAddressOptions}
      exchangeRate={exchangeRate}
      outputAddress={outputAddress}
      outputAddressOptions={outputAddressOptions}
      handleSetOutputAddress={setOutputAddress}
    >
      <SendButton
        approve={approve}
        warning={!error && hasSlippage && impactWarning}
        valid={!error}
        title={error ?? titles[saveRoute]}
        handleSend={() => {
          if (
            error ||
            !(signer && inputAmount && inputAddress && networkAddresses && saveOutput.value && outputs.minOutputImasset) ||
            (withStake.has(saveRoute) && !vaultAddress)
          )
            return

          const purpose = purposes[saveRoute]
          switch (saveRoute) {
            case SaveRoutes.BuyAndSave:
            case SaveRoutes.BuyAndStake:
              if (!vaultAddress && saveRoute === SaveRoutes.BuyAndStake) return

              return propose<Interfaces.SaveWrapper, 'saveViaUniswapETH'>(
                new TransactionManifest(
                  SaveWrapper__factory.connect(networkAddresses.SaveWrapper, signer),
                  'saveViaUniswapETH',
                  [
                    massetAddress,
                    saveAddress,
                    vaultAddress ?? DEAD_ADDRESS,
                    networkAddresses.UniswapRouter02_Like,
                    (saveOutput.value.amountOut as BigDecimal).exact,
                    saveOutput.value.path as string[],
                    (outputs.minOutputMasset as BigDecimal).exact,
                    saveRoute === SaveRoutes.BuyAndStake,
                    { value: inputAmount.exact },
                  ],
                  purpose,
                  formId,
                ),
              )

            case SaveRoutes.MintAndSave:
            case SaveRoutes.MintAndStake:
              if (!vaultAddress && saveRoute === SaveRoutes.MintAndStake) return

              return propose<Interfaces.SaveWrapper, 'saveViaMint'>(
                new TransactionManifest(
                  SaveWrapper__factory.connect(networkAddresses.SaveWrapper, signer),
                  'saveViaMint',
                  [
                    massetAddress,
                    saveAddress,
                    vaultAddress ?? DEAD_ADDRESS,
                    inputAddress,
                    inputAmount.exact,
                    (outputs.minOutputMasset as BigDecimal).exact,
                    saveRoute === SaveRoutes.MintAndStake,
                  ],
                  purpose,
                  formId,
                ),
              )

            case SaveRoutes.SwapAndSave:
            case SaveRoutes.SwapAndStake:
              if (!feederPoolAddress || (!vaultAddress && saveRoute === SaveRoutes.SwapAndStake)) return

              return propose<Interfaces.SaveWrapper, 'saveViaSwap'>(
                new TransactionManifest(
                  SaveWrapper__factory.connect(networkAddresses.SaveWrapper, signer),
                  'saveViaSwap',
                  [
                    massetAddress,
                    saveAddress,
                    vaultAddress ?? DEAD_ADDRESS,
                    feederPoolAddress,
                    inputAddress,
                    inputAmount.exact,
                    (outputs.minOutputMasset as BigDecimal).exact,
                    saveRoute === SaveRoutes.SwapAndStake,
                  ],
                  purpose,
                  formId,
                ),
              )

            case SaveRoutes.SaveAndStake:
              if (!vaultAddress) return

              return propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                new TransactionManifest(
                  SaveWrapper__factory.connect(networkAddresses.SaveWrapper, signer),
                  'saveAndStake',
                  [massetAddress, saveAddress, vaultAddress, inputAmount.exact],
                  purpose,
                  formId,
                ),
              )

            case SaveRoutes.Save:
              return propose<Interfaces.SavingsContract, 'depositSavings(uint256)'>(
                new TransactionManifest(
                  ISavingsContractV2__factory.connect(saveAddress, signer),
                  'depositSavings(uint256)',
                  [inputAmount.exact],
                  purpose,
                  formId,
                ),
              )

            case SaveRoutes.Stake:
              if (!vaultAddress) return

              return propose<Interfaces.BoostedSavingsVault, 'stake(uint256)'>(
                new TransactionManifest(
                  BoostedSavingsVault__factory.connect(vaultAddress, signer),
                  'stake(uint256)',
                  [inputAmount.exact],
                  purpose,
                  formId,
                ),
              )

            default:
              break
          }
        }}
      />
      <TransactionInfo
        minOutputAmount={outputs.minOutputImasset}
        slippageFormValue={hasSlippage ? slippageFormValue : undefined}
        onSetSlippage={hasSlippage ? handleSetSlippage : undefined}
        saveExchangeRate={saveExchangeRate}
        priceImpact={priceImpact}
      />
    </AssetExchange>
  )
}
