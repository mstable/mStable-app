import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import { DAPP_VERSION } from '../../web3/constants';

interface Props {
  inverted: boolean;
  home: boolean;
}

const Links = styled.ul`
  display: flex;
  align-items: center;

  li {
    margin-right: ${({ theme }) => theme.spacing.s};
  }
`;

const Version = styled.div`
  font-size: 10px;
  span {
    font-weight: bold;
  }
`;

const Container = styled.footer<Props>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.l}`};
  display: flex;
  justify-content: space-between;

  border-top: ${({ theme, inverted }) =>
    `1px 
      ${inverted ? theme.color.whiteTransparent : theme.color.blackTransparent}
      solid`};

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.offWhite : theme.color.offBlack};
  }
`;

const links = [
  { title: 'mStable', href: 'https://mstable.org' },
  { title: 'Docs', href: 'https://docs.mstable.org' },
  { title: 'Code', href: 'https://github.com/mstable' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Analytics', href: '/analytics' },
];

export const Footer: FC<Props> = ({ inverted, home }) => (
  <Container inverted={inverted} home={home}>
    <Links>
      {links.map(({ title, href }) => (
        <li key={href}>
          {href.startsWith('/') ? (
            <A href={href}>{title}</A>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          )}
        </li>
      ))}
    </Links>
    <Version>
      Current version <span>{DAPP_VERSION}</span>
    </Version>
  </Container>
);
