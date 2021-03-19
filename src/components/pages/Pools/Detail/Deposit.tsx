import React, { useState } from 'react';
import type { FC } from 'react';
import { FeederPool__factory } from '@mstable/protocol/types/generated';

import { usePropose } from '../../../../context/TransactionsProvider';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionManifest } from '../../../../web3/TransactionManifest';

import { AssetInput } from '../../../forms/AssetInput';
import { SendButton } from '../../../forms/SendButton';
import { Interfaces } from '../../../../types';

export const Deposit: FC<{
  poolAddress: string;
  tokens: string[];
}> = ({ poolAddress, tokens }) => {
  const [address, setAddress] = useState<string | undefined>(tokens[0]);
  const [amount, formValue, handleSetAmount] = useBigDecimalInput();

  const propose = usePropose();
  const signer = useSigner();
  const walletAddress = useWalletAddress();

  const token = useTokenSubscription(address);
  const valid = !!(
    address &&
    token?.balance &&
    amount?.exact.lt(token.balance.exact)
  );

  return (
    <>
      <AssetInput
        addressOptions={tokens}
        address={address}
        formValue={formValue}
        handleSetAddress={setAddress}
        handleSetAmount={handleSetAmount}
      />
      <SendButton
        title="Deposit"
        valid={valid}
        handleSend={() => {
          // TODO use SaveWrapper to deposit straight to vault
          if (valid && amount && address && walletAddress && signer) {
            propose<Interfaces.FeederPool, 'mint'>(
              new TransactionManifest(
                FeederPool__factory.connect(poolAddress, signer),
                'mint',
                // FIXME slippage
                [address, amount.exact, '1', walletAddress],
                { past: 'Deposited', present: 'Depositing' },
              ),
            );
          }
        }}
      />
    </>
  );
};
