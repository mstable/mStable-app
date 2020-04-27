import React, { FC } from 'react';
import CountUpBase, { CountUpProps } from 'react-countup';

const DEFAULT_DECIMALS = 2;
const DEFAULT_DURATION = 1;

export const CountUp: FC<CountUpProps> = ({
  className,
  end,
  decimals = DEFAULT_DECIMALS,
  prefix,
  suffix,
  separator = ',',
  duration = DEFAULT_DURATION,
}) => (
  <CountUpBase
    className={className}
    start={0}
    end={end}
    separator={separator}
    prefix={prefix}
    suffix={suffix}
    decimals={decimals}
    duration={duration}
  />
);
