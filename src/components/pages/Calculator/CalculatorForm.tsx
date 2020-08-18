import React, { FC, useMemo, useEffect, useState } from 'react';
import { BigNumber } from 'ethers/utils';
import styled from 'styled-components';
import { emojisplosions } from 'emojisplosion';

import { P, H2 } from '../../core/Typography';
import { ButtonLink } from '../../core/Button';
import { Size } from '../../../theme';
import { BigDecimal } from '../../../web3/BigDecimal';
import { useApyForPast30Days } from '../../../web3/hooks';
import { formatExactAmount } from '../../../web3/amounts';
import {
  useCalculatorState,
  useCalculatorDispatch,
} from './CalculatorProvider';
import { Slider } from './Slider';
import { calculateProfit } from './utils';

const Bold = styled.span`
  font-weight: bold;
`;

const Section = styled.div`
  padding-bottom: 2rem;
`;

const ResultRow = styled(P)`
  display: flex;
  justify-content: space-between;
  padding-bottom: 4px;
`;

const CtaRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

type ResultProps = {
  apyLabel: string;
  apy: BigNumber | undefined;
  profit: BigDecimal;
  total: BigDecimal;
};

const Result: FC<ResultProps> = ({ apyLabel, apy, profit, total }) => (
  <>
    <ResultRow size={Size.l}>
      <span>{apyLabel}</span>
      <Bold>{formatExactAmount(apy, 16, '%')}</Bold>
    </ResultRow>

    <ResultRow size={Size.l}>
      <span>Profit</span>
      <Bold>{profit.format(2, true, 'mUSD')}</Bold>
    </ResultRow>

    <ResultRow size={Size.l}>
      <span>Total amount</span>
      <Bold>{total.format(2, true, 'mUSD')}</Bold>
    </ResultRow>
  </>
);

export const CalculatorForm: FC = () => {
  const [exploded, setExploded] = useState(false);
  const {
    amount,
    formAmount,
    minAmount,
    maxAmount,
    months,
    minMonths,
    maxMonths,
    days,
  } = useCalculatorState();

  const { amountChanged, monthsChanged } = useCalculatorDispatch();

  const futureApy = useApyForPast30Days();
  const bankApy = BigDecimal.parse('0.07', 16).exact;

  const profit = useMemo<BigDecimal>(
    () => calculateProfit(amount, futureApy, days),
    [amount, futureApy, days],
  );

  const total = useMemo<BigDecimal>(() => profit.add(amount), [amount, profit]);

  const bankProfit = useMemo<BigDecimal>(
    () => calculateProfit(amount, bankApy, days),
    [amount, bankApy, days],
  );

  const bankTotal = useMemo<BigDecimal>(() => bankProfit.add(amount), [
    amount,
    bankProfit,
  ]);

  useEffect(() => {
    const thresholdAmount = BigDecimal.parse('75000', 18).exact;

    if (!exploded && (amount.exact.gt(thresholdAmount) || months > 20)) {
      const { cancel } = emojisplosions({
        emojis: ['💰', '🤑', '💵', '💲'],
      });
      setExploded(true);
      setTimeout(cancel, 10000);
    }
  }, [amount, months, exploded]);

  return (
    <div>
      <Section>
        <Slider
          title="Deposit amount in mUSD"
          min={minAmount}
          max={maxAmount}
          step={minAmount}
          label={['mUSD', 'mUSD']}
          value={formAmount}
          onChange={amountChanged}
        />
      </Section>

      <Section>
        <Slider
          title="Term in months"
          min={minMonths}
          max={maxMonths}
          step={1}
          label={['month', 'months']}
          value={months}
          onChange={monthsChanged}
        />
      </Section>

      <Section>
        <H2>Estimated results</H2>
        <Result
          apyLabel="Last 30 days average APY"
          apy={futureApy}
          profit={profit}
          total={total}
        />
      </Section>

      <Section>
        <H2>Compare with an average bank offer</H2>
        <Result
          apyLabel="Average bank APY"
          apy={bankApy}
          profit={bankProfit}
          total={bankTotal}
        />
      </Section>

      <CtaRow>
        <ButtonLink href="/save" size={Size.l}>
          Start saving now
        </ButtonLink>
      </CtaRow>
    </div>
  );
};
