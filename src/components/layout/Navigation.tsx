import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { FontSize, ViewportWidth } from '../../theme';

interface NavItem {
  disabled?: boolean;
  title: string;
  path: string;
}

const Container = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  order: 3;
  width: 100%;

  @media (min-width: ${ViewportWidth.m}) {
    width: auto;
    order: 2;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (min-width: ${ViewportWidth.s}) {
    width: auto;
    margin: 0 ${props => props.theme.spacing.l};
  }
`;

const Item = styled.li<{ disabled?: boolean; active: boolean }>`
  border-bottom: 4px solid transparent;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${props => props.theme.spacing.xxs} 0;

  ${props =>
    props.active ? `border-bottom-color: ${props.theme.color.foreground}` : ''}

  ${props => (props.disabled ? `opacity: 0.4; cursor: disabled` : '')};

  a {
    color: ${props => props.theme.color.foreground};
  }

  margin-right: ${props => props.theme.spacing.xl};
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
export const Navigation: FC<{}> = () => {
  const activePath = getWorkingPath('');
  const items: (NavItem & { active: boolean })[] = useMemo(
    () =>
      navItems.map(item => ({
        ...item,
        active: activePath === item.path,
      })),
    [activePath],
  );
  return (
    <Container>
      <List>
        {items.map(({ title, path, disabled, active }) => (
          <Item key={path} disabled={disabled} active={active}>
            {disabled ? <span>{title}</span> : <A href={path}>{title}</A>}
          </Item>
        ))}
      </List>
    </Container>
  );
};
