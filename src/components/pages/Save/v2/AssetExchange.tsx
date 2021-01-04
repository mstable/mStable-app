import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { Fields } from '../../../../types';
import { MultiStepButton } from '../../../core/MultiStepButton';
import { AssetInputBox } from './AssetInputBox';
import { useSaveState } from './SaveProvider';

const { Input, Output } = Fields;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    justify-content: space-between;

    @media (min-width: ${ViewportWidth.xl}) {
      flex-direction: row;
    }
  }
`;

const Exchange = styled.div`
  flex-direction: column;
`;

const Details = styled.div`
  flex-direction: column-reverse;

  > * {
    margin-top: 0.75rem;
  }

  @media (min-width: ${ViewportWidth.xl}) {
    > * {
      flex-basis: 45%;
    }
  }
`;

const InputBox = styled(AssetInputBox)`
  flex-basis: 45%;
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 10%;
  margin: 0.5rem 0;

  @media (min-width: ${ViewportWidth.xl}) {
    margin: 0;
  }
`;

const Arrow = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;

  @media (min-width: ${ViewportWidth.xl}) {
    span {
      visibility: hidden;
    }
    span:before {
      content: '→';
      visibility: visible;
      left: 0;
      right: 0;
      text-align: center;
      position: absolute;
    }
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 0.75rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 2rem;
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparenter};

  p {
    text-align: center;
    opacity: 0.75;
    font-size: 0.875rem;
    line-height: 1.75em;
  }
`;

export const AssetExchange: FC = () => {
  const { error, exchange, valid } = useSaveState();

  const formattedSlippage = `${exchange.slippage?.format(2)}%`;
  const { needsUnlock: inputNeedsUnlock } = exchange.input;

  return (
    <Container>
      <Exchange>
        <InputBox title="Deposit" fieldType={Input} />
        <ArrowContainer>
          <Arrow onClick={() => {}}>
            <span>↓</span>
          </Arrow>
        </ArrowContainer>
        <InputBox title="Receive" fieldType={Output} showExchangeRate />
      </Exchange>
      <Details>
        <Column>
          {error && (
            <Error>
              <p>{error}</p>
            </Error>
          )}
          <MultiStepButton needsUnlock={inputNeedsUnlock} valid={valid} />
        </Column>
        {exchange.slippage && (
          <Info>
            <p>Slippage Tolerance</p>
            <span>{formattedSlippage}</span>
          </Info>
        )}
      </Details>
    </Container>
  );
};
