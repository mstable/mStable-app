import React, { FC } from 'react'
import styled from 'styled-components'

import { ReactComponent as ChevronIcon } from '../icons/chevron-down.svg'

const StyledChevron = styled(ChevronIcon)<{ direction?: 'up' | 'down' }>`
  height: 8px;
  width: auto;
  margin-left: 0.5rem;
  transform: ${({ direction }) => (direction === 'up' ? `rotate(180deg)` : `auto`)};
  transition: 0.1s ease-out transform;

  path {
    fill: ${({ theme }) => theme.color.body};
  }
`

export const Chevron: FC<{ direction?: 'up' | 'down' }> = ({ direction = 'down' }) => {
  return <StyledChevron direction={direction} />
}
