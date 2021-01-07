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

    @media (min-width: ${ViewportWidth.l}) {
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

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }
`;

const InputBox = styled(AssetInputBox)`
  flex-basis: 47.5%;
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 0.5rem 0;

  @media (min-width: ${ViewportWidth.l}) {
    margin: 0;
  }
`;

const Arrow = styled.div`
  border-radius: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${ViewportWidth.l}) {
    span {
      visibility: hidden;
    }
    span:before {
      content: '→';
      font-size: 1.25rem;
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
          <MultiStepButton
            title="Deposit"
            needsUnlock={inputNeedsUnlock}
            valid={valid}
          />
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
