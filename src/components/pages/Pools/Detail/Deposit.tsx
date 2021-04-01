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
    ${({ theme, protip }) =>
      protip ? theme.color.gold : theme.color.blueTransparent};
  border-radius: 0.75rem;
  margin-top: 1rem;

  ${UnstyledButton} {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.blue};

    ${({ protip, theme }) => ({
      color: `${protip ? theme.color.offYellow : theme.color.blue}`,
    })}

    :hover {
      ${({ protip, theme }) => ({
        color: `${!protip && theme.color.gold}`,
        cursor: `${protip ? `not-allowed` : 'pointer'}`,
      })};
    }
  }
`;

export const Deposit: FC<{ isLowLiquidity?: boolean }> = ({
  isLowLiquidity = false,
}) => {
  const [isMintExact, setMintExact] = useToggle(isLowLiquidity);

  const feederPool = useSelectedFeederPoolState();
  const assets = useSelectedFeederPoolAssets();

  return (
    <MultiAssetExchangeProvider assets={assets}>
      {isMintExact ? <MintExact /> : <MintLP />}
      <MintPathBox protip={isLowLiquidity}>
        {isLowLiquidity ? (
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
