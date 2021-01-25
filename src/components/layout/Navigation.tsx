import React, { FC } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { useSelectedMassetName } from '../../context/SelectedMassetNameProvider';
import { useCloseAccount } from '../../context/AppProvider';
import { Color } from '../../theme';

interface NavItem {
  title: string;
  path: string;
  masset?: boolean;
}

const List = styled.div`
  display: flex;
`;

const navItems: NavItem[] = [
  { title: 'Mint', path: '/mint', masset: true },
  { title: 'Save', path: '/save', masset: true },
  { title: 'Earn', path: '/earn' },
  { title: 'Swap', path: '/swap', masset: true },
  { title: 'Redeem', path: '/redeem', masset: true },
];

const StyledNavLink = styled(NavLink)`
  margin: 0 0.5rem;
  position: relative;
  font-weight: 600;
  font-size: 1.4rem;
  padding: 3rem 0;
  color: ${({ theme }) => theme.color.body};
  white-space: nowrap;
`;

export const Navigation: FC = () => {
  const collapseWallet = useCloseAccount();
  const massetName = useSelectedMassetName();

  return (
    <nav>
      <List>
        {navItems.map(({ title, path, masset }) => (
          <StyledNavLink
            activeStyle={{ color: Color.blue }}
            key={title}
            onClick={collapseWallet}
            to={masset ? `/${massetName}${path}` : path}
          >
            {title}
          </StyledNavLink>
        ))}
      </List>
    </nav>
  );
};
