import React, { FC } from 'react';
import styled from 'styled-components';

import { useHandleMassetClick } from '../../../context/SelectedMassetProvider';
import { ReactComponent as LogoSvg } from '../../icons/mstable-icon.svg';
import { UnstyledButton } from '../../core/Button';
import { ViewportWidth } from '../../../theme';
import { TokenIcon } from '../../icons/TokenIcon';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  width: 6.5rem;
  height: 6.5rem;
  svg {
    height: 2.5rem;
    width: 2.5rem;
  }
`;

const MassetsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
`;

const Musd = styled(UnstyledButton)`
  flex: 1 1 auto;
  margin: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.color.blue};
  width: 18rem;
  height: 14rem;
  border-radius: 32px;
  cursor: pointer;
  span {
    font-family: Poppins, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    color: #ffffff;
  }
  border: 10px solid #e3efff;
  @media (min-width: ${ViewportWidth.m}) {
    margin: 5rem;
  }
`;

const Mbtc = styled(Musd)`
  background: ${({ theme }) => theme.color.gold};
  border: 10px solid #ffedd1;
`;

export const Home: FC = () => {
  const handleMassetClick = useHandleMassetClick();
  return (
    <Container>
      <LogoSvg />
      <MassetsContainer>
        <Musd
          onClick={() => {
            handleMassetClick('mUSD');
          }}
        >
          <IconContainer>
            <TokenIcon symbol="mUSD" />
          </IconContainer>
          <span>mUSD</span>
        </Musd>
        <Mbtc
          onClick={() => {
            handleMassetClick('mBTC');
          }}
        >
          <IconContainer>
            <TokenIcon symbol="mBTC" />
          </IconContainer>
          <span>mBTC</span>
        </Mbtc>
      </MassetsContainer>
    </Container>
  );
};
