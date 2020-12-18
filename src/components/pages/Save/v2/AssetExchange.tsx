import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../../../theme';
import { Fields } from '../../../../types';
import { BubbleButton } from '../../../core/Button';
import { MultiStepButton } from '../../../core/MultiStepButton';
import { AssetInputBox } from './AssetInputBox';

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

const Arrow = styled(BubbleButton)`
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

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

const CTA = styled(MultiStepButton)`
  margin-top: 0.75rem;

  @media (min-width: ${ViewportWidth.xl}) {
    flex-basis: calc(45% + 0.5rem);
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 0.75rem;
  margin-top: 0.75rem;

  @media (min-width: ${ViewportWidth.xl}) {
    flex-basis: calc(45% + 0.5rem);
  }
`;

export const AssetExchange: FC = () => {
  const [inputOrder, setInputOrder] = useState([Input, Output]);

  const reverseInputOrder = useCallback(
    () =>
      setInputOrder(
        inputOrder[0] === Input ? [Output, Input] : [Input, Output],
      ),
    [inputOrder],
  );

  return (
    <Container>
      <Exchange>
        <InputBox fieldType={inputOrder[0]} />
        <ArrowContainer>
          <Arrow onClick={reverseInputOrder}>
            <span>↓</span>
          </Arrow>
        </ArrowContainer>
        <InputBox fieldType={inputOrder[1]} />
      </Exchange>
      <Details>
        <CTA />
        <Info>
          <p>Slippage Tolerance</p>
          <span>3.00%</span>
        </Info>
      </Details>
    </Container>
  );
};