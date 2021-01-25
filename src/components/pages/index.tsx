import React, { FC } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useConnected, useConnect } from '../../context/OnboardProvider';
import { MassetName } from '../../types';
import { MASSETS } from '../../constants';
import { Button } from '../core/Button';
import { useSetSelectedMassetName } from '../../context/SelectedMassetNameProvider';
import { TokenIcon } from '../icons/TokenIcon';

const StyledTokenIcon = styled(TokenIcon)`
  max-width: 10rem;
`;

const MassetButton: FC<{ massetName: MassetName }> = ({ massetName }) => {
  const history = useHistory();
  const connect = useConnect();
  const connected = useConnected();

  const setSelectedMassetName = useSetSelectedMassetName();
  const { symbol, slug } = MASSETS[massetName];

  return (
    <Button
      onClick={() => {
        if (!connected) {
          connect();
        }
        setSelectedMassetName(slug as MassetName);
        history.push(`/${slug}/mint`);
      }}
    >
      <StyledTokenIcon symbol={symbol} />
      <div>{symbol}</div>
    </Button>
  );
};

// TODO proper style
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  ${Button} {
    width: 100%;
    height: 30rem;
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
`;

export const Home: FC = () => {
  return (
    <Container>
      <MassetButton massetName="mbtc" />
      <MassetButton massetName="musd" />
    </Container>
  );
};
