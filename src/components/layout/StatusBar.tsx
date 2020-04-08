import styled from 'styled-components';
import React, { FC } from 'react';
import {
  StatusWarnings,
  useAppStatusWarnings,
} from '../../context/AppProvider';

const StatusBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const StatusBarWarning = styled.div`
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.color.red};
  color: ${({ theme }) => theme.color.background};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
  text-align: center;
`;

export const StatusBar: FC<{}> = () => {
  const warnings = useAppStatusWarnings();
  return (
    <StatusBarContainer>
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
