import React, { FC } from 'react';
import styled from 'styled-components';

import Skeleton from 'react-loading-skeleton';
import { BubbleButton } from './Button';

interface Props {
  className?: string;
  disabled?: boolean;
  activeIndex?: number;
  titles?: string[];
  onClick: (index: number) => void;
}

const Container = styled.div`
  padding: 0;
  border-radius: 1.5rem;
  background: #eee;

  button:not(:first-child) {
    margin-left: -0.5rem;
  }
`;

export const Toggle: FC<Props> = props => {
  const { className, titles, activeIndex, onClick } = props;
  const isLoading = titles === undefined;

  return (
    <Container className={className}>
      {isLoading ? (
        <Skeleton height={42} width={128} />
      ) : (
        titles?.map((title, i) => (
          <BubbleButton
            key={`btn-${title}`}
            onClick={() => onClick(i)}
            type="button"
            highlighted={activeIndex === i}
            scale={0.9}
          >
            {title}
          </BubbleButton>
        ))
      )}
    </Container>
  );
};
