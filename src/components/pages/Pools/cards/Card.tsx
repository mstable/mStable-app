import React, { FC, ReactElement } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as CheckmarkIcon } from '../../../icons/checkmark.svg';
import { ReactComponent as ChevronIcon } from '../../../icons/chevron-down.svg';
import { UnstyledButton } from '../../../core/Button';

interface Props {
  className?: string;
  title?: ReactElement | string;
  iconType?: 'checkmark' | 'chevron';
  onClick?: () => void;
}

const Icon = styled.div<{ isChevron?: boolean }>`
  background: ${({ theme }) => `${theme.color.accentContrast}77`};
  border-radius: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s ease all;
  margin-left: 1rem;

  svg {
    width: 1rem;
    height: 1rem;
    transform: ${({ isChevron }) => (isChevron ? `rotate(-90deg)` : `auto`)};

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`;

const ContainerStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.accent};
  padding: 1rem;
  border-radius: 1rem;
  justify-content: flex-start;
  transition: 0.25s ease all;

  > div {
    display: flex;
    justify-content: space-between;
  }

  > div:not(:last-child) {
    align-items: center;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.color.body};
  }
`;

const ContainerButton = styled(UnstyledButton)`
  ${ContainerStyle};

  :hover {
    opacity: 0.75;

    .icon {
      background: ${({ theme }) => theme.color.gold};
      path {
        fill: ${({ theme }) => theme.color.white};
      }
    }
  }
`;

const Container = styled.div`
  ${ContainerStyle};
`;

const CardContent: FC<Props> = props => {
  const { title, children, iconType } = props;
  return (
    <>
      {(title || iconType) && (
        <div>
          <h2>{title}</h2>
          {iconType && (
            <Icon className="icon" isChevron={iconType === 'chevron'}>
              {iconType === 'checkmark' ? <CheckmarkIcon /> : <ChevronIcon />}
            </Icon>
          )}
        </div>
      )}
      {children && <div>{children}</div>}
    </>
  );
};

export const Card: FC<Props> = props => {
  const { className, onClick, children, title, iconType } = props;
  return onClick ? (
    <ContainerButton className={className} onClick={onClick}>
      <CardContent title={title} iconType={iconType}>
        {children}
      </CardContent>
    </ContainerButton>
  ) : (
    <Container className={className}>
      <CardContent title={title} iconType={iconType}>
        {children}
      </CardContent>
    </Container>
  );
};