import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as SaveIcon } from '../icons/circle/save.svg';
import { ReactComponent as MintIcon } from '../icons/circle/mint.svg';
import { ReactComponent as EarnIcon } from '../icons/circle/earn.svg';
import { ReactComponent as SwapIcon } from '../icons/circle/swap.svg';
import { ReactComponent as RedeemIcon } from '../icons/circle/redeem.svg';
import { ReactComponent as AnalyticsIcon } from '../icons/circle/analytics.svg';
import { ReactComponent as AccountIcon } from '../icons/circle/account.svg';
import { useAccountOpen, useBannerMessage } from '../../context/AppProvider';
import { BannerMessage } from '../layout/BannerMessage';

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
  subtitle?: string;
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
  display: flex;
  margin-right: 0.5rem;

  img,
  svg {
    width: 2.5rem;
    height: 2.5rem;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  img + div {
    display: none;
  }
`;

const Container = styled.div<{
  accountOpen?: boolean;
  messageVisible?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  border-bottom: ${({ theme, accountOpen, messageVisible }) =>
    messageVisible
      ? `none`
      : `1px solid ${accountOpen ? '#222' : theme.color.accent}`};
  margin-bottom: ${({ messageVisible }) => (messageVisible ? `0` : `2rem`)};

  h2 {
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    padding: 0;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-right: 1rem;
`;

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`;

export const PageHeader: FC<Props> = ({ children, action, subtitle }) => {
  const accountOpen = useAccountOpen();
  const { visible } = useBannerMessage() ?? {};
  const icon = ActionIcons[action];

  return (
    <div>
      <Container accountOpen={accountOpen} messageVisible={visible}>
        <Row>
          <Icon inverted>{icon}</Icon>
          <h2>{action}</h2>
        </Row>
        {subtitle && <p>{subtitle}</p>}
        {children && <ChildrenRow>{children}</ChildrenRow>}
      </Container>
      {visible && <BannerMessage />}
    </div>
  );
};
