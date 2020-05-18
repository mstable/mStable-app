import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { FontSize, ViewportWidth } from '../../theme';

interface NavItem {
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
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (min-width: ${ViewportWidth.m}) {
    justify-content: space-evenly;
    width: auto;
  }
`;

const Item = styled.li<{
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
  { title: 'Mint', path: '/mint' },
  { title: 'Save', path: '/save' },
  { title: 'Swap', path: '/swap' },
  { title: 'Redeem', path: '/redeem' },
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
        {items.map(({ title, path, active }) => (
          <Item key={title} active={active} inverted={walletExpanded}>
            {path ? <A href={path}>{title}</A> : <span>{title}</span>}
          </Item>
        ))}
      </List>
    </Container>
  );
};
