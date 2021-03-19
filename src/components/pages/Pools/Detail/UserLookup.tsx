import React, {
  ChangeEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { InputV2 as Input } from '../../../forms/AmountInputV2';
import { Button } from '../../../core/Button';

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;

  p {
    font-weight: 600;
  }

  > button {
    width: 100%;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > button {
      width: inherit;
    }
  }
`;

export const UserLookup: FC = () => {
  const inputText = useRef<string | undefined>();

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      inputText.current = event.target.value ?? undefined;
    },
    [],
  );

  const [lookupAddress, setLookupAddress] = useState<string | undefined>();
  const handleLookupClick = useCallback(() => {
    // TODO useMasquerade
    setLookupAddress(inputText.current);
  }, []);

  return (
    <Container>
      <p>{lookupAddress ? 'Viewing balance of:' : 'Lookup user balance:'}</p>
      <Input
        placeholder="0x00000000000000000000000000000"
        onChange={handleChange}
      />
      <Button onClick={handleLookupClick}>View</Button>
    </Container>
  );
};
