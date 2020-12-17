import React, { FC } from 'react';
import styled from 'styled-components';
import { Fields } from '../../../../types';
import { MultiStepButton } from '../../../core/MultiStepButton';
import { AssetInputBox } from './AssetInputBox';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Inputs = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    flex-basis: calc(50% - 1.5rem);
  }
`;

const CTA = styled(MultiStepButton)`
  margin-top: 0.75rem;
  width: calc(50% - 1.5rem);
`;

export const AssetExchange: FC = () => {
  return (
    <Container>
      <Inputs>
        <AssetInputBox title="Deposit" fieldType={Fields.Input} />
        <AssetInputBox title="Receive" fieldType={Fields.Output} />
      </Inputs>
      <CTA />
    </Container>
  );
};
