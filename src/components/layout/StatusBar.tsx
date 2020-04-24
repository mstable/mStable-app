import styled from 'styled-components';
import React, { FC } from 'react';
import {
  StatusWarnings,
  useAppStatusWarnings,
} from '../../context/AppProvider';

const WARNING_HEIGHT = 30;

const StatusBarContainer = styled.div<{ warnings: number }>`
  overflow: hidden;
  transition: height 0.3s linear;
  height: ${({ warnings }) => warnings * WARNING_HEIGHT}px;
  background: ${({ theme }) => theme.color.red};
`;

const StatusBarWarning = styled.div`
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.color.background};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
  text-align: center;
  height: ${WARNING_HEIGHT};
`;

export const StatusBar: FC<{}> = () => {
  const warnings = useAppStatusWarnings();
  return (
    <StatusBarContainer warnings={warnings.length}>
      {warnings.map(warning => (
        <StatusBarWarning key={warning}>
          {warning === StatusWarnings.NotOnline
            ? 'Not online'
            : warning === StatusWarnings.UnsupportedChain
            ? 'Unsupported chain'
            : 'Unknown'}
        </StatusBarWarning>
      ))}
    </StatusBarContainer>
  );
};
