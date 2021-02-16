import React, { FC } from 'react';
import styled from 'styled-components';

import { Navigation } from './Navigation';
import { UnstyledButton } from '../core/Button';
import { FontSize, ViewportWidth } from '../../theme';
import { useAccountOpen, useCloseAccount } from '../../context/AppProvider';

const CloseAccountContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem 0;
`;

const CloseAccountBtn = styled(UnstyledButton)`
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  cursor: pointer;

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.l};
  }
`;

const CloseAccount: FC = () => {
  const closeAccount = useCloseAccount();
  return (
    <CloseAccountContainer>
      <CloseAccountBtn type="button" onClick={closeAccount}>
        Back to app
      </CloseAccountBtn>
    </CloseAccountContainer>
  );
};

const Container = styled.header<{ accountOpen: boolean; home: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ accountOpen, theme }) =>
    accountOpen ? theme.color.black : theme.color.background};
`;

export const Header: FC<{ home: boolean }> = ({ home }) => {
  const accountOpen = useAccountOpen();

  return (
    <Container home={home} accountOpen={accountOpen}>
      {home ? null : accountOpen ? <CloseAccount /> : <Navigation />}
    </Container>
  );
};
