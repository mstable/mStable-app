import styled from 'styled-components';
import React, { FC, ReactNode } from 'react';

// TODO fix this CSS
const FlippableContainer = styled.div<{ flipped: boolean }>`
  .card {
    perspective: 100vw;
  }

  .card-body {
    display: flex;
    transform-style: preserve-3d;
    transition: transform 0.5s;
  }

  .card-front,
  .card-back {
    min-width: 100%;
    transition: opacity 0.5s;
  }

  .card-back {
    transform: rotateY(-180deg) translate(100%, 0);
  }

  .card {
    display: flex;
    transition: z-index, transform 0.5s;
    transition-delay: 0.5s, 0s;
    text-decoration: none;
    z-index: 0;

    .card-front {
      ${({ flipped }) => (flipped ? '' : 'transition-delay: 0s; z-index: 1;')}
    }
    .card-back {
      ${({ flipped }) => (flipped ? 'transition-delay: 0s; z-index: 1;' : '')}
    }
  }

  .card-body {
    flex: 1;
    display: flex;
    height: 100%;
    > * {
      flex: 1;
    }
    ${({ flipped }) =>
      flipped
        ? `
        transform: rotateY(-180deg);
        .card-front {
          pointer-events:none;
          opacity: 0;
        }
        `
        : `
        .card-back {
          pointer-events:none;
          opacity: 0;
        }
        `}
  }
`;

// TODO remove classNames, fix CSS
export const Flippable: FC<{
  flipped: boolean;
  front: ReactNode;
  obverse: ReactNode;
}> = ({ flipped, front, obverse }) => {
  return (
    <FlippableContainer flipped={flipped}>
      <div className="card">
        <div className="card-body">
          <div className="card-front">{front}</div>
          <div className="card-back">{obverse}</div>
        </div>
      </div>
    </FlippableContainer>
  );
};
