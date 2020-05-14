import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.footer<{ inverted: boolean }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.l}`};

  ${({ theme }) => theme.mixins.borderTop}
`;

const Links = styled.ul<{ inverted: boolean }>`
  display: flex;
  align-items: center;

  li {
    margin-right: ${({ theme }) => theme.spacing.s};
  }
`;

const links = [
  { title: 'mStable', href: 'https://mstable.org' },
  { title: 'Docs', href: 'https://docs.mstable.org' },
  { title: 'Code', href: 'https://github.com/mstable' },
];

/**
 * Placeholder component for footer.
 */
export const Footer: FC<{ walletExpanded: boolean }> = ({ walletExpanded }) => (
  <Container inverted={walletExpanded}>
    <Links inverted={walletExpanded}>
      {links.map(({ title, href }) => (
        <li key={href}>
          <a href={href}>{title}</a>
        </li>
      ))}
    </Links>
  </Container>
);
