import type { FC } from 'react'
import React, { useMemo } from 'react'

import { usePropose } from '../../../../context/TransactionsProvider'
import { useWalletAddress } from '../../../../context/AccountProvider'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { SendButton } from '../../../forms/SendButton'
import { AddressOption, Interfaces } from '../../../../types'
import { OneToManyAssetExchange, useMultiAssetExchangeState } from '../../../forms/MultiAssetExchange'
import { BigDecimal } from '../../../../web3/BigDecimal'
import { useEstimatedRedeemOutput } from '../../../../hooks/useEstimatedRedeemOutput'
import { useMaximumOutput } from '../../../../hooks/useOutput'
import { useExchangeRateForFPInputs } from '../../../../hooks/useMassetExchangeRate'
import { useSelectedFeederPoolContract, useSelectedFeederPoolState } from '../FeederPoolProvider'
import { useSelectedMassetPrice } from '../../../../hooks/usePrice'

const formId = 'RedeemExactLP'

export const RedeemExact: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const contract = useSelectedFeederPoolContract()
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const outputTokens = useMemo(() => [feederPool.masset.token, feederPool.fasset.token], [feederPool])

  const massetPrice = useSelectedMassetPrice()
  const isLowLiquidity = feederPool?.liquidity.simple * (massetPrice ?? 0) < 100000

  const [inputValues, slippage] = useMultiAssetExchangeState()
  const estimatedOutputAmount = useEstimatedRedeemOutput(contract, inputValues)
  const exchangeRate = useExchangeRateForFPInputs(feederPool.address, estimatedOutputAmount, inputValues)

  const touched = useMemo(() => Object.values(inputValues).filter(v => v.touched), [inputValues])

  const inputAmount = useMemo(() => {
    if (!touched.length) return

    const massetAmount = touched.find(({ address }) => address === feederPool.masset.address)?.amount

    const fassetAmount = touched.find(({ address }) => address === feederPool.fasset.address)?.amount

    if (fassetAmount && massetAmount) {
      return fassetAmount.mulRatioTruncate(feederPool.fasset.ratio).add(massetAmount).setDecimals(18)
    }

    return massetAmount ?? fassetAmount
  }, [feederPool, touched])

  const { maxOutputAmount, penaltyBonus } = useMaximumOutput(slippage?.simple, inputAmount, estimatedOutputAmount.value)

  const outputOption = feederPool.token as AddressOption

  const outputLabel = useMemo(
    () =>
      touched
        .map(
          v =>
            (outputTokens.find(t => t.address === v.address) as {
              symbol: string
            }).symbol,
        )
        .join(', '),
    [touched, outputTokens],
  )

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount'

    if (isLowLiquidity) {
      const minAssetSimple = (inputAmount?.simple ?? 0) * 0.4

      if (touched.length !== Object.keys(inputValues).length) {
        return 'Assets must be withdrawn in pairs'
      }

      if (touched.find(v => (v.amount?.simple ?? 0) < minAssetSimple)) {
        return 'Assets must be withdrawn at a minimum 40/60 ratio'
      }
    }

    if (estimatedOutputAmount.value?.exact.gt(feederPool.token.balance.exact ?? 0)) {
      return 'Insufficient balance'
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [estimatedOutputAmount, feederPool, touched, isLowLiquidity, inputValues, inputAmount])

  return (
    <OneToManyAssetExchange
      exchangeRate={exchangeRate}
      inputAddress={outputOption?.address as string}
      inputLabel={outputOption?.symbol}
      inputAmount={estimatedOutputAmount}
      outputLabel={outputLabel}
      maxOutputAmount={maxOutputAmount}
      error={penaltyBonus?.message}
    >
      <SendButton
        title={error ?? 'Redeem'}
        warning={(!error && !!penaltyBonus?.percentage) || undefined}
        valid={!error}
        handleSend={() => {
          if (!contract || !walletAddress || !maxOutputAmount) return

          const addresses = touched.map(v => v.address)
          const amounts = touched.map(v => (v.amount as BigDecimal).exact)

          return propose<Interfaces.FeederPool, 'redeemExactBassets'>(
            new TransactionManifest(
              contract,
              'redeemExactBassets',
              [addresses, amounts, maxOutputAmount.exact, walletAddress],
              { past: 'Redeemed', present: 'Redeeming' },
              formId,
            ),
          )
        }}
      />
    </OneToManyAssetExchange>
  )
}
