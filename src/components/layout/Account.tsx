import React, { FC } from 'react';
import styled from 'styled-components';

import { AccountItems, useAccountItem } from '../../context/AppProvider';
import { Wallet } from '../wallet/Wallet';
import { Notifications } from './Notifications';
import { centredLayout } from './css';

const Container = styled.div`
  padding: 40px 20px;
  ${centredLayout}
`;

export const Account: FC<{}> = () => {
  const accountItem = useAccountItem();

  return (
    <Container>
      {accountItem === AccountItems.Wallet ? (
        <Wallet />
      ) : accountItem === AccountItems.Notifications ? (
        <Notifications />
      ) : null}
    </Container>
  );
};
