import React, { FC, useLayoutEffect } from 'react'
import ReactTooltipBase from 'react-tooltip'
import styled from 'styled-components'

import { ReactComponent as TooltipIcon } from './tooltip-icon.svg'
import { FontSize } from '../../theme'

export const ReactTooltip = styled(ReactTooltipBase)`
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  font-size: ${FontSize.s} !important;
  font-weight: 600 !important;
  max-width: 200px;
`

const TooltipImg = styled(TooltipIcon)`
  margin-left: 4px;
  width: 14px;
  height: auto;

  path {
    fill: ${({ theme }) => theme.color.body};
  }
`

const TooltipSpan = styled.span`
  display: inline-flex;
  align-items: center;
`

export const Tooltip: FC<{
  className?: string
  tip?: string
  hideIcon?: boolean
}> = ({ tip, hideIcon, children, className }) => {
  useLayoutEffect(() => {
    ReactTooltipBase.rebuild()
    return () => {
      ReactTooltipBase.rebuild()
    }
  }, [])
  return (
    <TooltipSpan data-tip={tip} data-for="global" className={className}>
      <span>{children}</span>
      {hideIcon || !tip ? null : <TooltipImg />}
    </TooltipSpan>
  )
}
