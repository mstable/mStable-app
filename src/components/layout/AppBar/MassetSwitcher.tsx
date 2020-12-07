import React, { FC } from 'react';
import styled from 'styled-components';
import { useEffectOnce } from 'react-use';
import { useLocation } from 'react-router-dom';

import {
  useHandleMassetClick,
  useSelectedMasset,
  useSetSelectedMasset,
} from '../../../context/SelectedMassetProvider';
import { UnstyledButton } from '../../core/Button';
import { TokenIcon } from '../../icons/TokenIcon';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../context/TokensProvider';
import { MassetName } from '../../../types';

const IconContainer = styled.div`
  background: black;
  border-radius: 50%;
  justify-content: center;
  display: flex;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  z-index: 1;
`;

const IdleIconContainer = styled(IconContainer)`
  z-index: 0;
  opacity: 0.3;
`;

const MassetButton = styled(UnstyledButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;

  span {
    font-size: 18px;
    font-weight: 700;
  }
`;

const Icons = styled.div`
  display: flex;
  gap: 0.2rem;
`;

const Balance = styled.div`
  border: 1px solid ${({ theme }) => theme.color.blackTransparent};
  padding: 0.33rem 0.75rem;
  font-weight: 600;
  border-radius: 1.5rem;
  font-size: 0.875rem;

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: normal;
  }
`;

export const MassetSwitcher: FC = () => {
  const { pathname } = useLocation();
  const selectedMasset = useSelectedMasset();
  const setSelectedMasset = useSetSelectedMasset();
  const isMUSD = selectedMasset === 'mUSD';

  const massetState = useSelectedMassetState();
  const massetToken = useTokenSubscription(massetState?.address);

  const handleMassetClick = useHandleMassetClick();

  useEffectOnce(() => {
    const match = pathname.match(/^\/(musd|mbtc)/)?.[1];
    if (match) {
      setSelectedMasset(
        // TODO a bit messy
        (match.slice(0, 1) + match.slice(1).toUpperCase()) as MassetName,
      );
    }
  });

  return (
    <MassetButton>
      <Icons>
        <IconContainer>
          <TokenIcon symbol={selectedMasset} />
        </IconContainer>
        <IdleIconContainer
          onClick={() => {
            handleMassetClick(isMUSD ? 'mBTC' : 'mUSD');
          }}
        >
          {isMUSD ? <TokenIcon symbol="mBTC" /> : <TokenIcon symbol="mUSD" />}
        </IdleIconContainer>
      </Icons>
      {massetToken && (
        <Balance>
          <span>{massetToken.balance.format()}</span>
        </Balance>
      )}
      <span>{selectedMasset}</span>
    </MassetButton>
  );
};
