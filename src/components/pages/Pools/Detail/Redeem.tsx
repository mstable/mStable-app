import React, { FC, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import { useTokens } from '../../../../context/TokensProvider';
import { UnstyledButton } from '../../../core/Button';
import { MultiAssetExchangeProvider } from '../../../forms/MultiAssetExchange';
import { RedeemExact } from './RedeemExact';
import { RedeemLP } from './RedeemLP';

interface Props {
  poolAddress: string;
  tokens: string[];
}

const RedeemPathBox = styled.div`
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

export const Redeem: FC<Props> = ({ poolAddress, tokens }) => {
  const [isRedeemExact, setRedeemExact] = useToggle(true);

  const inputTokens = useTokens(tokens);
  const inputAssets = useMemo(() => {
    if (!inputTokens.length) return;
    return inputTokens
      ?.map(t => ({
        [t.address]: {
          decimals: t.decimals,
        },
      }))
      ?.reduce((a, b) => ({ ...a, ...b }));
  }, [inputTokens]);

  return inputAssets ? (
    <MultiAssetExchangeProvider assets={inputAssets}>
      {isRedeemExact ? (
        <RedeemExact poolAddress={poolAddress} tokens={tokens} />
      ) : (
        <RedeemLP poolAddress={poolAddress} tokens={tokens} />
      )}
      <RedeemPathBox>
        <UnstyledButton onClick={setRedeemExact}>
          {`Switch to ${isRedeemExact ? 'mAsset' : 'exact'} redemption`}
        </UnstyledButton>
      </RedeemPathBox>
    </MultiAssetExchangeProvider>
  ) : null;
};
