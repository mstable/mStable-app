import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { useSelectedMassetName } from '../../context/MassetProvider'
import { useThemeMode } from '../../context/AppProvider'
import { colorTheme, ViewportWidth } from '../../theme'
import { NavigationDropdown, NavItem } from '../core/NavigationDropdown'
import { useSelectedMassetState } from '../../context/DataProvider/DataProvider'

const List = styled.div`
  display: flex;

  > div:first-child {
    display: inline-block;
  }
  a {
    display: none;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div:first-child {
      display: none;
    }
    > a {
      display: inline-block;
    }
  }
`

const StyledNavLink = styled(NavLink)`
  margin: 0 0.5rem;
  position: relative;
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.body};
  white-space: nowrap;
`

export const Navigation: FC = () => {
  const massetName = useSelectedMassetName()
  const themeMode = useThemeMode()
  const massetState = useSelectedMassetState()
  const hasFeederPools = massetState?.hasFeederPools

  const navItems = useMemo<NavItem[]>(() => {
    return [
      { title: 'Save', path: '/save' },
      ...(hasFeederPools ? [{ title: 'Pools', path: '/pools' }] : []),
      { title: 'Forge', path: '/forge/mint' },
      { title: 'Stats', path: '/stats' },
    ]
  }, [hasFeederPools])

  return (
    <nav>
      <List>
        <NavigationDropdown massetName={massetName} items={navItems} />
        {navItems.map(({ title, path }) => (
          <StyledNavLink activeStyle={{ color: colorTheme(themeMode).primary }} key={title} to={`/${massetName}${path}`}>
            {title}
          </StyledNavLink>
        ))}
      </List>
    </nav>
  )
}
