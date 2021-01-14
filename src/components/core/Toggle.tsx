import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from './Button';
import { ThemedSkeleton } from './ThemedSkeleton';

interface Props {
  className?: string;
  options: { title: string; onClick(): void; active: boolean }[];
}

const Container = styled.div`
  padding: 0;
  border-radius: 1.5rem;
  background: ${({ theme }) => theme.color.accent};

  button:not(:first-child) {
    margin-left: -0.5rem;
  }
`;

export const Toggle: FC<Props> = ({ className, options }) => {
  const isLoading = options.length === 0;

  return (
    <Container className={className}>
      {isLoading ? (
        <ThemedSkeleton height={42} width={128} />
      ) : (
        options.map(({ title, active, onClick }) => (
          <Button
            key={title}
            onClick={onClick}
            type="button"
            highlighted={active}
            scale={0.9}
          >
            {title}
          </Button>
        ))
      )}
    </Container>
  );
};
