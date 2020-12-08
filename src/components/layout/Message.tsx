import React, { FC } from 'react';
import styled from 'styled-components';
import { useMessageState } from '../../context/MessageProvider';

const Container = styled.div`
  display: flex;
  height: 3.75rem;
  background: rgba(248, 248, 248, 1);
  margin-bottom: 1rem;
  border-radius: 2rem;
  align-items: center;
  padding: 0 1.5rem;

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
    margin-right: 0.5rem;
  }
`;

export const Message: FC = () => {
  const { isVisible, message } = useMessageState();

  return isVisible ? (
    <Container>
      <p>
        <span role="img" aria-label="emoji">
          {message?.emoji}
        </span>
        <b>{message?.title}</b>
        {` ${message?.subtitle} `}
        {message?.url && <a href={message.url}>Learn more</a>}
      </p>
    </Container>
  ) : null;
};
