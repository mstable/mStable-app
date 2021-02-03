import React, { FC } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useConnected, useConnect } from '../../context/OnboardProvider';
import { MassetName } from '../../types';
import { MASSETS } from '../../constants';
import { UnstyledButton } from '../core/Button';
import { useSetSelectedMassetName } from '../../context/SelectedMassetNameProvider';
import { TokenIcon } from '../icons/TokenIcon';
import { ReactComponent as LogoImage } from '../icons/mstable.svg';
import { ViewportWidth } from '../../theme';

const StyledTokenIcon = styled(TokenIcon)`
  height: 6rem;
  width: 6rem;
  border: 4px solid
    ${({ theme }) =>
      !theme.isLight ? theme.color.backgroundAccent : 'transparent'};
  border-radius: 3rem;
`;

const StyledButton = styled(UnstyledButton)<{ asset: MassetName }>`
  width: 100%;
  max-width: 20rem;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2rem;
  padding: 2rem 0;
  font-weight: bold;
  background: ${({ theme }) => theme.color.backgroundAccent};

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }

  &:hover {
    background: ${({ theme }) => theme.color.accentContrast};
  }

  &:active {
    background: ${({ theme }) => theme.color.accentContrast};
  }
`;

const MassetButton: FC<{ massetName: MassetName }> = ({ massetName }) => {
  const history = useHistory();
  const connect = useConnect();
  const connected = useConnected();

  const setSelectedMassetName = useSetSelectedMassetName();
  const { symbol, slug } = MASSETS[massetName];

  return (
    <StyledButton
      asset={massetName}
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
    </StyledButton>
  );
};

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  > *:not(:last-child) {
    margin-bottom: 1rem;
    margin-right: 0;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: center;

    > *:not(:last-child) {
      margin-bottom: 0;
      margin-right: 2rem;
    }
  }
`;

const Tagline = styled.h1`
  font-size: 1.5rem;
  line-height: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.color.bodyAccent};
  text-transform: lowercase;
  padding: 0 1rem;
`;

const Logo = styled(LogoImage)`
  width: 12rem;

  path {
    fill: ${({ theme }) => theme.color.body};
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 4rem 0;

    > *:not(:last-child) {
      margin-bottom: 4rem;
    }
  }
`;

export const Home: FC = () => {
  return (
    <Container>
      <Header>
        <Logo />
        <Tagline>
          Autonomous and non-custodial stablecoin infrastructure.
        </Tagline>
      </Header>
      <Buttons>
        <MassetButton massetName="mbtc" />
        <MassetButton massetName="musd" />
      </Buttons>
    </Container>
  );
};