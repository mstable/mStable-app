import React, { FC, useLayoutEffect } from 'react';
import ReactTooltipBase from 'react-tooltip';
import styled from 'styled-components';

import TooltipIcon from './tooltip-icon.svg';
import { Color, FontSize } from '../../theme';

export const ReactTooltip = styled(ReactTooltipBase)`
  background: ${Color.blackTransparent};
  color: ${Color.white};
  padding: 4px 8px;
  font-size: ${FontSize.s};
  font-weight: bold;
  max-width: 200px;
`;

const TooltipImg = styled.img`
  margin-left: 4px;
  width: 14px;
  height: auto;
`;

const TooltipSpan = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const Tooltip: FC<{
  className?: string;
  tip?: string;
  hideIcon?: boolean;
}> = ({ tip, hideIcon, children, className }) => {
  useLayoutEffect(() => {
    ReactTooltipBase.rebuild();
  }, []);
  return (
    <TooltipSpan data-tip={tip} data-for="global" className={className}>
      <span>{children}</span>
      {hideIcon || !tip ? null : <TooltipImg src={TooltipIcon} alt="" />}
    </TooltipSpan>
  );
};
