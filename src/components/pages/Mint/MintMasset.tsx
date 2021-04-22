import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FeederPool__factory, Masset__factory } from '@mstable/protocol/types/generated'
import { usePropose } from '../../../context/TransactionsProvider'
import { useSigner, useWalletAddress } from '../../../context/AccountProvider'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { MassetState } from '../../../context/DataProvider/types'
import { useTokenSubscription } from '../../../context/TokensProvider'

import { useBigDecimalInput } from '../../../hooks/useBigDecimalInput'
import { useSlippage } from '../../../hooks/useSimpleInput'
import { TransactionManifest } from '../../../web3/TransactionManifest'

import { Interfaces } from '../../../types'

import { SendButton } from '../../forms/SendButton'
import { AssetInput } from '../../forms/AssetInput'
import { Arrow } from '../../core/Arrow'
import { ErrorMessage } from '../../core/ErrorMessage'
import { ExchangeRate } from '../../core/ExchangeRate'
import { TransactionInfo } from '../../core/TransactionInfo'
import { useMinimumOutput } from '../../../hooks/useOutput'
import { BigDecimalInputValue } from '../../../hooks/useBigDecimalInputs'
import { useEstimatedOutput } from '../../../hooks/useEstimatedOutput'
import { BigDecimal } from '../../../web3/BigDecimal'
import { useChainIdCtx } from '../../../context/NetworkProvider'

const formId = 'mint'

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

  const [inputAddress, handleSetAddress] = useState<string | undefined>(Object.keys(bAssets)[0])
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

  const { estimatedOutputAmount, exchangeRate, feeRate } = useEstimatedOutput(
    { ...inputToken, amount: inputAmount } as BigDecimalInputValue,
    { ...massetToken } as BigDecimalInputValue,
  )

  const addressOptions = useMemo(() => [...Object.keys(bAssets).map(address => ({ address })), ...feederOptions], [bAssets, feederOptions])

  const error = useMemo(() => {
    if (!inputAmount?.simple) return 'Enter an amount'

    if (inputAmount) {
      if (inputAmount.exact.gt(inputToken?.balance.exact ?? BigDecimal.ZERO.exact)) {
        return 'Insufficient balance'
      }

      if (!inputAddress) {
        return 'Must select an asset to receive'
      }

      if (inputAmount.exact.eq(0)) {
        return 'Amount must be greater than zero'
      }
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [inputAmount, estimatedOutputAmount.fetching, estimatedOutputAmount.error, inputToken, inputAddress])

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(slippageSimple, inputAmount, estimatedOutputAmount.value)

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
    handleSetAddress(undefined)
  }, [chainId])

  const valid = !error

  return (
    <Container>
      <AssetInput
        address={inputAddress ?? addressOptions[0].address}
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
      {penaltyBonus?.message && <ErrorMessage error={penaltyBonus?.message} />}
      <SendButton
        valid={valid}
        title={error ?? 'Mint'}
        approve={approve}
        penaltyBonusAmount={(!error && penaltyBonus?.percentage) || undefined}
        handleSend={() => {
          if (masset && walletAddress && inputAmount && inputAddress && minOutputAmount) {
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
      />
    </Container>
  )
}
