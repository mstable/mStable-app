import React, { FC } from 'react';
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
`;

const TooltipSpan = styled.span`
  display: flex;
  align-items: center;
  > span {
    margin-right: 4px;
  }
  > img {
    width: 14px;
    height: auto;
  }
`;

export const Tooltip: FC<{ tip: string }> = ({ tip, children }) => {
  ReactTooltipBase.rebuild();
  return (
    <TooltipSpan>
      <span>{children}</span>
      <img src={TooltipIcon} data-tip={tip} data-for="global" alt="" />
    </TooltipSpan>
  );
};
