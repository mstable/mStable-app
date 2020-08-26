import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as SaveIcon } from '../../icons/circle/save.svg';
import { P } from '../../core/Typography';
import { ButtonLink } from '../../core/Button';
import { Size } from '../../../theme';
import { CalculatorProvider } from './CalculatorProvider';
import { PageHeader } from '../PageHeader';
import { CalculatorForm } from './CalculatorForm';
import { EarningsChart } from './EarningsChart';

const CtaRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

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
    <CtaRow>
      <ButtonLink href="/save" size={Size.l}>
        Start saving now
      </ButtonLink>
    </CtaRow>
    <EarningsChart />
  </CalculatorProvider>
);
