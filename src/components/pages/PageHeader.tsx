import React, { FC } from 'react';
import styled from 'styled-components';

import { H2, P } from '../core/Typography';
import { FontSize } from '../../theme';
import { ReactComponent as SaveIcon } from '../icons/circle/save.svg';
import { ReactComponent as MintIcon } from '../icons/circle/mint.svg';
import { ReactComponent as EarnIcon } from '../icons/circle/earn.svg';
import { ReactComponent as SwapIcon } from '../icons/circle/swap.svg';
import { ReactComponent as RedeemIcon } from '../icons/circle/redeem.svg';
import { ReactComponent as AnalyticsIcon } from '../icons/circle/analytics.svg';
import { ReactComponent as AccountIcon } from '../icons/circle/account.svg';

export enum PageAction {
  Save = 'Save',
  Mint = 'Mint',
  Earn = 'Earn',
  Swap = 'Swap',
  Redeem = 'Redeem',
  Analytics = 'Analytics',
  Account = 'Account',
}

interface Props {
  action: PageAction;
  subtitle: string;
}

const ActionIcons: { [action: string]: JSX.Element } = {
  Save: <SaveIcon />,
  Mint: <MintIcon />,
  Earn: <EarnIcon />,
  Swap: <SwapIcon />,
  Redeem: <RedeemIcon />,
  Analytics: <AnalyticsIcon />,
  Account: <AccountIcon />,
};

const Icon = styled.div<{ inverted?: boolean }>`
  padding: 0;
  display: flex;

  img,
  svg {
    width: 64px;
    height: 64px;
    margin-right: 16px;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  img + div {
    display: none;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: 1rem;

  h2 {
    font-size: ${FontSize.xl};
    font-weight: 600;
  }

  p {
    padding: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`;

export const PageHeader: FC<Props> = ({ children, action, subtitle }) => {
  const icon = ActionIcons[action];

  return (
    <Container>
      <Row>
        <Icon inverted>{icon}</Icon>
        <Column>
          <H2>{action}</H2>
          <P>{subtitle}</P>
        </Column>
      </Row>
      {children && <ChildrenRow>{children}</ChildrenRow>}
    </Container>
  );
};
