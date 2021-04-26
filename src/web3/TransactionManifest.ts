import { Contract, BigNumber, CallOverrides, BigNumberish } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ErrorCode } from '@ethersproject/logger'

import { Instances, Interfaces, Purpose } from '../types'

const calculateGasMargin = (value: BigNumber, margin = 1000): BigNumber => {
  const gasMargin = BigNumber.from(margin)
  const offset = value.mul(gasMargin).div(BigNumber.from(10000))
  return value.add(offset)
}

export enum TransactionStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Response = 'Response',
  Error = 'Error',
  Confirmed = 'Confirmed',
}

export class TransactionManifest<TIface extends Interfaces, TFn extends keyof Instances[TIface]['functions']> {
  readonly contract: Contract

  readonly fn: string

  readonly args: unknown[]

  readonly purpose: Purpose

  readonly createdAt: number

  readonly formId?: string

  private fallbackGasLimit: BigNumber | undefined

  constructor(
    contract: Instances[TIface],
    fn: Extract<keyof Instances[TIface]['functions'], TFn> & string,
    args: Parameters<
      Extract<
        Instances[TIface]['functions'][TFn],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (..._args: any[]) => any
      >
    >,
    purpose: Purpose,
    formId?: string,
  ) {
    this.contract = contract as Contract
    this.args = args
    this.fn = fn
    this.formId = formId
    this.purpose = purpose
    this.createdAt = Date.now()
  }

  get id(): string {
    return [this.formId, this.contract.address, this.fn, JSON.stringify(this.args)].join('.')
  }

  async send(gasLimit?: BigNumber, gasPrice?: number): Promise<TransactionResponse> {
    let response: TransactionResponse

    try {
      const args = await this.addGasSettings(gasLimit, gasPrice)
      response = await this.contract.functions[this.fn](...args)
    } catch (error) {
      // MetaMask error messages are in a `data` property
      const txMessage = error.data?.message || error.message

      throw new Error(
        !txMessage || txMessage.includes('always failing transaction') || txMessage.includes('transaction may fail')
          ? 'Transaction failed - if this problem persists, contact mStable team.'
          : txMessage,
      )
    }

    if (!response?.hash) {
      throw new Error('Unable to send; missing transaction hash')
    }

    return response
  }

  async estimate(margin?: number): Promise<BigNumber> {
    try {
      const gasLimit = (await this.contract.estimateGas[this.fn](...this.args)) as BigNumber
      return calculateGasMargin(gasLimit, margin)
    } catch (error) {
      // Ethers v5 error handling:
      // - Error revert reasons can be nested
      // - Estimation may fail due to an unpredictable gas limit;
      //   attempt to use a fallback, and warn if not set.
      if (error.error) {
        if (error.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
          if (this.fallbackGasLimit) {
            return this.fallbackGasLimit
          }
          console.warn(`No fallback gaslimit set: ${this.id}`)
        }
        throw new Error(error.error.message ?? error.error.toString())
      }
      throw error
    }
  }

  setFallbackGasLimit(gasLimit: BigNumberish): void {
    this.fallbackGasLimit = BigNumber.from(gasLimit)
  }

  // eslint-disable-next-line class-methods-use-this
  private isCallOverrides(arg: unknown): boolean {
    return (
      arg != null &&
      typeof arg === 'object' &&
      ['nonce', 'gasLimit', 'gasPrice', 'value', 'chainId'].some(prop => Object.hasOwnProperty.call(arg, prop))
    )
  }

  private async addGasSettings(_gasLimit?: BigNumber, _gasPrice?: number): Promise<unknown[]> {
    let gasLimit: BigNumber | undefined = _gasLimit
    let gasPrice: number | undefined = _gasPrice

    const last = this.args[this.args.length - 1]
    const lastArgIsOverrides = this.isCallOverrides(last)

    if (lastArgIsOverrides && (last as CallOverrides).gasLimit) {
      // Don't alter the manifest if the gas limit is already set
      return this.args
    }

    // Set the gas limit (with the calculated gas margin)
    if (!gasLimit || (lastArgIsOverrides && !(last as CallOverrides).gasLimit)) {
      gasLimit = await this.estimate()
    }

    // Also set the gas price, because some providers don't
    if (!gasPrice) {
      gasPrice = parseFloat(await this.contract.provider.getGasPrice().toString())
    }

    const overrides = {
      ...(lastArgIsOverrides ? (last as CallOverrides) : null),
      gasLimit,
      gasPrice,
    }

    const argsWithoutOverrides = lastArgIsOverrides ? this.args.slice(0, this.args.length - 1) : this.args

    return [...argsWithoutOverrides, overrides]
  }
}
