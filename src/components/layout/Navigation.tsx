import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { FontSize, ViewportWidth } from '../../theme';

interface NavItem {
  disabled?: boolean;
  title: string;
  alt?: string;
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
  margin-right: ${props => props.theme.spacing.m};
  position: relative;
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

  a,
  span {
    white-space: nowrap;
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.background : theme.color.foreground};
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  }

  span {
    cursor: not-allowed;
  }

  > div {
    position: absolute;
    top: 30px;
    opacity: 0.2;
    font-size: ${FontSize.s};
    visibility: hidden;
    width: 100%;
    text-align: center;
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
  { title: 'Swap It', path: '/swap', alt: 'Harder' },
  { title: 'Save It', path: '/save', alt: 'Better' },
  { title: 'Move It', path: '/move', alt: 'Faster', disabled: true },
  { title: 'Earn It', path: '/earn', alt: 'Stronger', disabled: true },
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
        {items.map(({ title, alt, path, disabled, active }) => (
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
            {alt ? <div>{alt}</div> : null}
          </Item>
        ))}
      </List>
    </Container>
  );
};
