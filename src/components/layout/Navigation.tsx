import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { FontSize, ViewportWidth } from '../../theme';

interface NavItem {
  disabled?: boolean;
  title: string;
  path?: string;
}

const Container = styled.nav`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;

  @media (min-width: ${ViewportWidth.m}) {
    width: auto;
  }
`;

const Item = styled.li<{
  disabled?: boolean;
  active: boolean;
  inverted: boolean;
}>`
  margin-right: ${({ theme }) => theme.spacing.m};
  position: relative;
  border-bottom: 4px solid transparent;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spacing.xxs} 0;
  border-bottom-color: ${({ theme, active, inverted }) =>
    active
      ? inverted
        ? theme.color.white
        : theme.color.black
      : 'transparent'};

  a,
  span {
    white-space: nowrap;
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.white : theme.color.black};
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  }

  span {
    cursor: not-allowed;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover > div {
    visibility: visible;
  }

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.l};
  }
`;

const navItems: NavItem[] = [
  { title: 'Swap', path: '/swap' },
  { title: 'Save', path: '/save' },
  // { title: 'Move', path: '/move', disabled: true },
  // { title: 'Earn', path: '/earn', disabled: true },
];

/**
 * Placeholder component for app navigation.
 */
export const Navigation: FC<{ walletExpanded: boolean }> = ({
  walletExpanded,
}) => {
  const activePath = getWorkingPath('');
  const items: (NavItem & { active: boolean })[] = useMemo(
    () =>
      walletExpanded
        ? [{ title: 'Account', active: true }]
        : navItems.map(item => ({
            ...item,
            active: activePath === item.path,
          })),
    [activePath, walletExpanded],
  );
  return (
    <Container>
      <List>
        {items.map(({ title, path, disabled, active }) => (
          <Item
            key={title}
            disabled={disabled}
            active={active}
            inverted={walletExpanded}
          >
            {disabled || !path ? (
              <span>{title}</span>
            ) : (
              <A href={path}>{title}</A>
            )}
          </Item>
        ))}
      </List>
    </Container>
  );
};
