import React, { FC } from 'react';
import styled from 'styled-components';
import { Linkarooni } from '../core/Typography';

const Container = styled.footer`
  padding: ${props => props.theme.spacing.s} ${props => props.theme.spacing.l};
`;

const Links = styled.ul<{ inverted: boolean }>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  li {
    margin-right: ${({ theme }) => theme.spacing.s};
  }

  a {
    color: ${({ inverted, theme }) =>
      inverted ? theme.color.white : theme.color.black};
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
  <Container>
    <Links inverted={walletExpanded}>
      {links.map(({ title, href }) => (
        <li key={href}>
          <Linkarooni href={href}>{title}</Linkarooni>
        </li>
      ))}
    </Links>
  </Container>
);
