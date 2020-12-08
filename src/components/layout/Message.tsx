import React, { FC } from 'react';
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

  return messageVisible ? (
    <Container>
      <span role="img" aria-label="emoji">
        {message?.emoji}
      </span>
      <p>
        <b>{message?.title}</b>
        {` ${message?.subtitle} `}
        {message?.url && <a href={message.url}>Learn more</a>}
      </p>
    </Container>
  ) : null;
};
