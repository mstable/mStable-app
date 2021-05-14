import React, { FC, useRef } from 'react'
import styled from 'styled-components'
import { useToggle } from 'react-use'
import useOnClickOutside from 'use-onclickoutside'

import { useThemeMode, useToggleThemeMode } from '../../context/AppProvider'
import { ReactComponent as SettingsSvg } from '../icons/settings.svg'
import { UnstyledButton } from '../core/Button'
import { LocalStorage } from '../../localStorage'
import { NetworkDropdown } from '../core/NetworkDropdown'

const Button = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.background[1]};
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  :hover {
    background: ${({ theme }) => theme.color.background[2]};
  }
`

const ThemeModeButton = styled(Button)`
  width: 4rem;
  padding: 1.25rem 0;
`

const List = styled.div`
  position: absolute;
  border-radius: 0.75rem;
  right: 0;
  top: 2rem;
  width: 20rem;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.5rem 0;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  min-width: 5.5rem;
  z-index: 2;

  > div:first-child {
    border-top: 1px solid ${({ theme }) => theme.color.defaultBorder};
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    padding: 0 1rem;
    background: ${({ theme }) => theme.color.background[0]};
    border-bottom: 1px solid ${({ theme }) => theme.color.defaultBorder};
  }
`

const Container = styled.div`
  position: relative;
`

export const SettingsButton: FC = () => {
  const [show, toggleShow] = useToggle(false)
  const container = useRef(null)
  const toggleThemeMode = useToggleThemeMode()
  const themeMode = useThemeMode()

  useOnClickOutside(container, () => toggleShow(false))

  const handleThemeToggle = (): void => {
    LocalStorage.set('themeMode', themeMode === 'light' ? 'dark' : 'light')
    toggleThemeMode()
  }

  return (
    <Container ref={container}>
      <Button onClick={toggleShow}>
        <SettingsSvg />
      </Button>
      <List hidden={!show}>
        <div>
          <p>Network</p>
          <NetworkDropdown />
        </div>
        <div>
          <p>Theme</p>
          <ThemeModeButton onClick={handleThemeToggle}>{themeMode === 'light' ? '☀️' : '🌙'}</ThemeModeButton>
        </div>
      </List>
    </Container>
  )
}
