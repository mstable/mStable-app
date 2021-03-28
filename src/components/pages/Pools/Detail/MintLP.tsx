import React, { FC, useMemo, useState } from 'react';

import { usePropose } from '../../../../context/TransactionsProvider';
import { useWalletAddress } from '../../../../context/OnboardProvider';
import { SendButton } from '../../../forms/SendButton';
import { AssetExchange } from '../../../forms/AssetExchange';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';
import { BigDecimalInputValue } from '../../../../hooks/useBigDecimalInputs';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import {
  useFPAssetAddressOptions,
  useFPVaultAddressOptions,
  useSelectedFeederPoolContract,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { useEstimatedOutput } from '../../../../hooks/useEstimatedOutput';
import { ADDRESSES } from '../../../../constants';

const formId = 'RedeemLP';

export const MintLP: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const contract = useSelectedFeederPoolContract();
  const propose = usePropose();
  const walletAddress = useWalletAddress();

  // TODO should include FP token as input (and then use vault only as output)
  const inputAddressOptions = useFPAssetAddressOptions();
  const outputAddressOptions = useFPVaultAddressOptions();

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    inputAddressOptions[0].address,
  );
  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    outputAddressOptions[0].address,
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const outputToken = outputAddressOptions.find(
    t => t.address === outputAddress,
  );

  const inputToken = useMemo(
    () => inputAddressOptions.find(t => t.address === inputAddress),
    [inputAddress, inputAddressOptions],
  );

  const contractAddress =
    inputAddress === feederPool.address
      ? feederPool.vault.address
      : ADDRESSES.FEEDER_WRAPPER;

  const approve = useMemo(
    () =>
      (inputAddress && {
        spender: contractAddress,
        address: inputAddress,
        amount: inputAmount,
      }) ||
      undefined,
    [inputAddress, contractAddress, inputAmount],
  );

  const { estimatedOutputAmount, exchangeRate } = useEstimatedOutput(
    {
      ...inputAddressOptions.find(t => t.address === inputAddress),
      amount: inputAmount,
    } as BigDecimalInputValue,
    { ...outputToken, address: feederPool.address } as BigDecimalInputValue,
  );

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    inputAmount,
    estimatedOutputAmount.value,
  );

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount';

    if (!estimatedOutputAmount.value?.simple && !estimatedOutputAmount.fetching)
      return `Not enough ${outputToken?.symbol} in basket`;

    if (
      feederPool.token.balance?.exact &&
      inputAmount.exact.gt(feederPool.token.balance.exact)
    ) {
      return 'Insufficient balance';
    }

    if (!outputToken) {
      return 'Must select an asset to receive';
    }

    if (inputAmount.exact.eq(0)) {
      return 'Amount must be greater than zero';
    }

    return estimatedOutputAmount.error;
  }, [inputAmount, feederPool.token, estimatedOutputAmount, outputToken]);

  return (
    <AssetExchange
      error={penaltyBonus?.message}
      exchangeRate={exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(inputToken?.balance?.string);
      }}
      handleSetOutputAddress={setOutputAddress}
      inputAddress={inputAddress}
      inputAddressOptions={inputAddressOptions}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      outputAddressOptions={outputAddressOptions}
      outputFormValue={estimatedOutputAmount.value?.string}
    >
      <SendButton
        title={error ?? 'Mint'}
        approve={approve}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!contract || !walletAddress || !feederPool) return;
          if (!inputAddress || !inputAmount || !minOutputAmount) return;

          if (outputAddress !== feederPool.address) {
            // Deposit to vault here
            return;
          }

          return propose<Interfaces.FeederPool, 'mint'>(
            new TransactionManifest(
              contract,
              'mint',
              [
                inputAddress,
                inputAmount.exact,
                minOutputAmount.exact,
                walletAddress,
              ],
              { past: 'Minted', present: 'Minting' },
              formId,
            ),
          );
        }}
      />
      <TransactionInfo
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
      />
    </AssetExchange>
  );
};
