import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { useCloseOverlay } from '../../context/AppProvider';
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
    width: auto;
  }
`;

const Item = styled.li<{
  active: boolean;
}>`
  margin: 0 8px;
  position: relative;
  border-bottom: 4px solid transparent;
  font-weight: bold;
  text-transform: uppercase;
  padding: 2px 0;
  border-bottom-color: ${({ theme, active }) =>
    active ? theme.color.offBlack : 'transparent'};

  a,
  span {
    white-space: nowrap;
    color: ${({ theme }) => theme.color.offBlack};
    border-bottom: none;
  }

  span {
    cursor: not-allowed;
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
  { title: 'Earn', path: '/earn' },
  { title: 'Swap', path: '/swap' },
  { title: 'Redeem', path: '/redeem' },
];

/**
 * Placeholder component for app navigation.
 */
export const Navigation: FC<{}> = () => {
  const collapseWallet = useCloseOverlay();
  const activePath = getWorkingPath('');
  const items: (NavItem & { active: boolean })[] = useMemo(
    () =>
      navItems.map(item => ({
        ...item,
        active: !!(item?.path && activePath.startsWith(item.path)),
      })),
    [activePath],
  );

  return (
    <Container>
      <List>
        {items.map(({ title, path, active }) => (
          <Item key={title} active={active} onClick={collapseWallet}>
            {path ? <A href={path}>{title}</A> : <span>{title}</span>}
          </Item>
        ))}
      </List>
    </Container>
  );
};
