import React, { FC } from 'react';
import styled from 'styled-components';

import { Navigation } from './Navigation';
import { UnstyledButton } from '../core/Button';
import { FontSize, ViewportWidth } from '../../theme';
import { centredLayout } from './css';
import { useAccountOpen, useCloseAccount } from '../../context/AppProvider';

const CloseAccountContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
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

const CloseAccount: FC<{}> = () => {
  const closeAccount = useCloseAccount();
  return (
    <CloseAccountContainer>
      <CloseAccountBtn type="button" onClick={closeAccount}>
        Back to app
      </CloseAccountBtn>
    </CloseAccountContainer>
  );
};

const Content = styled.div`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 ${({ theme }) => theme.spacing.s};
  height: auto;

  @media (min-width: ${ViewportWidth.m}) {
    flex-wrap: initial;
  }

  ${centredLayout}
`;

const Container = styled.header<{ accountOpen: boolean; home: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 48px;
  padding: 40px 0 20px;
  min-width: ${ViewportWidth.xs};
  background: ${({ accountOpen, theme }) =>
    accountOpen ? theme.color.black : theme.color.white};
`;

export const Header: FC<{ home: boolean }> = ({ home }) => {
  const accountOpen = useAccountOpen();

  return (
    <Container home={home} accountOpen={accountOpen}>
      <Content>
        {home ? null : accountOpen ? <CloseAccount /> : <Navigation />}
      </Content>
    </Container>
  );
};
