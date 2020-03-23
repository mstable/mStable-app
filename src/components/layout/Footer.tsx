import React, { FC } from 'react';
import styled from 'styled-components';
import { Wallet } from '../wallet/Wallet';
import { useWalletExpanded } from '../../context/UIProvider';

const Container = styled.footer<{ expanded: boolean }>`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: ${props => (props.expanded ? '100%' : '80px')};
`;

/**
 * Placeholder component for footer.
 */
export const Footer: FC<{}> = () => {
  const walletExpanded = useWalletExpanded();
  return (
    <Container expanded={walletExpanded}>
      <Wallet />
    </Container>
  );
};
