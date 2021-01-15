import { Contract } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { TransactionResponse } from 'ethers/providers';

import { Instances, Interfaces, Purpose } from '../types';
import { TransactionOverrides } from '../typechain';
import { calculateGasMargin } from '../utils/maths';

export enum TransactionStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Response = 'Response',
  Error = 'Error',
  Confirmed = 'Confirmed',
}

export class TransactionManifest<
  TIface extends Interfaces,
  TFn extends keyof Instances[TIface]['functions']
> {
  readonly contract: Contract;

  readonly fn: string;

  readonly args: unknown[];

  readonly purpose: Purpose;

  readonly createdAt: number;

  readonly formId?: string;

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
    this.contract = contract;
    this.args = args;
    this.fn = fn;
    this.formId = formId;
    this.purpose = purpose;
    this.createdAt = Date.now();
  }

  get id(): string {
    return [
      this.formId,
      this.contract.address,
      this.fn,
      JSON.stringify(this.args),
    ].join('.');
  }

  async send(
    gasLimit?: BigNumber,
    gasPrice?: number,
  ): Promise<TransactionResponse> {
    let response: TransactionResponse;

    try {
      const args = await this.addGasSettings(gasLimit, gasPrice);
      response = await this.contract[this.fn](...args);
    } catch (error) {
      // MetaMask error messages are in a `data` property
      const txMessage = error.data?.message || error.message;

      throw new Error(
        !txMessage || txMessage.includes('always failing transaction')
          ? 'Transaction failed - if this problem persists, contact mStable team.'
          : txMessage,
      );
    }

    if (!response?.hash) {
      throw new Error('Unable to send; missing transaction hash');
    }

    return response;
  }

  async estimate(): Promise<BigNumber> {
    const gasLimit = (await this.contract.estimate[this.fn](
      ...this.args,
    )) as BigNumber;
    return calculateGasMargin(gasLimit);
  }

  // eslint-disable-next-line class-methods-use-this
  private isTransactionOverrides(arg: unknown): boolean {
    return (
      arg != null &&
      typeof arg === 'object' &&
      ['nonce', 'gasLimit', 'gasPrice', 'value', 'chainId'].some(prop =>
        Object.hasOwnProperty.call(arg, prop),
      )
    );
  }

  private async addGasSettings(
    _gasLimit?: BigNumber,
    _gasPrice?: number,
  ): Promise<unknown[]> {
    let gasLimit: BigNumber | undefined = _gasLimit;
    let gasPrice: number | undefined = _gasPrice;

    const last = this.args[this.args.length - 1];
    const lastArgIsOverrides = this.isTransactionOverrides(last);

    if (lastArgIsOverrides && !(last as TransactionOverrides).gasLimit) {
      // Don't alter the manifest if the gas limit is already set
      return this.args;
    }

    // Set the gas limit (with the calculated gas margin)
    if (!gasLimit) {
      gasLimit = await this.estimate();
    }

    // Also set the gas price, because some providers don't
    if (!gasPrice) {
      gasPrice = parseFloat(
        await this.contract.provider.getGasPrice().toString(),
      );
    }

    const overrides = {
      ...(lastArgIsOverrides ? (last as TransactionOverrides) : null),
      gasLimit,
      gasPrice,
    };

    return [...this.args, overrides];
  }
}
