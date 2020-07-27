import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import GitHubButton from 'react-github-btn';

import { useCloseOverlay } from '../../context/AppProvider';
import { DAPP_VERSION } from '../../web3/constants';
import { ViewportWidth } from '../../theme';
import Medium from '../icons/social/medium.svg';
import Github from '../icons/social/github.svg';
import Discord from '../icons/social/discord.svg';
import Twitter from '../icons/social/twitter.svg';
import Email from '../icons/social/email.svg';
import { centredLayout } from './css';

interface Props {
  inverted: boolean;
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

const Gubbins = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

  > div > div {
    @media (min-width: ${ViewportWidth.m}) {
      display: flex;
      align-items: center;

      > * {
        margin-right: 16px;
      }
      > :last-child {
        margin-right: 0;
      }
    }
    &:first-child {
      justify-content: space-between;
    }
  }

  ${centredLayout}
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

export const Footer: FC<Props> = ({ inverted }) => {
  const collapseWallet = useCloseOverlay();
  return (
    <Container inverted={inverted}>
      <div>
        <div>
          <Links>
            {links.map(({ title, href }) => (
              <li key={href}>
                {href.startsWith('/') ? (
                  <A href={href} onClick={collapseWallet}>
                    {title}
                  </A>
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
        <Gubbins>
          <Version>
            Current version{' '}
            <a
              href={`https://github.com/mstable/mStable-app/releases/tag/v${DAPP_VERSION}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{DAPP_VERSION}</span>
            </a>
          </Version>
          <GitHubButton
            href="https://github.com/mstable/mStable-contracts"
            data-icon="octicon-star"
            data-show-count
            aria-label="Star mstable/mStable-contracts on GitHub"
          >
            mStable-contracts
          </GitHubButton>
        </Gubbins>
      </div>
    </Container>
  );
};
