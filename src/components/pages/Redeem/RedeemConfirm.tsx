import React, { FC } from 'react';
import { useRedeemState } from './RedeemProvider';
import { Mode } from './types';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { formatExactAmount } from '../../../web3/amounts';

export const RedeemConfirm: FC = () => {
  const {
    valid,
    amountInMasset,
    feeAmount,
    massetState,
    mode,
  } = useRedeemState();

  return valid && amountInMasset && massetState ? (
    <>
      <P size={1}>
        You are redeeming <CountUp end={amountInMasset.simple} />{' '}
        {massetState.token.symbol}.
      </P>
      <P size={1}>
        {feeAmount?.exact.gt(0) ? (
          mode === Mode.RedeemMasset ? (
            <>
              There is a redemption fee of{' '}
              <CountUp end={feeAmount.simple} decimals={6} /> mUSD (
              {formatExactAmount(
                massetState.redemptionFeeRate,
                16,
                '%',
                true,
                3,
              )}
              )
            </>
          ) : (
            <>
              There is a swap fee of{' '}
              <CountUp end={feeAmount.simple} decimals={6} /> mUSD (
              {formatExactAmount(massetState.feeRate, 16, '%', true, 3)})
            </>
          )
        ) : (
          <>There is no fee for this transaction.</>
        )}
      </P>
    </>
  ) : (
    <P>No valid transaction.</P>
  );
};
