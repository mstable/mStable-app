import React, { FC, useMemo, useState } from 'react';
import RenJS from '@renproject/ren';

import { Bitcoin } from '@renproject/chains';
import { RenNetwork } from '@renproject/interfaces';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { MultiAssetExchange } from '../../../forms/MultiAssetExchange';
import { Asset, getEthChainObject } from './ren';
import { Button } from '../../../core/Button';

export const Mint: FC = () => {
  const massetState = useSelectedMassetState();

  // RenJS
  const renJS = useMemo(() => new RenJS(RenNetwork.Testnet, {}), []);
  const recipientAddress = useWalletAddress();
  const [depositAddress, setDepositAddress] = useState<
    string | { address: string; params?: string; memo?: string } | null
  >(null);
  const signer = useSigner();
  const provider = (signer?.provider as any)?._web3Provider;

  const inputAssets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(massetState?.bAssets ?? {}).map(
          ([
            address,
            {
              token: { decimals, balance, symbol },
            },
          ]) => [address, { decimals, balance, symbol }],
        ),
      ),
    [massetState],
  );

  const outputAssets = useMemo(() => {
    if (!massetState) return {};
    const { address, decimals, symbol } = massetState.token;
    return { [address]: { decimals, symbol } };
  }, [massetState]);

  const mintBTC = async (): Promise<void> => {
    const asset = Asset.BTC;
    const from = Bitcoin();
    const to = getEthChainObject(provider, recipientAddress);

    if (!recipientAddress) return;

    const lockAndMint = await renJS?.lockAndMint({
      asset,
      from,
      to,
    });

    if (lockAndMint?.gatewayAddress) {
      setDepositAddress(lockAndMint.gatewayAddress);
    }

    lockAndMint.on('deposit', async deposit => {
      const txHash = await deposit.txHash();
      console.log('TX', txHash);
    });
  };

  return (
    <div>
      <MultiAssetExchange
        inputAssets={inputAssets}
        outputAssets={outputAssets}
        spender={massetState?.address}
      />
      <Button onClick={() => mintBTC()}>mint</Button>
      <p>{depositAddress}</p>
    </div>
  );
};
