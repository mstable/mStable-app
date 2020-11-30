import React, { FC } from 'react';
import styled from 'styled-components';
import { ReactComponent as MstableIcon } from '../../icons/mstable_horizontal.svg';
import { ReactComponent as MusdIcon } from '../../icons/musd_logo.svg';
import { ReactComponent as BtcIcon } from '../../icons/btc_logo.svg';
import { useSetSelectedMasset } from '../../../context/MassetsProvider';
import { UnstyledButton } from '../../core/Button';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  :first-child {
    margin-bottom: 1.5rem;
  }
`;

const MusdIconContainer = styled.div`
  background: #176ede;
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

const MbtcIconContainer = styled(MusdIconContainer)`
  background: #ffa825;
`;

const MassetsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
`;

const Musd = styled(UnstyledButton)`
  flex: 1 1 auto;
  margin: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #176ede;
  width: 18rem;
  height: 14rem;
  border-radius: 32px;
  cursor: pointer;
  span {
    font-family: Poppins;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    color: #ffffff;
  }
`;

const Mbtc = styled(Musd)`
  background: #ffa825;
`;

export const Home: FC = () => {
  const selectMasset = useSetSelectedMasset();
  return (
    <Container>
      <MstableIcon />
      <MassetsContainer>
        <Musd onClick={() => selectMasset('mUSD')}>
          <MusdIconContainer>
            <MusdIcon />
          </MusdIconContainer>
          <span>mUSD</span>
        </Musd>
        <Mbtc onClick={() => selectMasset('mUSD')}>
          <MbtcIconContainer>
            <BtcIcon />
          </MbtcIconContainer>
          <span>mBTC</span>
        </Mbtc>
      </MassetsContainer>
    </Container>
  );
};
