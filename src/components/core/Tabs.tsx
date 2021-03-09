import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Color, ViewportWidth } from '../../theme';
import { InfoMessage } from './InfoMessage';

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
`;

export const TabBtn = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  border-bottom: 2px
    ${({ active, theme }) =>
      active ? theme.color.primary : theme.color.accent}
    solid;
  background: transparent;
  color: ${({ active, theme }) => (active ? theme.color.primary : Color.grey)};
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  width: 100%;
  transition: border-bottom-color 0.2s ease;

  &:hover {
    border-bottom-color: ${({ active, theme }) =>
      active ? theme.color.primary : theme.color.primaryTransparent};
  }

  @media (min-width: ${ViewportWidth.s}) {
    font-size: 1rem;
  }
`;

export const TabSwitch: FC<{
  tabs: Record<string, { title: string; component?: ReactElement }>;
  active: string;
  onClick: (key: string) => void;
}> = ({ tabs, children, active, onClick }) => {
  return (
    <>
      <TabsContainer>
        {Object.keys(tabs)
          .filter(key => !!tabs[key].component)
          .map(_key => (
            <TabBtn
              key={_key}
              active={active === _key}
              onClick={() => {
                onClick(_key);
              }}
            >
              {tabs[_key].title}
            </TabBtn>
          ))}
      </TabsContainer>
      {children && children}
      {active && tabs[active]?.component}
    </>
  );
};

export const MoreInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  text-align: center;
  align-self: center;
`;

export const Message = styled(InfoMessage)`
  margin: 2rem 2rem 0 2rem;
`;
