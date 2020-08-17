import React, { FC } from 'react';

import { P, H3 } from '../../core/Typography';
import {
  useCalculatorState,
  useCalculatorDispatch,
} from './CalculatorProvider';

export const CalculatorInfo: FC<{}> = () => {
  const { initialized } = useCalculatorState();
  const { calculate } = useCalculatorDispatch();

  console.log(initialized, calculate);

  return (
    <div>
      <H3>Calculator</H3>
      <P>A nice way to visualise and calculate the two questions: </P>
      <P>
        "If I had put in X mUSD into the savings contract at Y date, how much
        mUSD would I have now?"
      </P>
      <P>
        "If I put in X mUSD into the savings contract now, how much am I likely
        to have at Y date in the future?
      </P>
    </div>
  );
};
