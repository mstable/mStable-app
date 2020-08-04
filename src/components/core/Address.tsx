import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useClipboard } from 'use-clipboard-copy';
import { EtherscanLink } from './EtherscanLink';
import { Button } from './Button';

interface Props {
  address: string;
  type: 'account' | 'transaction';
  copyable?: boolean;
  truncate?: boolean;
}

const Copy = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.xs};
  min-width: 60px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
        <Copy onClick={handleCopy} title="Copy address to clipboard">
          {copied ? 'Copied!' : 'Copy'}
        </Copy>
      ) : null}
    </Container>
  );
};
