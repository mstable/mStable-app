import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useBannerMessage } from '../../context/AppProvider';

const Container = styled.div`
  display: flex;
  background: ${({ theme }) => theme.color.backgroundAccent};
  margin-bottom: 1rem;
  border-radius: 2rem;
  align-items: center;
  padding: 1rem 1.5rem;
  line-height: 1.5rem;

  a {
    border: none;
    color: ${({ theme }) => theme.color.primary};
    font-weight: 600;

    :hover,
    :active {
      color: ${({ theme }) => theme.color.gold};
    }
  }

  span[role='img'] {
    font-size: 1.5rem;
    vertical-align: middle;
    margin-right: 1rem;
  }
`;

export const BannerMessage: FC = () => {
  const bannerMessage = useBannerMessage();

  return bannerMessage?.visible ? (
    <Container>
      <span role="img" aria-label="emoji">
        {bannerMessage.emoji}
      </span>
      <p>
        <b>{bannerMessage.title}</b>
        {bannerMessage.subtitle && ` ${bannerMessage.subtitle} `}
        {bannerMessage.url &&
          (bannerMessage.url.startsWith('http') ? (
            <a href={bannerMessage.url}>Learn more</a>
          ) : (
            <Link to={bannerMessage.url}>Learn more</Link>
          ))}
      </p>
    </Container>
  ) : null;
};
