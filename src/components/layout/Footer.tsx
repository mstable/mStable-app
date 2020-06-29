import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';

import { DAPP_VERSION } from '../../web3/constants';
import { ViewportWidth } from '../../theme';
import Medium from '../icons/medium.svg';
import Github from '../icons/github.svg';
import Discord from '../icons/discord.svg';
import Twitter from '../icons/twitter.svg';
import Email from '../icons/email.svg';

interface Props {
  inverted: boolean;
  home: boolean;
}

const Links = styled.ul`
  display: flex;
  align-items: center;
  padding-bottom: 16px;

  li {
    margin-right: ${({ theme }) => theme.spacing.s};
  }
`;

const SocialIcons = styled(Links)`
  a {
    border-bottom: 0;
  }

  img {
    display: block;
    width: 24px;
    height: auto;
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

  border-top: ${({ theme, inverted }) =>
    `1px 
      ${inverted ? theme.color.whiteTransparent : theme.color.blackTransparent}
      solid`};

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.offWhite : theme.color.offBlack};
  }

  > :first-child {
    @media (min-width: ${ViewportWidth.m}) {
      display: flex;
      justify-content: space-between;
    }
  }
`;

const links = [
  { title: 'mStable', href: 'https://mstable.org' },
  { title: 'Docs', href: 'https://docs.mstable.org' },
  { title: 'Code', href: 'https://github.com/mstable' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Analytics', href: '/analytics' },
];

const socialIcons = [
  { title: 'Github', icon: Github, href: 'https://github.com/mstable' },
  { title: 'Discord', icon: Discord, href: 'https://discord.gg/pgCVG7e' },
  { title: 'Twitter', icon: Twitter, href: 'https://twitter.com/mstable_' },
  { title: 'Medium', icon: Medium, href: 'https://medium.com/mstable' },
  { title: 'Email', icon: Email, href: 'mailto:info@mstable.org' },
];

export const Footer: FC<Props> = ({ inverted, home }) => (
  <Container inverted={inverted} home={home}>
    <div>
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
      <SocialIcons>
        {socialIcons.map(({ title, href, icon }) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <img src={icon} alt={title} />
            </a>
          </li>
        ))}
      </SocialIcons>
    </div>
    <Version>
      Current version <span>{DAPP_VERSION}</span>
    </Version>
  </Container>
);
