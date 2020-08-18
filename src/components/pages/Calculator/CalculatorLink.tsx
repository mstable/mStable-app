import React, { FC } from 'react';
import styled from 'styled-components';
import { ButtonLink } from '../../core/Button';

const Link = styled(ButtonLink)`
  padding: 4px 8px;
  text-transform: none;
`;

export const CalculatorLink: FC<{}> = () => (
  <Link href="/save/calculator">
    <span role="img" aria-label="money bag">
      💰
    </span>{' '}
    Calculate earnings
  </Link>
);
