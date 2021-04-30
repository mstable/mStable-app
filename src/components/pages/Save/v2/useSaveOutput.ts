import type { BigNumber } from 'ethers'
import { Signer } from 'ethers'
import { useEffect } from 'react'
import { useDebounce } from 'react-use'
import { FeederPool__factory, Masset__factory } from '@mstable/protocol/types/generated'

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'
import { MassetState } from '../../../../context/DataProvider/types'
import { useSigner } from '../../../../context/AccountProvider'
import { AllNetworks, useNetworkAddresses } from '../../../../context/NetworkProvider'

import { FetchState, useFetchState } from '../../../../hooks/useFetchState'
import { sanitizeMassetError } from '../../../../utils/strings'
import { BigDecimal } from '../../../../web3/BigDecimal'
import { SaveWrapper__factory, UniswapRouter02__factory } from '../../../../typechain'

import { SaveOutput, SaveRoutes } from './types'
import { getPriceImpact, inputValueLow, useScaleAsset } from '../../../../utils/ammUtils'
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider'

const getOptimalBasset = async (
  signer: Signer,
  networkAddresses: AllNetworks['addresses'],
  massetAddress: string,
  bAssets: MassetState['bAssets'],
  inputAmount: BigNumber,
): Promise<SaveOutput> => {
  const wrappedNativeToken =
    (networkAddresses.ERC20 as Extract<AllNetworks['addresses'], { ERC20: { WETH: string } }>['ERC20']).WETH ??
    (networkAddresses.ERC20 as Extract<AllNetworks['addresses'], { ERC20: { wMATIC: string } }>['ERC20']).wMATIC

  const uniswap = UniswapRouter02__factory.connect(networkAddresses.UniswapRouter02_Like, signer)

  const saveWrapper = SaveWrapper__factory.connect(networkAddresses.SaveWrapper, signer)

  const bassetAmountsOut = [
    ...(await Promise.all(
      Object.keys(bAssets).map(async address => {
        const path = [wrappedNativeToken, address]
        try {
          const [, amountOut] = await uniswap.getAmountsOut(inputAmount, path)
          const estimatedOutput = await saveWrapper.estimate_saveViaUniswapETH(
            massetAddress,
            networkAddresses.UniswapRouter02_Like,
            inputAmount,
            path,
          )

          return {
            path,
            amountOut: new BigDecimal(amountOut, bAssets[address].token.decimals),
            amount: new BigDecimal(estimatedOutput),
          }
        } catch (error) {
          console.error(`Error estimating output for path ${path.join(',')}`, error)
        }
      }),
    )),
  ].filter(Boolean) as SaveOutput[]

  const optimal = bassetAmountsOut.reduce((prev, current) => (current.amount.exact.gt(prev.amount.exact) ? current : prev), {
    amount: BigDecimal.ZERO,
  })

  if (!optimal || optimal.amount.exact.eq(0)) {
    throw new Error('No path found')
  }

  return optimal
}

export const useSaveOutput = (route?: SaveRoutes, inputAddress?: string, inputAmount?: BigDecimal): FetchState<SaveOutput> => {
  const [saveOutput, setSaveOutput] = useFetchState<SaveOutput>()
  const networkAddresses = useNetworkAddresses()

  const signer = useSigner() as Signer

  const massetState = useSelectedMassetState() as MassetState
  const {
    address: massetAddress,
    bAssets,
    feederPools,
    savingsContracts: {
      v2: { latestExchangeRate: { rate: latestExchangeRate } = {} },
    },
  } = massetState

  const { scaleNetworkAsset, scaleAsset } = useScaleAsset()
  const massetName = useSelectedMassetName()
  const inputAmountSerialized = inputAmount?.toJSON()
  const feederPoolAddress = inputAddress && Object.values(feederPools).find(fp => fp.fasset.address === inputAddress)?.address
  const inputLow = inputValueLow[massetName]

  const [update] = useDebounce(
    () => {
      if (!inputAmountSerialized || !inputAddress) return setSaveOutput.value()

      const _inputAmount = BigDecimal.fromJSON(inputAmountSerialized)

      if (
        !latestExchangeRate ||
        !networkAddresses ||
        ((route === SaveRoutes.SwapAndSave || route === SaveRoutes.SwapAndStake) && !feederPoolAddress)
      ) {
        return setSaveOutput.fetching()
      }

      let promise: Promise<SaveOutput>
      switch (route) {
        case SaveRoutes.Save:
        case SaveRoutes.Stake:
        case SaveRoutes.SaveAndStake:
          promise = Promise.resolve({
            amount: _inputAmount,
          })
          break

        case SaveRoutes.BuyAndSave:
        case SaveRoutes.BuyAndStake:
          promise = (async () => {
            // turn into promise all
            const { amount: low } = await getOptimalBasset(signer, networkAddresses, massetAddress, bAssets, inputLow.exact)
            const { amount: high } = await getOptimalBasset(signer, networkAddresses, massetAddress, bAssets, _inputAmount.exact)

            const priceImpact = getPriceImpact(
              {
                low: scaleNetworkAsset(inputLow),
                high: scaleNetworkAsset(_inputAmount),
              },
              { low, high },
            )

            return {
              amount: high,
              priceImpact,
            }
          })()
          break

        case SaveRoutes.MintAndSave:
        case SaveRoutes.MintAndStake:
          promise = (async () => {
            const contract = Masset__factory.connect(massetAddress, signer)

            const scaledInputLow = scaleAsset(inputAddress, inputLow, _inputAmount.decimals)
            const _low = await contract.getMintOutput(inputAddress, scaledInputLow.exact)
            const _high = await contract.getMintOutput(inputAddress, _inputAmount.exact)

            const low = new BigDecimal(_low)
            const high = new BigDecimal(_high)

            const priceImpact = getPriceImpact(
              {
                low: scaleAsset(inputAddress, scaledInputLow),
                high: scaleAsset(inputAddress, _inputAmount),
              },
              { low, high },
            )

            return {
              amount: high,
              priceImpact,
            }
          })()
          break

        case SaveRoutes.SwapAndSave:
        case SaveRoutes.SwapAndStake:
          promise = (async () => {
            const contract = FeederPool__factory.connect(feederPoolAddress as string, signer)

            const scaledInputLow = scaleAsset(inputAddress, inputLow, _inputAmount.decimals)
            const _low = await contract.getSwapOutput(inputAddress, massetAddress, scaledInputLow.exact)
            const _high = await contract.getSwapOutput(inputAddress, massetAddress, _inputAmount.exact)

            const low = new BigDecimal(_low)
            const high = new BigDecimal(_high)

            const priceImpact = getPriceImpact(
              {
                low: scaleAsset(inputAddress, scaledInputLow),
                high: scaleAsset(inputAddress, _inputAmount),
              },
              { low, high },
            )

            return {
              amount: high,
              priceImpact,
            }
          })()
          break

        default:
          return setSaveOutput.value()
      }

      setSaveOutput.fetching()

      return promise
        .then((output): void => {
          setSaveOutput.value(output)
        })
        .catch((_error: Error): void => {
          setSaveOutput.error(sanitizeMassetError(_error))
        })
    },
    1000,
    [inputAmountSerialized, inputAddress, massetAddress, feederPoolAddress],
  )

  useEffect(() => {
    if (inputAmount?.exact.gt(0) && inputAddress) {
      setSaveOutput.fetching()
      update()
    } else {
      setSaveOutput.value()
    }
  }, [inputAddress, inputAmount, setSaveOutput, update])

  return saveOutput
}
