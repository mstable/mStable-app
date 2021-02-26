import React, { FC } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { useSelectedMassetName } from '../../context/SelectedMassetNameProvider';
import { useCloseAccount, useThemeMode } from '../../context/AppProvider';
import { colorTheme, ViewportWidth } from '../../theme';
import { NavigationDropdown, NavItem } from '../core/NavigationDropdown';

const List = styled.div`
  display: flex;

  > div:first-child {
    display: inline-block;
  }
  a {
    display: none;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div:first-child {
      display: none;
    }
    > a {
      display: inline-block;
    }
  }
`;

const navItems: NavItem[] = [
  { title: 'Mint', path: '/mint' },
  { title: 'Save', path: '/save' },
  { title: 'Earn', path: '/earn' },
  { title: 'Pools', path: '/pools' },
  { title: 'Swap', path: '/swap' },
  { title: 'Redeem', path: '/redeem' },
];

const StyledNavLink = styled(NavLink)`
  margin: 0 0.5rem;
  position: relative;
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.body};
  white-space: nowrap;
`;

export const Navigation: FC = () => {
  const collapseWallet = useCloseAccount();
  const massetName = useSelectedMassetName();
  const themeMode = useThemeMode();

  return (
    <nav>
      <List>
        <NavigationDropdown massetName={massetName} items={navItems} />
        {navItems.map(({ title, path }) => (
          <StyledNavLink
            activeStyle={{ color: colorTheme(themeMode).primary }}
            key={title}
            onClick={collapseWallet}
            to={`/${massetName}${path}`}
          >
            {title}
          </StyledNavLink>
        ))}
      </List>
    </nav>
  );
};
