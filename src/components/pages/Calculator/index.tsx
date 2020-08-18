import React, { FC } from 'react';

import { ReactComponent as SaveIcon } from '../../icons/circle/save.svg';
import { P } from '../../core/Typography';
import { CalculatorProvider } from './CalculatorProvider';
import { CalculatorForm } from './CalculatorForm';
import { PageHeader } from '../PageHeader';

export const Calculator: FC<{}> = () => (
  <CalculatorProvider>
    <PageHeader
      icon={<SaveIcon />}
      title="SAVE Calculator"
      subtitle="Calculate SAVE earnings."
    >
      <P>
        Calculate how much you have earned on your SAVE deposit or estimate
        future earnings.
      </P>
    </PageHeader>
    <CalculatorForm />
  </CalculatorProvider>
);
