import React, { AnchorHTMLAttributes, FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as ExternalLinkArrow } from './external-link-arrow.svg';

const Anchor = styled.a`
  border-bottom: 0;
  svg {
    margin-left: 4px;
    width: 14px;
    height: auto;
  }
`;

export const ExternalLink: FC<AnchorHTMLAttributes<never>> = ({
  children,
  className,
  href,
}) => (
  <Anchor
    className={className}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>{children}</span>
    <ExternalLinkArrow />
  </Anchor>
);
