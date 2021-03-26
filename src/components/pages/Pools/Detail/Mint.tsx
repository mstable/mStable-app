import React, { FC } from 'react';
import styled from 'styled-components';

import { useToggle } from 'react-use';
import { MultiAssetExchangeProvider } from '../../../forms/MultiAssetExchange';
import {
  useSelectedFeederPoolAssets,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { UnstyledButton } from '../../../core/Button';
import { MintExact } from './MintExact';
import { MintLP } from './MintLP';

const MintPathBox = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 1rem;
  border: 1px dashed ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;
  margin-top: 1rem;

  button {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.grey};
    :hover {
      color: ${({ theme }) => theme.color.gold};
    }
  }
`;

export const Mint: FC = () => {
  const [isMintExact, setMintExact] = useToggle(false);

  const feederPool = useSelectedFeederPoolState();
  const assets = useSelectedFeederPoolAssets();

  return (
    <MultiAssetExchangeProvider assets={assets}>
      {isMintExact ? <MintExact /> : <MintLP />}
      <MintPathBox>
        <UnstyledButton onClick={setMintExact}>
          {`Switch to ${
            isMintExact ? feederPool.token.symbol : 'exact'
          } amount mint`}
        </UnstyledButton>
      </MintPathBox>
    </MultiAssetExchangeProvider>
  );
};
