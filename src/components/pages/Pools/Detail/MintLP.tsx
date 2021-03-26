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
  useSelectedFeederPoolContract,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { useEstimatedOutput } from '../../../../hooks/useEstimatedOutput';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokens } from '../../../../context/TokensProvider';

const formId = 'RedeemLP';

export const MintLP: FC = () => {
  const { bAssets } = useSelectedMassetState() ?? {};
  const feederPool = useSelectedFeederPoolState();
  const contract = useSelectedFeederPoolContract();
  const propose = usePropose();
  const walletAddress = useWalletAddress();

  const mpAssetsTokens = useTokens(
    Object.keys(bAssets ?? {}).map(address => address),
  );

  const inputTokens = useMemo(
    () => [feederPool.masset.token, feederPool.fasset.token, ...mpAssetsTokens],
    [feederPool, mpAssetsTokens],
  );

  const [inputAddress, setInputAddress] = useState<string | undefined>(
    inputTokens[0].address,
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const { token: outputToken } = feederPool;

  const inputToken = useMemo(
    () => inputTokens.find(t => t.address === inputAddress),
    [inputAddress, inputTokens],
  );

  const approve = useMemo(
    () =>
      (inputAddress && {
        spender: feederPool.address,
        address: inputAddress,
        amount: inputAmount,
      }) ||
      undefined,
    [inputAddress, inputAmount, feederPool],
  );

  const { estimatedOutputAmount, exchangeRate } = useEstimatedOutput(
    {
      ...inputTokens.find(t => t.address === inputAddress),
      amount: inputAmount,
    } as BigDecimalInputValue,
    { ...outputToken } as BigDecimalInputValue,
  );

  const { minOutputAmount, penaltyBonus } = useMinimumOutput(
    slippageSimple,
    inputAmount,
    estimatedOutputAmount?.value,
  );

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount';

    if (
      !estimatedOutputAmount?.value?.simple &&
      !estimatedOutputAmount?.fetching
    )
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

    return estimatedOutputAmount?.error;
  }, [inputAmount, feederPool.token, estimatedOutputAmount, outputToken]);

  return (
    <AssetExchange
      inputAddressOptions={inputTokens}
      outputAddressOptions={[outputToken]}
      error={penaltyBonus?.message}
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(inputToken?.balance?.string);
      }}
      handleSetInputAddress={setInputAddress}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputToken.address}
      outputFormValue={estimatedOutputAmount?.value?.string}
    >
      <SendButton
        title={error ?? 'Mint'}
        approve={approve}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!contract || !walletAddress || !feederPool) return;
          if (!inputAddress || !inputAmount || !minOutputAmount) return;

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
