import React, { FC } from 'react';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { useSwapState } from './SwapProvider';
import { formatExactAmount } from '../../../web3/amounts';

export const SwapConfirm: FC<{}> = () => {
  const {
    values: { input, output, feeAmountSimple },
    valid,
    mAssetData,
  } = useSwapState();

  return valid && input.amount.simple && output.amount.simple ? (
    <>
      <P size={1}>
        You are swapping{' '}
        <span>
          <CountUp end={input.amount.simple} /> {input.token.symbol}
        </span>
        <span> for </span>
        <span>
          <CountUp end={output.amount.simple} /> {output.token.symbol}
        </span>
        {feeAmountSimple ? null : <span> (1:1)</span>} with zero-slippage.
      </P>
      {feeAmountSimple && mAssetData?.feeRate ? (
        <>
          <P size={1}>
            This includes a swap fee of
            <span>
              {' '}
              <CountUp end={parseFloat(feeAmountSimple)} decimals={6} /> mUSD (
              {formatExactAmount(mAssetData?.feeRate, 16, '%', false, 3)})
            </span>
            .
          </P>
          <P size={1}>
            Read more about the mStable swap fee{' '}
            <a
              href="https://docs.mstable.org/mstable-assets/massets/swapping#swap-fees"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </P>
        </>
      ) : null}
    </>
  ) : null;
};
