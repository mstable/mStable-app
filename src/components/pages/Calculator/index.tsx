import React, { FC } from 'react';

import { ReactComponent as SaveIcon } from '../../icons/circle/save.svg';
import { CalculatorProvider } from './CalculatorProvider';
import { PageHeader } from '../PageHeader';
import { CalculatorForm } from './CalculatorForm';

export const Calculator: FC<{}> = () => (
  <CalculatorProvider>
    <PageHeader
      icon={<SaveIcon />}
      title="SAVE Calculator"
      subtitle="Calculate future SAVE earnings."
    />
    <CalculatorForm />
  </CalculatorProvider>
);
