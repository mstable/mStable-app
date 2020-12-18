import React, { FC } from 'react';
import styled from 'styled-components';
import { ReactComponent as GovSvg } from '../../../icons/governance-icon.svg';
import { ReactComponent as ArrowsSvg } from '../../../icons/double-arrow.svg';
import { Tooltip } from '../../../core/ReactTooltip';
import { Input } from '../../../forms/AmountInput';
import { H3 } from '../../../core/Typography';
import { BubbleButton as Button } from '../../../core/Button';
import { ViewportWidth } from '../../../../theme';

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  > :first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
  }
  span {
    font-weight: 800;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const H1 = styled.h1`
  font-size: 20px;
  font-weight: bold;
  padding-right: 15px;
`;

const CalculatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${ViewportWidth.s}) {
    flex-direction: column;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 30px;
  @media (max-width: ${ViewportWidth.s}) {
    width: 100%;
    margin-right: 0px;
  }
`;

const Number = styled.span`
  ${({ theme }) => theme.mixins.numeric}
`;

const MultiplierContainer = styled.div`
  margin-left: 10px;
  background: #eee;
  border-radius: 12px;
  padding-right: 10px;
  padding-left: 10px;
  margin-right: 30px;
  @media (max-width: ${ViewportWidth.s}) {
    width: 100%;
    margin-left: 0px;
    margin-bottom: 30px;
    margin-right: 0px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: ${ViewportWidth.s}) {
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  background: #eee;
  color: rgba(121, 121, 121, 1);
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  white-space: nowrap;
  margin-bottom: 6px;
  &:hover {
    background: #176ede;
    color: white;
    > :first-child {
      > :first-child {
        > :first-child {
          fill: white;
        }
      }
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    > :first-child {
      fill: rgba(121, 121, 121, 1);
    }
  }
`;

export const BoostCalculator: FC = () => {
  return (
    <Container>
      <div>
        <Title>
          <H1>Savings Boost Calculator</H1>
          <Tooltip tip="GIGA BOOSTED" />
        </Title>
      </div>
      <CalculatorContainer>
        <InputContainer>
          <span>vMTA</span>
          <Input />
        </InputContainer>
        <InputContainer>
          <span>imUSD</span>
          <Input />
        </InputContainer>
        <span> = </span>
        <MultiplierContainer>
          <H3>Multiplier</H3>
          <Number>0.75x</Number>
        </MultiplierContainer>
        <ButtonContainer>
          <StyledButton>
            <IconContainer>
              <ArrowsSvg />
              Preview Max
            </IconContainer>
          </StyledButton>
          <StyledButton>
            <IconContainer>
              <GovSvg />
              Stake MTA
            </IconContainer>
          </StyledButton>
        </ButtonContainer>
      </CalculatorContainer>
    </Container>
  );
};
