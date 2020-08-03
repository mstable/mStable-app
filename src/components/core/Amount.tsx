import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { CountUpProps } from 'react-countup';

import { BigDecimal } from '../../web3/BigDecimal';
import { CountUp } from './CountUp';
import { Tooltip } from './ReactTooltip';

export enum NumberFormat {
  Abbreviated,
  SimpleRounded,
  Simple,
  Long,
  Percentage,
  Exact,
  Countup,
  CountupPercentage,
}

export interface Props {
  amount?: BigDecimal;
  className?: string;
  commas?: boolean;
  countup?: Omit<CountUpProps, 'end' | 'suffix'>;
  decimalPlaces?: number;
  format: NumberFormat;
  price?: BigDecimal;
  suffix?: string;
}

const Container = styled.span`
  font-family: 'DM Mono', monospace !important;
`;

export const Amount: FC<Props> = ({
  amount,
  className,
  commas,
  countup,
  decimalPlaces,
  format,
  price,
  suffix,
}) => {
  const tooltip = useMemo(
    () =>
      price && price.exact.gt(0) && amount && amount.exact.gt(0)
        ? `$${BigDecimal.parse(
            (price.simple * amount.simple).toString(),
            amount.decimals,
          ).format()} @ $${price.format(2)}`
        : undefined,
    [price, amount],
  );

  const formatted = useMemo<string | number | undefined>(() => {
    if (!amount) return undefined;

    switch (format) {
      case NumberFormat.SimpleRounded:
        return amount.simpleRounded;
      case NumberFormat.Simple:
      case NumberFormat.Countup:
        return amount.simple;
      case NumberFormat.Long:
        return amount.format(decimalPlaces, commas, suffix);
      case NumberFormat.Abbreviated:
        return amount.abbreviated;
      case NumberFormat.Percentage:
        return `${amount.toPercent(decimalPlaces)}%`;
      case NumberFormat.CountupPercentage:
        return amount.toPercent(decimalPlaces);
      default:
        return amount.exact.toString();
    }
  }, [amount, format, decimalPlaces, commas, suffix]);

  return (
    <Container className={className}>
      <Tooltip tip={tooltip}>
        {amount && formatted ? (
          format === NumberFormat.Countup ||
          format === NumberFormat.CountupPercentage ? (
            <CountUp
              end={formatted as number}
              suffix={format === NumberFormat.CountupPercentage ? '%' : suffix}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...countup}
            />
          ) : (
            formatted
          )
        ) : (
          '-'
        )}
      </Tooltip>
    </Container>
  );
};
