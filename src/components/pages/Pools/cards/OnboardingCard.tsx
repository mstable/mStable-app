import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { LocalStorage } from '../../../../localStorage';
import { Card } from './Card';

type OnboardingType = 'user' | 'active';

interface Props {
  className?: string;
  type: OnboardingType | string;
}

const Title: Record<OnboardingType, string> = {
  user: 'Liquidity Rewards',
  active: 'Ecosystem Rewards',
};

const Content: Record<OnboardingType, string> = {
  user:
    'Liquidity providers earn fees on trades proportional to their share of the pool’s liquidity.',
  active:
    'By providing liquidity and staking your LP token, you will earn MTA rewards in addition to trade fees.',
};

const Container = styled(Card)`
  background: ${({ theme }) => theme.color.accent};
  border: none;
`;

export const OnboardingCard: FC<Props> = ({ className, type }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  if (type !== 'user') return null;

  const title = Title[type];
  const content = Content[type];

  const viewedPoolOnboarding = LocalStorage.get('viewedPoolOnboarding');
  const viewedUser = viewedPoolOnboarding?.user;
  const viewedActive = viewedPoolOnboarding?.active;

  const shouldShow = !(viewedUser && type === 'user');

  const handleClick = (): void => {
    LocalStorage.set(
      'viewedPoolOnboarding',
      type === 'user'
        ? {
            user: true,
            active: viewedActive,
          }
        : {
            user: viewedUser,
            active: true,
          },
    );
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
