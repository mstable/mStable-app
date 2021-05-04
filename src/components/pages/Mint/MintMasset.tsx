import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FeederPool__factory, Masset__factory } from '@mstable/protocol/types/generated'

import type { MassetState } from '../../../context/DataProvider/types'
import { usePropose } from '../../../context/TransactionsProvider'
import { useSigner, useWalletAddress } from '../../../context/AccountProvider'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { useTokenSubscription } from '../../../context/TokensProvider'
import { useChainIdCtx } from '../../../context/NetworkProvider'

import { useBigDecimalInput } from '../../../hooks/useBigDecimalInput'
import { useSlippage } from '../../../hooks/useSimpleInput'
import { TransactionManifest } from '../../../web3/TransactionManifest'

import { Interfaces } from '../../../types'

import { SendButton } from '../../forms/SendButton'
import { AssetInput } from '../../forms/AssetInput'
import { Arrow } from '../../core/Arrow'
import { ExchangeRate } from '../../core/ExchangeRate'
import { TransactionInfo } from '../../core/TransactionInfo'
import { useMinimumOutput } from '../../../hooks/useOutput'
import { BigDecimalInputValue } from '../../../hooks/useBigDecimalInputs'
import { useEstimatedOutput } from '../../../hooks/useEstimatedOutput'

const formId = 'MintMasset'

const Container = styled.div`
  > * {
    margin: 0.5rem 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`

export const MintMasset: FC = () => {
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
  const { address: massetAddress, bAssets, fAssets, feederPools } = massetState

  const defaultInputAddress = useMemo(() => Object.keys(bAssets)[0], [bAssets])
  const [inputAddress, handleSetAddress] = useState<string | undefined>(defaultInputAddress)
  const massetToken = useTokenSubscription(massetAddress)
  const inputToken = useTokenSubscription(inputAddress)
  const inputDecimals = inputToken?.decimals

  const [inputAmount, inputFormValue, handleSetMassetFormValue] = useBigDecimalInput('0', { decimals: inputDecimals })

  const [slippageSimple, slippageFormValue, handleSetSlippage] = useSlippage()

  const currentFeederAddress = Object.keys(feederPools).find(address => feederPools[address].fasset.address === inputAddress)

  const feederOptions = Object.keys(feederPools).map(address => ({
    address: feederPools[address].fasset.address,
  }))

  const masset = useMemo(() => (signer ? Masset__factory.connect(massetAddress, signer) : undefined), [massetAddress, signer])

  const fasset = useMemo(() => (signer && currentFeederAddress ? FeederPool__factory.connect(currentFeederAddress, signer) : undefined), [
    currentFeederAddress,
    signer,
  ])

  const { estimatedOutputAmount, exchangeRate, feeRate, priceImpact } = useEstimatedOutput(
    { ...inputToken, amount: inputAmount } as BigDecimalInputValue,
    { ...massetToken } as BigDecimalInputValue,
  )

  const { impactWarning } = priceImpact?.value ?? {}

  const addressOptions = useMemo(() => [...Object.keys(bAssets).map(address => ({ address })), ...feederOptions], [bAssets, feederOptions])

  const error = useMemo(() => {
    if (!inputAmount?.simple) return 'Enter an amount'

    if (inputAmount) {
      if (!inputAddress) {
        return 'Must select an asset to receive'
      }

      if (inputAmount.exact.eq(0)) {
        return 'Amount must be greater than zero'
      }

      if (estimatedOutputAmount.error) return estimatedOutputAmount.error

      if (inputToken?.balance.exact && inputAmount.exact.gt(inputToken.balance.exact)) {
        return 'Insufficient balance'
      }
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [inputAmount, estimatedOutputAmount.fetching, estimatedOutputAmount.error, inputToken, inputAddress])

  const { minOutputAmount } = useMinimumOutput(slippageSimple, inputAmount, estimatedOutputAmount.value)

  const isFasset = Object.values(fAssets).find(f => f.address === inputAddress)

  const approve = useMemo(
    () =>
      (inputAddress && {
        spender: isFasset && currentFeederAddress ? currentFeederAddress : massetAddress,
        address: inputAddress,
        amount: inputAmount,
      }) ||
      undefined,
    [inputAddress, isFasset, currentFeederAddress, massetAddress, inputAmount],
  )

  // Reset input on chain change
  const [chainId] = useChainIdCtx()
  useEffect(() => {
    handleSetAddress(defaultInputAddress)
  }, [chainId, defaultInputAddress])

  const valid = !error

  return (
    <Container>
      <AssetInput
        address={inputAddress}
        addressOptions={addressOptions}
        formValue={inputFormValue}
        handleSetAddress={handleSetAddress}
        handleSetAmount={handleSetMassetFormValue}
        handleSetMax={() => handleSetMassetFormValue(inputToken?.balance.string)}
        decimals={inputDecimals}
      />
      <div>
        <Arrow />
        <ExchangeRate inputToken={inputToken} outputToken={massetToken} exchangeRate={exchangeRate} />
      </div>
      <AssetInput
        address={massetAddress}
        amountDisabled
        formValue={estimatedOutputAmount.value?.string}
        handleSetAddress={handleSetAddress}
        addressDisabled
        isFetching={estimatedOutputAmount.fetching}
      />
      <SendButton
        valid={valid}
        title={error ?? 'Mint'}
        approve={approve}
        warning={!error && impactWarning}
        handleSend={() => {
          if (masset && walletAddress && inputAddress && inputAmount && minOutputAmount) {
            if (isFasset && fasset) {
              return propose<Interfaces.FeederPool, 'swap'>(
                new TransactionManifest(
                  fasset,
                  'swap',
                  [inputAddress, massetAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
                  { present: 'Swapping', past: 'Swapped' },
                  formId,
                ),
              )
            }

            return propose<Interfaces.Masset, 'mint'>(
              new TransactionManifest(
                masset,
                'mint',
                [inputAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
                { past: 'Minted', present: 'Minting' },
                formId,
              ),
            )
          }
        }}
      />
      <TransactionInfo
        minOutputAmount={minOutputAmount}
        onSetSlippage={handleSetSlippage}
        slippageFormValue={slippageFormValue}
        feeAmount={feeRate?.value}
        priceImpact={priceImpact?.value}
      />
    </Container>
  )
}
