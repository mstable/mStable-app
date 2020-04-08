import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useClipboard } from 'use-clipboard-copy';
import { EtherscanLink } from './EtherscanLink';
import { Button } from './Button';
import { Size } from '../../theme';

interface Props {
  address: string;
  type: 'account' | 'transaction';
  copyable?: boolean;
  truncate?: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Copy = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.s};
  min-width: 60px;
`;

export const Address: FC<Props> = ({
  address,
  type,
  truncate = true,
  copyable,
}) => {
  const { copy, copied } = useClipboard({ copiedTimeout: 1500 });

  const handleCopy = useCallback(() => {
    copy(address);
  }, [copy, address]);

  return (
    <Container>
      <EtherscanLink data={address} type={type} showData truncate={truncate} />
      {copyable ? (
        <Copy
          size={Size.xs}
          onClick={handleCopy}
          title="Copy address to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Copy>
      ) : null}
    </Container>
  );
};
