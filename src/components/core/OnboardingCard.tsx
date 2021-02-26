import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { LocalStorage } from '../../localStorage';
import { ReactComponent as CheckmarkIcon } from '../icons/checkmark.svg';
import { UnstyledButton } from './Button';

export enum OnboardType {
  Rewards,
  Ecosystem,
}

const { Rewards, Ecosystem } = OnboardType;

interface Props {
  className?: string;
  type: OnboardType;
}

const Checkmark = styled.div`
  background: ${({ theme }) => theme.color.accentContrast};
  border-radius: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s ease all;

  svg {
    width: 1.875rem;
    height: 1.875rem;

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`;

const Container = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.accent};
  border: 1px solid ${({ theme }) => theme.color.accentContrast};
  padding: 1rem;
  border-radius: 1rem;
  justify-content: flex-start;
  transition: 0.25s ease all;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: left;
  }

  p {
    margin-top: 1.25rem;
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.color.body};
  }

  :hover {
    opacity: 0.75;

    > div > div {
      background: ${({ theme }) => theme.color.gold};
      path {
        fill: ${({ theme }) => theme.color.white};
      }
    }
  }
`;

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
    <Container className={className} onClick={handleClick}>
      <div>
        <h2>{title}</h2>
        <Checkmark>
          <CheckmarkIcon />
        </Checkmark>
      </div>
      <p>{content}</p>
    </Container>
  ) : null;
};
