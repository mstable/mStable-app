import React, { FC, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { Masset__factory } from '@mstable/protocol/types/generated'
import { useTokens, useTokensState } from '../../../context/TokensProvider'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { useSigner, useWalletAddress } from '../../../context/AccountProvider'
import { usePropose } from '../../../context/TransactionsProvider'
import { BigDecimal } from '../../../web3/BigDecimal'
import { TransactionManifest } from '../../../web3/TransactionManifest'
import { Interfaces } from '../../../types'
import {
  ManyToOneAssetExchange,
  MultiAssetExchangeProvider,
  useMultiAssetExchangeDispatch,
  useMultiAssetExchangeState,
} from '../../forms/MultiAssetExchange'
import { SendButton } from '../../forms/SendButton'
import { MassetState } from '../../../context/DataProvider/types'
import { useEstimatedMintOutput } from '../../../hooks/useEstimatedMintOutput'
import { useMinimumOutput } from '../../../hooks/useOutput'
import { useSelectedMassetPrice } from '../../../hooks/usePrice'
import { useExchangeRateForMassetInputs } from '../../../hooks/useMassetExchangeRate'

const formId = 'mint'

const Container = styled(ManyToOneAssetExchange)`
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

const MintExactLogic: FC = () => {
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const signer = useSigner()
  const tokenState = useTokensState()

  const massetState = useSelectedMassetState() as MassetState
  const { address: massetAddress, bassetRatios } = massetState

  const [inputValues, outputAmount, slippage] = useMultiAssetExchangeState()
  const [inputCallbacks, setOutputAmount] = useMultiAssetExchangeDispatch()

  const inputTokens = useTokens(Object.keys(inputValues))

  const masset = useMemo(() => (massetAddress && signer ? Masset__factory.connect(massetAddress, signer) : undefined), [
    massetAddress,
    signer,
  ])

  const touched = useMemo(() => Object.values(inputValues).filter(v => v.touched), [inputValues])

  const estimatedOutputAmount = useEstimatedMintOutput(masset, inputValues)
  const exchangeRate = useExchangeRateForMassetInputs(estimatedOutputAmount, inputValues)

  const inputAmount = useMemo(() => {
    if (!Object.keys(inputValues).length || !touched.length) return

    return Object.values(touched).reduce(
      (prev, v) => prev.add((v.amount as BigDecimal).mulRatioTruncate(bassetRatios[v.address])),
      BigDecimal.ZERO,
    )
  }, [inputValues, touched, bassetRatios])

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(slippage?.simple, inputAmount, estimatedOutputAmount.value)

  useEffect(() => {
    setOutputAmount(estimatedOutputAmount)
  }, [estimatedOutputAmount, setOutputAmount])

  const setMaxCallbacks = useMemo(
    () =>
      Object.fromEntries(
        inputTokens.map(({ address, balance }) => [
          address,
          () => {
            inputCallbacks[address].setAmount(balance)
          },
        ]),
      ),
    [inputTokens, inputCallbacks],
  )

  const inputLabel = useMemo(
    () =>
      Object.values(inputValues)
        .filter(v => v.touched)
        .map(v => inputTokens.find(t => t.address === v.address)?.symbol)
        .join(', '),
    [inputTokens, inputValues],
  )

  const error = useMemo(() => {
    if (!touched) return 'Enter an amount'

    const addressesBalanceTooLow = Object.keys(inputValues).filter(t =>
      inputValues[t].amount?.exact.gt(tokenState.tokens[t]?.balance?.exact ?? 0),
    )

    if (addressesBalanceTooLow.length)
      return `Insufficient ${addressesBalanceTooLow.map(t => tokenState.tokens[t]?.symbol).join(', ')} balance`

    const addressesApprovalNeeded = Object.keys(inputValues).filter(t =>
      inputValues[t].amount?.exact.gt(tokenState.tokens[t]?.allowances[massetState.address]?.exact ?? 0),
    )

    if (addressesApprovalNeeded.length)
      return `Approval for ${addressesApprovalNeeded.map(t => tokenState.tokens[t]?.symbol).join(', ')} needed`

    if (outputAmount.fetching) return 'Validating…'

    return outputAmount.error
  }, [inputValues, massetState, outputAmount, tokenState, touched])

  const massetPrice = useSelectedMassetPrice()

  const valid = !!(!error && !outputAmount.fetching && outputAmount.value?.exact.gt(0) && touched.length > 0)

  return (
    <Container
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputLabel={massetState.token.symbol}
      outputAddress={massetState.address}
      setMaxCallbacks={setMaxCallbacks}
      spender={massetState.address}
      minOutputAmount={minOutputAmount}
      error={penaltyBonus?.message}
      price={massetPrice}
    >
      <SendButton
        valid={valid}
        warning={(!error && !!penaltyBonus?.percentage) || undefined}
        title={error ?? 'Mint'}
        handleSend={() => {
          if (masset && walletAddress && minOutputAmount) {
            if (touched.length === 1) {
              const [{ address, amount }] = touched
              return propose<Interfaces.Masset, 'mint'>(
                new TransactionManifest(
                  masset,
                  'mint',
                  [address, (amount as BigDecimal).exact, minOutputAmount.exact, walletAddress],
                  { past: 'Minted', present: 'Minting' },
                  formId,
                ),
              )
            }

            const addresses = touched.map(v => v.address)
            const amounts = touched.map(v => (v.amount as BigDecimal).exact)

            return propose<Interfaces.Masset, 'mintMulti'>(
              new TransactionManifest(
                masset,
                'mintMulti',
                [addresses, amounts, minOutputAmount.exact, walletAddress],
                { past: 'Minted', present: 'Minting' },
                formId,
              ),
            )
          }
        }}
      />
    </Container>
  )
}

export const MintExact: React.FC = () => {
  const massetState = useSelectedMassetState() as MassetState
  const inputAssets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(massetState.bAssets).map(([address, { token: { decimals } }]) => [address, { decimals }]),
      ),
    [massetState],
  )

  return (
    <MultiAssetExchangeProvider assets={inputAssets}>
      <MintExactLogic />
    </MultiAssetExchangeProvider>
  )
}
