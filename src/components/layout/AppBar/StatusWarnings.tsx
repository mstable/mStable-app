import React, { FC } from 'react';
import styled from 'styled-components';

import {
  StatusWarnings,
  useAppStatusWarnings,
} from '../../../context/AppProvider';
import { Color } from '../../../theme';

const statusWarnings: Record<
  StatusWarnings,
  { label: string; error?: boolean }
> = {
  [StatusWarnings.UnsupportedChain]: {
    label: 'Unsupported chain',
    error: true,
  },
  [StatusWarnings.NotOnline]: {
    label: 'Not online',
  },
};

const StatusWarning = styled.div<{ error?: boolean }>`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  color: ${({ error }) => (error ? Color.red : Color.offBlack)};
  background: ${Color.white};
  border-right: 1px ${Color.red} solid;
  border-bottom: 1px ${Color.red} solid;
  padding: 8px 16px;
`;

const StatusWarningsRowContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  > * {
    margin-right: 16px;
  }
`;

export const StatusWarningsRow: FC = () => {
  const warnings = useAppStatusWarnings();

  return (
    <StatusWarningsRowContainer>
      {warnings.map(warning => (
        <StatusWarning key={warning} error={statusWarnings[warning].error}>
          {statusWarnings[warning].label}
        </StatusWarning>
      ))}
    </StatusWarningsRowContainer>
  );
};
