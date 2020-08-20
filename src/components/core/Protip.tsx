import React, { FC } from 'react';
import styled from 'styled-components';

import { Color } from '../../theme';

interface Props {
  className?: string;
  title?: string;
  emoji?: string | null;
}

const ProtipLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const Container = styled.div`
  padding: 8px 16px;
  border: 1px ${Color.blackTransparent} solid;
  border-radius: 2px;
  color: ${Color.offBlack};
  a {
    color: ${Color.offBlack};
  }
  svg {
    fill: ${Color.offBlack};
  }
`;

export const Protip: FC<Props> = ({
  className,
  children,
  title = 'Protip',
  emoji = '💡',
}) => (
  <Container className={className}>
    <ProtipLabel>
      {title} {emoji ? <span>{emoji}</span> : null}
    </ProtipLabel>
    <div>{children}</div>
  </Container>
);
