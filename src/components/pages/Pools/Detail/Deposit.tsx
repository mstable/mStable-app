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

const MintPathBox = styled.div<{ protip?: boolean }>`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 1rem;
  border: 1px dashed
    ${({ theme, protip }) => (protip ? theme.color.gold : theme.color.accent)};
  border-radius: 0.75rem;
  margin-top: 1rem;

  button {
    font-size: 1rem;

    ${({ protip, theme }) => ({
      fontWeight: protip ? 500 : 600,
      color: `${protip ? theme.color.offYellow : theme.color.grey}`,
    })}

    :hover {
      ${({ protip, theme }) => ({
        color: `${!protip && theme.color.grey}`,
        cursor: `${protip ? `not-allowed` : 'pointer'}`,
      })};
    }
  }
`;

export const Deposit: FC<{ exactOnly?: boolean }> = ({ exactOnly = false }) => {
  const [isMintExact, setMintExact] = useToggle(exactOnly);

  const feederPool = useSelectedFeederPoolState();
  const assets = useSelectedFeederPoolAssets();

  return (
    <MultiAssetExchangeProvider assets={assets}>
      {isMintExact ? <MintExact /> : <MintLP />}
      <MintPathBox protip={exactOnly}>
        {exactOnly ? (
          <UnstyledButton disabled>
            Single-asset deposits are disabled due to low liquidity
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
