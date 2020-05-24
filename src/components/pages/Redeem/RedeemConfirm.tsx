import React, { FC } from 'react';
import { useRedeemState } from './RedeemProvider';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';

export const RedeemConfirm: FC<{}> = () => {
  const { bAssetOutputs, valid, mAssetData, redemption } = useRedeemState();

  const bAssetsData = mAssetData?.bAssets || [];

  const selectedBassets = bAssetOutputs.map(({ address, amount }) => ({
    amount,
    symbol: bAssetsData.find(b => b.address === address)?.token.symbol,
  }));

  return valid && redemption.amount.simple && mAssetData?.token.symbol ? (
    <>
      <P size={1}>
        <span>You are redeeming </span>
        {selectedBassets.map(({ amount, symbol }, index, arr) => (
          <span key={symbol}>
            <CountUp end={amount.simple || 0} /> {symbol}
            {arr.length > 1 && index !== arr.length - 1
              ? index === arr.length - 2
                ? ' and '
                : ', '
              : null}
          </span>
        ))}
        <span> with </span>
        <span>
          <CountUp end={redemption.amount.simple} /> {mAssetData.token.symbol}.
        </span>
      </P>
    </>
  ) : (
    <P>No valid transaction.</P>
  );
};
