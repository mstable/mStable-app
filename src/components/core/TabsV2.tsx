import React, { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { UnstyledButton } from './Button'
import { Color, ViewportWidth } from '../../theme'

export const TabsContainer = styled.div`
  /* display: flex; */
  justify-content: flex-start;
  margin: 0 0 1.25rem;
  box-shadow: ${({ theme }) => `0 2px 0 ${theme.color.defaultBorder}`};
`

export const TabBtn = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  box-shadow: ${({ active, theme }) => active && `0 2px 0 ${theme.color.primary}`};
  color: ${({ active, theme }) => (active ? theme.color.primary : Color.grey)};
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  transition: border-bottom-color 0.2s ease;
  text-align: left;

  &:hover {
    box-shadow: ${({ active, theme }) => (active ? `0 2px 0 ${theme.color.primary}` : `0 2px 0 ${theme.color.primaryTransparent}`)};
  }

  @media (min-width: ${ViewportWidth.s}) {
    font-size: 1.25rem;
  }
`

export const TabsV2: FC<{
  tabs: Record<string, { title: string; component?: ReactElement }>
  active: string
  onClick: (key: string) => void
  className?: string
}> = ({ tabs, children, active, onClick, className }) => {
  return (
    <div className={className}>
      <TabsContainer>
        {Object.keys(tabs)
          .filter(key => !!tabs[key].component)
          .map(_key => (
            <TabBtn
              key={_key}
              active={active === _key}
              onClick={() => {
                onClick(_key)
              }}
            >
              {tabs[_key].title}
            </TabBtn>
          ))}
      </TabsContainer>
      <div>
        {children && children}
        {active && tabs[active]?.component}
      </div>
    </div>
  )
}
