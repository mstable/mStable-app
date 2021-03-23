import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import GitHubButton from 'react-github-btn';
import { isAddress } from 'web3-utils';

import { useCloseAccount } from '../../context/AppProvider';
import { useIsMasquerading, useMasquerade } from '../../context/UserProvider';
import { DAPP_VERSION } from '../../constants';
import { ViewportWidth } from '../../theme';
import Medium from '../icons/social/medium.svg';
import Github from '../icons/social/github.svg';
import Discord from '../icons/social/discord.svg';
import Twitter from '../icons/social/twitter.svg';
import Email from '../icons/social/email.svg';

const Links = styled.ul`
  align-items: center;
  padding-bottom: 16px;

  li {
    display: inline-block;
    margin-right: 0.75rem;
    margin-bottom: 0.75rem;
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
    opacity: 0.8;
  }
`;

const Version = styled.div`
  font-size: 0.6rem;

  span {
    font-weight: bold;
  }
`;

const Gubbins = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MasqueradeContainer = styled.div<{ isMasquerading: boolean }>`
  width: 3px;
  height: 3px;
  user-select: none;
  cursor: crosshair;
  background: ${({ isMasquerading }) =>
    isMasquerading ? 'pink' : 'transparent'};
`;

const Masquerade: FC<{}> = () => {
  const masquerade = useMasquerade();
  const isMasquerading = useIsMasquerading();

  const handleClick = useCallback(() => {
    if (isMasquerading) {
      masquerade();
    } else {
      // eslint-disable-next-line no-alert
      const inputAddress = window.prompt('View as account (read only)');

      masquerade(
        inputAddress && isAddress(inputAddress)
          ? inputAddress.toLowerCase()
          : undefined,
      );
    }
  }, [isMasquerading, masquerade]);

  return (
    <MasqueradeContainer
      isMasquerading={isMasquerading}
      onClick={handleClick}
    />
  );
};

const Inner = styled.div`
  padding: 1rem;

  > div {
    width: 100%;
  }

  > div > div {
    @media (min-width: ${ViewportWidth.m}) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

const Container = styled.div`
  display: grid;
  overflow-x: hidden;
  grid-template-columns:
    1fr
    min(1000px, 100%)
    1fr;

  > * {
    grid-column: 2;
  }
`;

const links = [
  { title: 'mStable', href: 'https://mstable.org' },
  { title: 'Docs', href: 'https://docs.mstable.org' },
  { title: 'Code', href: 'https://github.com/mstable' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Governance', href: 'https://governance.mstable.org' },
];

const socialIcons = [
  { title: 'Github', icon: Github, href: 'https://github.com/mstable' },
  { title: 'Discord', icon: Discord, href: 'https://discord.gg/pgCVG7e' },
  { title: 'Twitter', icon: Twitter, href: 'https://twitter.com/mstable_' },
  { title: 'Medium', icon: Medium, href: 'https://medium.com/mstable' },
  { title: 'Email', icon: Email, href: 'mailto:info@mstable.org' },
];

export const Footer: FC = () => {
  const collapseWallet = useCloseAccount();
  return (
    <Container>
      <Inner>
        <div>
          <div>
            <Links>
              {links.map(({ title, href }) => (
                <li key={href}>
                  {href.startsWith('/') ? (
                    <Link to={href} onClick={collapseWallet}>
                      {title}
                    </Link>
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
            <div>
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
              <Masquerade />
            </div>
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
      </Inner>
    </Container>
  );
};
