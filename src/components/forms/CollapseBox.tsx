import React, { FC } from 'react';
import styled from 'styled-components';
import { useToggle } from 'react-use';

import { UnstyledButton } from '../core/Button';

const Content = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  transition: all 0.25s ease;
  ${({ collapsed }) => `
    max-height: ${collapsed ? 0 : 7}rem;
    padding-top: ${collapsed ? 0 : 1}rem;
    opacity: ${collapsed ? 0 : 1};
  `};
`;

const Container = styled.div`
  > div {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: 1px ${({ theme }) => theme.color.accent} solid;
    > :first-child {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      font-size: 1rem;
      font-weight: 600;
    }
  }
`;

export const CollapseBox: FC<{ title: string; className?: string }> = ({
  children,
  title,
  className,
}) => {
  const [collapsed, toggleCollapsed] = useToggle(true);
  return (
    <Container className={className}>
      <div>
        <UnstyledButton onClick={toggleCollapsed}>
          <div>{title}</div>
          <div>{collapsed ? '▼' : '▲'}</div>
        </UnstyledButton>
        <Content collapsed={collapsed}>{children}</Content>
      </div>
    </Container>
  );
};
