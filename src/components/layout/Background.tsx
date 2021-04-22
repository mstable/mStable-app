import React, { FC } from 'react'
import styled from 'styled-components'

interface Props {
  home: boolean
  accountOpen: boolean
}

const Container = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: -1;
  transition: background-color 0.3s ease;
  background-color: ${({ theme, accountOpen }) => (accountOpen ? theme.color.black : theme.color.background)};
`

export const Background: FC<Props> = ({ home, accountOpen }) => <Container home={home} accountOpen={accountOpen} />
