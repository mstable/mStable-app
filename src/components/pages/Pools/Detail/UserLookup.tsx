import React, { ChangeEventHandler, useCallback, useRef } from 'react';
import type { FC } from 'react';
import styled from 'styled-components';
import { isAddress } from 'ethers/lib/utils';

import { InputV2 as Input } from '../../../forms/AmountInputV2';
import { Button } from '../../../core/Button';
import {
  useIsMasquerading,
  useMasquerade,
} from '../../../../context/UserProvider';
import { ViewportWidth } from '../../../../theme';

const Container = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;

  > h3 {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  > :not(:last-child) {
    margin-bottom: 0.5rem;
  }

  > :last-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input {
    padding-left: 0;
    height: inherit;
    padding: 0.75rem 0;
    width: 100%;
    margin-right: 1.875rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > h3 {
      font-size: 1.25rem;
    }
  }
`;

export const UserLookup: FC = () => {
  const inputText = useRef<string | undefined>();
  const masquerade = useMasquerade();
  const isMasquerading = useIsMasquerading();

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      inputText.current = event.target.value ?? undefined;
    },
    [],
  );

  return (
    <Container>
      <h3>{isMasquerading ? 'Viewing balance of' : 'Lookup user balance'}</h3>
      <div>
        <Input placeholder="0x000…" onChange={handleChange} />
        <Button
          onClick={() => {
            if (
              !isMasquerading &&
              inputText.current &&
              isAddress(inputText.current)
            ) {
              masquerade(inputText.current);
            } else {
              masquerade();
            }
          }}
        >
          {isMasquerading ? 'Reset' : 'View'}
        </Button>
      </div>
    </Container>
  );
};
