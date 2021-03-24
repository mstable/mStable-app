import React, { FC, useMemo, useState } from 'react';

import { usePropose } from '../../../../context/TransactionsProvider';
import { useWalletAddress } from '../../../../context/OnboardProvider';
import { SendButton } from '../../../forms/SendButton';
import { AssetExchange } from '../../../forms/AssetExchange';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionInfo } from '../../../core/TransactionInfo';
import { useSimpleInput } from '../../../../hooks/useSimpleInput';
import { BigDecimalInputValues } from '../../../../hooks/useBigDecimalInputs';
import { useEstimatedRedeemTokenOutput } from '../../../../hooks/useEstimatedRedeemTokenOutput';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import {
  useSelectedFeederPoolContract,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';

const formId = 'RedeemLP';

export const RedeemLP: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const contract = useSelectedFeederPoolContract();
  const propose = usePropose();
  const walletAddress = useWalletAddress();
  const outputTokens = useMemo(
    () => [feederPool.masset.token, feederPool.fasset.token],
    [feederPool],
  );

  const [outputAddress, setOutputAddress] = useState<string | undefined>(
    outputTokens[0].address,
  );

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const outputToken = useMemo(
    () => outputTokens.find(t => t.address === outputAddress),
    [outputAddress, outputTokens],
  );

  const { estimatedOutputAmount, exchangeRate } = useEstimatedRedeemTokenOutput(
    contract,
    inputAmount,
    {
      [outputAddress as string]: {
        ...outputTokens.find(t => t.address === outputAddress),
      },
    } as BigDecimalInputValues,
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
      inputAddressOptions={[feederPool.token]}
      outputAddressOptions={outputTokens}
      error={penaltyBonus?.message}
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(feederPool.token.balance?.string);
      }}
      handleSetOutputAddress={setOutputAddress}
      inputAddress={feederPool.address}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      outputFormValue={estimatedOutputAmount?.value?.string}
    >
      <SendButton
        title={error ?? 'Redeem'}
        penaltyBonusAmount={penaltyBonus?.percentage}
        valid={!error}
        handleSend={() => {
          if (!contract || !walletAddress || !feederPool) return;
          if (!outputAddress || !inputAmount || !minOutputAmount) return;

          return propose<Interfaces.FeederPool, 'redeem'>(
            new TransactionManifest(
              contract,
              'redeem',
              [
                outputAddress,
                inputAmount.exact,
                minOutputAmount.exact,
                walletAddress,
              ],
              { past: 'Redeemed', present: 'Redeeming' },
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
