import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { LocalStorage } from '../../../../localStorage';
import { Card } from './Card';

type OnboardingType = 'user' | 'active';

interface Props {
  className?: string;
  type: OnboardingType;
}

const Title: Record<OnboardingType, string> = {
  user: 'Liquidity Rewards',
  active: 'Ecosystem Rewards',
};

const Content: Record<OnboardingType, string> = {
  user:
    'Liquidity providers earn fees on trades proportional to their share of the pool’s liquidity.',
  active: 'Providing liquidity and staking your token will give you MTA ... ',
};

const Container = styled(Card)`
  background: ${({ theme }) => theme.color.accent};
  border: none;
`;

export const OnboardingCard: FC<Props> = ({ className, type }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  if (!(type === 'user' || type === 'active')) return null;

  const title = Title[type];
  const content = Content[type];

  const viewedPoolOnboarding = LocalStorage.get('viewedPoolOnboarding');
  const viewedUser = viewedPoolOnboarding?.user;
  const viewedActive = viewedPoolOnboarding?.active;

  const shouldShow =
    !(viewedUser && type === 'user') && !(viewedActive && type === 'active');

  const handleClick = (): void => {
    switch (type) {
      case 'user':
        LocalStorage.set('viewedPoolOnboarding', {
          user: true,
          active: viewedActive ?? false,
        });
        break;
      case 'active':
        LocalStorage.set('viewedPoolOnboarding', {
          user: viewedUser ?? false,
          active: true,
        });
        break;
      default:
        break;
    }
    setClicked(true);
  };

  return type && shouldShow && !clicked ? (
    <Container
      className={className}
      title={title}
      iconType="checkmark"
      onClick={handleClick}
    >
      <p>{content}</p>
    </Container>
  ) : null;
};
