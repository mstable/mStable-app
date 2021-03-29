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

export const Deposit: FC<{ disableExact?: boolean }> = ({
  disableExact = false,
}) => {
  const [isMintExact, setMintExact] = useToggle(!disableExact);

  const feederPool = useSelectedFeederPoolState();
  const assets = useSelectedFeederPoolAssets();

  return (
    <MultiAssetExchangeProvider assets={assets}>
      {isMintExact ? <MintExact /> : <MintLP />}
      <MintPathBox>
        {disableExact ? (
          <UnstyledButton disabled>
            Mint via {feederPool.token.symbol} disabled due to low liquidity
          </UnstyledButton>
        ) : (
          <UnstyledButton onClick={setMintExact}>
            {`Switch to mint via ${
              isMintExact ? feederPool.token.symbol : 'multiple'
            } `}
          </UnstyledButton>
        )}
      </MintPathBox>
    </MultiAssetExchangeProvider>
  );
};
