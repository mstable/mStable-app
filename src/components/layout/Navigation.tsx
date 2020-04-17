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
    margin: 0 ${props => props.theme.spacing.l};
  }
`;

const Item = styled.li<{
  disabled?: boolean;
  active: boolean;
  inverted: boolean;
}>`
  border-bottom: 4px solid transparent;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${props => props.theme.spacing.xxs} 0;
  border-bottom-color: ${({ theme, active, inverted }) =>
    active
      ? inverted
        ? theme.color.background
        : theme.color.foreground
      : 'transparent'};

  ${props => (props.disabled ? `opacity: 0.4; cursor: disabled` : '')};

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.background : theme.color.foreground};
  }

  margin-right: ${props => props.theme.spacing.m};
  &:last-child {
    margin-right: 0;
  }

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.l};
  }
`;

const navItems: NavItem[] = [
  { title: 'Swap', path: '/swap' },
  { title: 'Save', path: '/save' },
  { title: 'Earn', disabled: true, path: '/earn' },
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
