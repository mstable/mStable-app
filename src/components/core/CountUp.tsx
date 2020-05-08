import React, { FC, useEffect, useRef } from 'react';
import CountUpBase, { CountUpProps } from 'react-countup';
import styled from 'styled-components';

const DEFAULT_DECIMALS = 2;
const DEFAULT_DURATION = 1;

const Container = styled.span`
  ${({ theme }) => theme.mixins.numeric}
`;

export const CountUp: FC<CountUpProps> = ({
  className,
  end,
  decimals = DEFAULT_DECIMALS,
  prefix,
  suffix,
  separator = ',',
  duration = DEFAULT_DURATION,
}) => {
  const prevEnd = useRef<typeof end>(end);

  useEffect(() => {
    if (end) prevEnd.current = end;
  }, [end]);

  return (
    <Container className={className}>
      <CountUpBase
        start={prevEnd.current}
        end={end}
        separator={separator}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        duration={duration}
      />
    </Container>
  );
};
