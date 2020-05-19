import React, { FC, useEffect, useRef } from 'react';
import { useCountUp, CountUpProps } from 'react-countup';
import styled from 'styled-components';

interface Props extends CountUpProps {
  container?: FC;
}

const DEFAULT_DECIMALS = 2;
const DEFAULT_DURATION = 1;

const StyledSpan = styled.span`
  ${({ theme }) => theme.mixins.numeric}
`;

export const CountUp: FC<Props> = ({
  className,
  container: Container = StyledSpan,
  end,
  decimals = DEFAULT_DECIMALS,
  prefix,
  suffix,
  separator = ',',
  duration = DEFAULT_DURATION,
}) => {
  const prevEnd = useRef<typeof end>(end);

  const { countUp, update } = useCountUp({
    decimals,
    duration,
    end,
    separator,
    start: prevEnd.current,
    ...(prefix ? { prefix } : null),
    ...(suffix ? { suffix } : null),
  });

  useEffect(() => {
    if (typeof end === 'number') {
      prevEnd.current = end;
      update(end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);

  return <Container className={className}>{countUp}</Container>;
};
