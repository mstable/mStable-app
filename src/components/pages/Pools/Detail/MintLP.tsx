import React, { FC, useCallback, useMemo, useState } from 'react'

import { usePropose } from '../../../../context/TransactionsProvider'
import { useWalletAddress } from '../../../../context/AccountProvider'
import { SendButton } from '../../../forms/SendButton'
import { AssetExchange } from '../../../forms/AssetExchange'
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { TransactionInfo } from '../../../core/TransactionInfo'
import { useSlippage } from '../../../../hooks/useSimpleInput'
import { BigDecimalInputValue } from '../../../../hooks/useBigDecimalInputs'
import { AddressOption, Interfaces } from '../../../../types'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { useMinimumOutput } from '../../../../hooks/useOutput'
import {
  useFPAssetAddressOptions,
  useFPVaultAddressOptions,
  useSelectedFeederPoolContracts,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider'
import { useEstimatedOutput } from '../../../../hooks/useEstimatedOutput'
import { useTokenSubscription } from '../../../../context/TokensProvider'
import { useNetwork } from '../../../../context/NetworkProvider'

const formId = 'MintLP'

export const MintLP: FC = () => {
  const network = useNetwork()
  const feederPool = useSelectedFeederPoolState()
  const contracts = useSelectedFeederPoolContracts()

  const propose = usePropose()
  const walletAddress = useWalletAddress()

  const defaultInputOptions = useFPAssetAddressOptions(true)
  const defaultOutputOptions = useFPVaultAddressOptions()

  const [inputOptions, setInputOptions] = useState<AddressOption[]>(defaultInputOptions)
  const [outputOptions, setOutputOptions] = useState<AddressOption[]>(defaultOutputOptions)

  const [inputAddress, setInputAddress] = useState<string | undefined>(feederPool.fasset.address)
  const [outputAddress, setOutputAddress] = useState<string | undefined>(outputOptions[0].address)

  const handleSetInputAddress = useCallback(
    (address: string): void => {
      if (address === feederPool.address) {
        setOutputOptions(defaultOutputOptions)
        setOutputAddress(feederPool.vault.address)
      } else {
        setOutputOptions(defaultOutputOptions)
      }
      setInputAddress(address)
    },
    [defaultOutputOptions, feederPool],
  )

  const handleSetOutputAddress = useCallback(
    (address: string): void => {
      if (address === feederPool.address) {
        setInputOptions(defaultInputOptions)
        setInputAddress(feederPool.fasset.address)
      } else {
        setInputOptions(defaultInputOptions)
      }
      setOutputAddress(address)
    },
    [defaultInputOptions, feederPool],
  )

  const [slippageSimple, slippageFormValue, setSlippage] = useSlippage()

  const inputToken = useTokenSubscription(inputAddress)

  const outputToken = outputOptions.find(t => t.address === outputAddress)

  const isStakingLP = inputAddress === feederPool.address
  const isMintingAndStakingLP = outputAddress !== feederPool.address

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput('0', {
    decimals: inputToken?.decimals,
  })

  const contractAddress = isStakingLP
    ? feederPool.vault.address
    : isMintingAndStakingLP
    ? (network?.addresses.FeederWrapper as string) // FIXME handle not being set
    : feederPool.address

  const approve = useMemo(
    () =>
      (inputAddress && {
        spender: contractAddress,
        address: inputAddress,
        amount: inputAmount,
      }) ||
      undefined,
    [inputAddress, contractAddress, inputAmount],
  )

  const isStakingInVault = inputAddress === feederPool.address && outputAddress === feederPool.vault.address

  const { estimatedOutputAmount, exchangeRate, priceImpact } = useEstimatedOutput(
    {
      ...inputOptions.find(t => t.address === inputAddress),
      amount: inputAmount,
    } as BigDecimalInputValue,
    { ...outputToken, address: feederPool.address } as BigDecimalInputValue,
    { price: feederPool.price, isInput: false },
    isStakingInVault,
  )

  const { impactWarning } = priceImpact?.value ?? {}

  const { minOutputAmount } = useMinimumOutput(slippageSimple, inputAmount, estimatedOutputAmount.value)

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount'

    if (!outputToken) {
      return 'Must select an asset to receive'
    }

    if (inputAmount.exact.eq(0)) {
      return 'Amount must be greater than zero'
    }

    if (estimatedOutputAmount.error) return estimatedOutputAmount.error

    if (inputToken?.balance?.exact && inputAmount.exact.gt(inputToken.balance.exact)) {
      return 'Insufficient balance'
    }

    if (isStakingInVault) return

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [inputAmount, inputToken, outputToken, isStakingInVault, estimatedOutputAmount.fetching, estimatedOutputAmount.error])

  const title = isStakingLP ? 'Stake' : isMintingAndStakingLP ? 'Mint & Stake' : 'Mint'

  return (
    <AssetExchange
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(inputToken?.balance?.string)
      }}
      handleSetInputAddress={handleSetInputAddress}
      handleSetOutputAddress={handleSetOutputAddress}
      inputAddress={inputAddress}
      inputAddressOptions={inputOptions}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      outputAddressOptions={outputOptions}
      outputFormValue={isStakingLP ? inputFormValue : estimatedOutputAmount.value?.string}
      isFetching={estimatedOutputAmount.fetching}
      inputDecimals={inputAmount?.decimals}
      outputLabel={feederPool.token.symbol}
    >
      <SendButton
        title={error ?? title}
        approve={approve}
        warning={!isStakingInVault && !error && impactWarning}
        valid={!error}
        handleSend={() => {
          if (!contracts || !walletAddress || !feederPool) return
          if (!inputAddress || !inputAmount) return

          if (isStakingLP) {
            return propose<Interfaces.BoostedSavingsVault, 'stake(uint256)'>(
              new TransactionManifest(
                contracts.vault,
                'stake(uint256)',
                [inputAmount.exact],
                { past: 'Staked', present: 'Staking' },
                formId,
              ),
            )
          }

          if (!minOutputAmount) return

          if (isMintingAndStakingLP) {
            return propose<Interfaces.FeederWrapper, 'mintAndStake'>(
              new TransactionManifest(
                contracts.feederWrapper,
                'mintAndStake',
                [feederPool.address, feederPool.vault.address, inputAddress, inputAmount.exact, minOutputAmount.exact],
                { past: 'Minted & Stake', present: 'Minting & Staking' },
                formId,
              ),
            )
          }

          return propose<Interfaces.FeederPool, 'mint'>(
            new TransactionManifest(
              contracts.feederPool,
              'mint',
              [inputAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
              { past: 'Minted', present: 'Minting' },
              formId,
            ),
          )
        }}
      />
      <TransactionInfo
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
        priceImpact={priceImpact?.value}
      />
    </AssetExchange>
  )
}
