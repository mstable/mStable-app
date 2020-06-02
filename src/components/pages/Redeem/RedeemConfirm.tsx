import React, { FC } from 'react';
import { useRedeemState } from './RedeemProvider';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';

export const RedeemConfirm: FC<{}> = () => {
  const { valid, mAssetData, redemption, feeAmountSimple } = useRedeemState();

  return valid && redemption.amount.simple && mAssetData?.token.symbol ? (
    <>
      <P size={1}>
        You are redeeming <CountUp end={redemption.amount.simple} />{' '}
        {mAssetData.token.symbol}.
      </P>
      <P size={1}>
        {feeAmountSimple ? (
          <>
            There is a swap fee of <CountUp end={feeAmountSimple} decimals={4} /> mUSD.
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
