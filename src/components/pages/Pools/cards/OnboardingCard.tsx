import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { LocalStorage } from '../../../../localStorage';
import { Card } from './Card';

export enum OnboardType {
  Rewards,
  Ecosystem,
}

const { Rewards, Ecosystem } = OnboardType;

interface Props {
  className?: string;
  type: OnboardType;
}

const Title: Record<OnboardType, string> = {
  [Rewards]: 'Liquidity Rewards',
  [Ecosystem]: 'Ecosystem Rewards',
};

const Content: Record<OnboardType, string> = {
  [Rewards]:
    'Liquidity providers earn fees on trades proportional to their share of the pool’s liquidity.',
  [Ecosystem]:
    'Providing liquidity and staking your token will give you MTA ... ',
};

const Container = styled(Card)`
  background: ${({ theme }) => theme.color.accent};
  border: 1px solid ${({ theme }) => theme.color.accentContrast};
`;

export const OnboardingCard: FC<Props> = ({ className, type }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  const title = Title[type];
  const content = Content[type];

  const viewedPoolOnboarding = LocalStorage.get('viewedPoolOnboarding');
  const viewedRewards = viewedPoolOnboarding?.rewards;
  const viewedEcosystem = viewedPoolOnboarding?.ecosystem;

  const shouldShow =
    !(viewedRewards && type === Rewards) &&
    !(viewedEcosystem && type === Ecosystem);

  const handleClick = (): void => {
    switch (type) {
      case Rewards:
        LocalStorage.set('viewedPoolOnboarding', {
          rewards: true,
          ecosystem: viewedEcosystem ?? false,
        });
        break;
      case Ecosystem:
        LocalStorage.set('viewedPoolOnboarding', {
          rewards: viewedRewards ?? false,
          ecosystem: true,
        });
        break;
      default:
        break;
    }
    setClicked(true);
  };

  return shouldShow && !clicked ? (
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
