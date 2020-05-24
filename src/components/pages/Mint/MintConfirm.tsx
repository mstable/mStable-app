import React, { FC } from 'react';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { useMintState } from './MintProvider';

export const MintConfirm: FC<{}> = () => {
  const { valid, bAssetInputs, mAsset, mAssetData } = useMintState();

  const bAssetsData = mAssetData?.bAssets || [];

  const selectedBassets = bAssetInputs
    .filter(b => b.enabled)
    .map(({ address, amount }) => ({
      amount,
      symbol: bAssetsData.find(b => b.address === address)?.token.symbol,
    }));

  return valid && mAsset.amount.simple ? (
    <>
      <P size={1}>
        <span>
          You are minting <CountUp end={mAsset.amount.simple} />{' '}
          {mAsset.token.symbol}
        </span>
        <span> with </span>
        {selectedBassets.map(({ amount, symbol }, index, arr) => (
          <span key={symbol}>
            {arr.length > 1
              ? index === arr.length - 1
                ? ' and '
                : ', '
              : null}
            <CountUp end={amount.simple || 0} /> {symbol}
          </span>
        ))}
        .
      </P>
    </>
  ) : (
    <P>No valid transaction.</P>
  );
};
