import styled from 'styled-components';
import React, { FC } from 'react';
import {
  StatusWarnings,
  useAppStatusWarnings,
} from '../../context/AppProvider';

const WARNING_HEIGHT = 30;

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
  [StatusWarnings.Idle]: {
    label: 'Idle',
  },
};

const StatusBarContainer = styled.div<{ warnings: number }>`
  overflow: hidden;
  transition: height 0.1s linear;
  height: ${({ warnings }) => warnings * WARNING_HEIGHT}px;
`;

const StatusBarWarning = styled.div<{ error?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.color.white};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
  text-align: center;
  height: ${WARNING_HEIGHT};
  background: ${({ theme, error }) =>
    error ? theme.color.red : theme.color.blue};
`;

export const StatusBar: FC<{}> = () => {
  const warnings = useAppStatusWarnings();
  return (
    <StatusBarContainer warnings={warnings.length}>
      {warnings.map(warning => (
        <StatusBarWarning key={warning} error={statusWarnings[warning].error}>
          {statusWarnings[warning].label}
        </StatusBarWarning>
      ))}
    </StatusBarContainer>
  );
};
