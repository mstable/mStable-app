import React, { FC, useEffect, useRef } from 'react';
import { useCountUp, CountUpProps } from 'react-countup';
import styled from 'styled-components';
import { useFirstMountState } from 'react-use/lib/useFirstMountState';

import { useIsIdle } from '../../context/UserProvider';
import { Color } from '../../theme';

interface Props extends CountUpProps {
  container?: FC;
  highlight?: boolean;
  highlightColor?: Color;
}

const DEFAULT_DECIMALS = 2;
const DEFAULT_DURATION = 1;

const StyledSpan = styled.span<Pick<Props, 'highlight' | 'highlightColor'>>`
  color: ${({ highlight, highlightColor }) =>
    highlight && highlightColor ? highlightColor : 'inherit'};
  font-weight: ${({ highlight }) => (highlight ? 'bold' : 'normal')};
`;

const PrefixOrSuffix = styled.span`
  font-family: 'Poppins', sans-serif;
`;

const Number = styled.span`
  ${({ theme }) => theme.mixins.numeric}
`;

export const CountUp: FC<Props> = ({
  className,
  container: Container = StyledSpan,
  end,
  decimals = DEFAULT_DECIMALS,
  highlight,
  highlightColor,
  prefix,
  suffix,
  separator = ',',
  duration = DEFAULT_DURATION,
}) => {
  const prevEnd = useRef<typeof end>(end);
  const isIdle = useIsIdle();
  const firstMount = useFirstMountState();

  const { countUp, update, pauseResume, start } = useCountUp({
    decimals,
    duration,
    end,
    separator,
    start: prevEnd.current,
    // ...(prefix ? { prefix } : null),
    // ...(suffix ? { suffix } : null),
  });

  useEffect(() => {
    if (typeof end === 'number') {
      prevEnd.current = end;
      update(end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);

  useEffect(() => {
    if (isIdle && !firstMount) {
      pauseResume();
    }
  }, [firstMount, isIdle, pauseResume, start]);

  return (
    <Container
      className={className}
      highlight={highlight}
      highlightColor={highlightColor}
    >
      {prefix ? <PrefixOrSuffix>{prefix}</PrefixOrSuffix> : null}
      <Number>{countUp}</Number>
      {suffix ? <PrefixOrSuffix>{suffix}</PrefixOrSuffix> : null}
    </Container>
  );
};
