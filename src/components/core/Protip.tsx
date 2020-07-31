import React, { FC } from 'react';
import styled from 'styled-components';

import { Color } from '../../theme';

interface Props {
  title?: string;
  emoji?: string;
}

const ProtipLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const Container = styled.div`
  padding: 8px 16px;
  border: 1px ${Color.blueTransparent} solid;
  border-radius: 2px;
  color: ${Color.blue};
  a {
    color: ${Color.blue};
  }
  svg {
    fill: ${Color.blue};
  }
`;

export const Protip: FC<Props> = ({
  children,
  title = 'Protip',
  emoji = '💡',
}) => (
  <Container>
    <ProtipLabel>
      {title} <span>{emoji}</span>
    </ProtipLabel>
    <div>{children}</div>
  </Container>
);
