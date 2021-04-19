import type { FC } from 'react';
import React from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import { UnstyledButton } from '../../../core/Button';
import { MultiAssetExchangeProvider } from '../../../forms/MultiAssetExchange';
import {
  useSelectedFeederPoolAssets,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { RedeemExact } from './RedeemExact';
import { RedeemLP } from './RedeemLP';

const RedeemPathBox = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 1rem;
  border: 1px dashed ${({ theme }) => theme.color.defaultBorder};
  border-radius: 0.75rem;
  margin-top: 1rem;

  ${UnstyledButton} {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.primary};
    :hover {
      color: ${({ theme }) => theme.color.gold};
    }
  }
`;

export const Withdraw: FC<{ isLowLiquidity?: boolean }> = ({
  isLowLiquidity = false,
}) => {
  const [isRedeemExact, setRedeemExact] = useToggle(false);

  const feederPool = useSelectedFeederPoolState();
  const assets = useSelectedFeederPoolAssets();

  return (
    <MultiAssetExchangeProvider assets={assets}>
      {isRedeemExact ? <RedeemExact /> : <RedeemLP />}
      <RedeemPathBox>
        <div>
          <UnstyledButton onClick={setRedeemExact}>
            {isLowLiquidity
              ? `Withdraw from ${
                  isRedeemExact
                    ? `${feederPool.token.symbol} Vault`
                    : feederPool.token.symbol
                }`
              : `Switch to ${
                  isRedeemExact ? feederPool.token.symbol : 'exact'
                } amount redemption`}
          </UnstyledButton>
        </div>
      </RedeemPathBox>
    </MultiAssetExchangeProvider>
  );
};
