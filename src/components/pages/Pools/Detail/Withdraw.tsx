import React, { useState } from 'react';
import type { FC } from 'react';

import type { AddressOption } from '../../../../types';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { AssetInput } from '../../../forms/AssetInput';
import { Button } from '../../../core/Button';

export const Withdraw: FC<{
  address: string;
  label: string;
}> = ({ address: poolAddress, label }) => {
  const token = useTokenSubscription(poolAddress);

  const addressOptions: AddressOption[] = token
    ? [
        {
          ...token,
          label,
          custom: true,
        },
      ]
    : [];

  const [address, setAddress] = useState<string | undefined>(poolAddress);

  return (
    <>
      <AssetInput
        addressOptions={addressOptions}
        address={address}
        handleSetAddress={setAddress}
      />
      <Button highlighted>Withdraw</Button>
    </>
  );
};
