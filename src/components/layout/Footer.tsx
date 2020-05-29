import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';

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

const Container = styled.footer<Props>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.l}`};

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
  </Container>
);
