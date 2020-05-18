import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  inverted: boolean;
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
`;

const links = [
  { title: 'mStable', href: 'https://mstable.org' },
  { title: 'Docs', href: 'https://docs.mstable.org' },
  { title: 'Code', href: 'https://github.com/mstable' },
];

export const Footer: FC<Props> = ({ inverted }) => (
  <Container inverted={inverted}>
    <Links>
      {links.map(({ title, href }) => (
        <li key={href}>
          <a href={href}>{title}</a>
        </li>
      ))}
    </Links>
  </Container>
);
