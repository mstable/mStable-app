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

export const Tooltip: FC<{ tip: string; hideIcon?: boolean }> = ({
  tip,
  hideIcon,
  children,
}) => {
  useLayoutEffect(() => {
    ReactTooltipBase.rebuild();
  }, []);
  return (
    <TooltipSpan data-tip={tip} data-for="global">
      <span>{children}</span>
      {hideIcon ? null : <img src={TooltipIcon} alt="" />}
    </TooltipSpan>
  );
};
