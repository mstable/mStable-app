import React, { FC } from 'react';
import { useRedeemState } from './RedeemProvider';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { formatExactAmount } from '../../../web3/amounts';

export const RedeemConfirm: FC<{}> = () => {
  const { valid, amountInMasset, feeAmount, dataState } = useRedeemState();
  const mAsset = dataState?.mAsset;

  return valid && amountInMasset && mAsset ? (
    <>
      <P size={1}>
        You are redeeming <CountUp end={amountInMasset.simple} />{' '}
        {mAsset.symbol}.
      </P>
      <P size={1}>
        {feeAmount ? (
          <>
            There is a swap fee of{' '}
            <CountUp end={feeAmount.simple} decimals={6} /> mUSD (
            {formatExactAmount(mAsset.feeRate, 16, '%', true, 3)})
          </>
        ) : (
          <>There is no swap fee for this transaction.</>
        )}
      </P>
    </>
  ) : (
    <P>No valid transaction.</P>
  );
};
