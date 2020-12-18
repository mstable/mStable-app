import React, { FC } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../../../core/ReactTooltip';
import { ReactComponent as GearSvg } from '../../../icons/gear-icon.svg';
import { ProgressBar } from '../../../core/ProgressBar';

const Container = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  padding-bottom: 50px;
  > :first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
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

const GearContainer = styled.div`
  display: flex;
  border-radius: 20px;
  transition: 0.5s linear all;
  align-items: center;
  padding: 6px 6px 6px 6px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const NumberContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
`;

const Number = styled.span`
  ${({ theme }) => theme.mixins.numeric}
  color: grey;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin-left: 16px;
  margin-right: 16px;
  border: 1px solid #e0e0e0;
`;

export const Boost: FC = () => {
  return (
    <Container>
      <div>
        <Title>
          <H1>Boost</H1>
          <Tooltip tip="GIGA BOOSTED" />
        </Title>
        <GearContainer>
          <GearSvg />
        </GearContainer>
      </div>
      <ProgressBar color="#67C73A" value={0.75} max={1.5} />
      <NumberContainer>
        <Number>0.5x</Number>
        <Line />
        <Number>1.5x</Number>
      </NumberContainer>
    </Container>
  );
};
