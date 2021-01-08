import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useCloseAccount } from '../../context/AppProvider';

interface NavItem {
  title: string;
  path?: string;
}

const List = styled.ul`
  display: flex;
`;

const Item = styled.li<{
  active: boolean;
}>`
  margin: 0 0.5rem;
  position: relative;
  font-weight: 600;
  font-size: 1.4rem;
  padding: 3rem 0;

  a,
  span {
    white-space: nowrap;
    color: ${({ theme, active }) =>
      active ? theme.color.blue : theme.color.black};
  }

  span {
    cursor: not-allowed;
  }

  &:hover > div {
    visibility: visible;
  }
`;

const navItems: NavItem[] = [
  { title: 'Mint', path: '/mint' },
  { title: 'Save', path: '/save' },
  { title: 'Earn', path: '/earn' },
  { title: 'Swap', path: '/swap' },
  { title: 'Redeem', path: '/redeem' },
];

export const Navigation: FC = () => {
  const collapseWallet = useCloseAccount();
  const { pathname } = useLocation();
  const items: (NavItem & { active: boolean })[] = useMemo(
    () =>
      navItems.map(item => ({
        ...item,
        active: !!(item?.path && pathname.startsWith(item.path)),
      })),
    [pathname],
  );

  return (
    <nav>
      <List>
        {items.map(({ title, path, active }) => (
          <Item key={title} active={active} onClick={collapseWallet}>
            {path ? <Link to={path}>{title}</Link> : <span>{title}</span>}
          </Item>
        ))}
      </List>
    </nav>
  );
};
