import React, { FC } from 'react';
import { P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { useSwapState } from './SwapProvider';

export const SwapConfirm: FC<{}> = () => {
  const {
    values: { input, output, feeAmountSimple },
    valid,
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
        {feeAmountSimple ? null : <span> (1:1)</span>}.
      </P>
      {feeAmountSimple ? (
        <>
          <P size={1}>
            This includes a swap fee of
            <span>
              {' '}
              <CountUp end={parseFloat(feeAmountSimple)} decimals={4} /> mUSD
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
