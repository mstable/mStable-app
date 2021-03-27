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

const Container = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;

  > :first-child {
    font-weight: 600;
  }

  > :last-child {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  input {
    padding-left: 0;
    max-width: 12rem;
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
      <div>{isMasquerading ? 'Viewing balance of' : 'Lookup user balance'}</div>
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
