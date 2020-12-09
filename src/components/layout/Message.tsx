import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppState } from '../../context/AppProvider';

const Container = styled.div`
  display: flex;
  background: rgba(248, 248, 248, 1);
  margin-bottom: 1rem;
  border-radius: 2rem;
  align-items: center;
  padding: 1rem 1.5rem;
  line-height: 1.5rem;

  a {
    border: none;
    color: ${({ theme }) => theme.color.blue};
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

export const Message: FC = () => {
  const { messageVisible, message } = useAppState();
  const url = message?.externalUrl ?? message?.internalUrl;

  return messageVisible ? (
    <Container>
      <span role="img" aria-label="emoji">
        {message?.emoji}
      </span>
      <p>
        <b>{message?.title}</b>
        {` ${message?.subtitle} `}
        {url &&
          (message?.externalUrl ? (
            <a href={url}>Learn more</a>
          ) : (
            <Link to={url}>Learn more</Link>
          ))}
      </p>
    </Container>
  ) : null;
};
