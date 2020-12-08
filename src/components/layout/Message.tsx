import React, { FC } from 'react';
import styled from 'styled-components';

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
  return (
    <Container>
      <p>
        <span role="img" aria-label="party emoji">
          🎉
        </span>
        <b>SAVE V2 has launched!</b> You’ll need to migrate your balance to
        continue earning interest. <a href="#">Learn more</a>.
      </p>
    </Container>
  );
};
