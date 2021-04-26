import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useBannerMessage } from '../../context/AppProvider'

const Container = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
  border-radius: 1rem;
  align-items: center;
  padding: 1rem 1.5rem;
  line-height: 1.5rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};

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
`

export const BannerMessage: FC = () => {
  const [bannerMessage] = useBannerMessage()

  return bannerMessage?.title ? (
    <Container>
      <span role="img" aria-label="emoji">
        {bannerMessage.emoji}
      </span>
      <div>
        <b>{`${bannerMessage.title} `}</b>
        {bannerMessage.subtitle && bannerMessage.subtitle}
        {bannerMessage.url &&
          (bannerMessage.url.startsWith('http') ? (
            <a href={bannerMessage.url} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          ) : (
            <Link to={bannerMessage.url}>Learn more</Link>
          ))}
      </div>
    </Container>
  ) : null
}
