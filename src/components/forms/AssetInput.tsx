import React, { FC } from 'react';
import styled from 'styled-components';

import { BigDecimal } from '../../web3/BigDecimal';
import { Button } from '../core/Button';
import { SubscribedTokenInput } from './SubscribedTokenInput';
import { AmountInput } from './AmountInput';

interface Props {
  amountDisabled?: boolean;
  formValue?: string;
  address?: string;
  addressOptions?: { address: string; balance?: BigDecimal; label?: string }[];
  addressDisabled?: boolean;
  error?: boolean;
  handleSetAmount?(formValue?: string): void;
  handleSetAddress?(address: string): void;
  handleSetMax?(): void;
}

const TokenContainer = styled.div`
  display: flex;
  align-items: center;

  > div {
    width: 100%;
    padding-right: 8px;
  }
`;

const Input = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }

  button {
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 0.5rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;

  > :last-child {
    margin-right: 0;
    flex: 1;
  }

  input {
    margin-bottom: 0;
    height: 100%;
    flex: 1;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BalanceContainer = styled.div``;

const Grid = styled.div<{ enabled?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;

  ${InputContainer} {
    overflow: hidden;
    transition: all 0.4s ease;
    flex-basis: calc(60% - 0.25rem);
  }

  ${TokenContainer} {
    flex-basis: calc(40% - 0.25rem);
  }
`;

export const AssetInput: FC<Props> = ({
  address,
  addressDisabled,
  addressOptions,
  amountDisabled,
  error,
  formValue,
  handleSetAddress,
  handleSetAmount,
  handleSetMax,
}) => {
  return (
    <Grid>
      <InputContainer>
        <Input>
          <AmountInput
            disabled={amountDisabled}
            value={formValue}
            error={error}
            onChange={handleSetAmount}
          />
          {handleSetMax && (
            <Button
              type="button"
              onClick={handleSetMax}
              scale={0.75}
              transparent
            >
              Max
            </Button>
          )}
        </Input>
      </InputContainer>
      <TokenContainer>
        <SubscribedTokenInput
          disabled={addressDisabled}
          value={address}
          options={addressOptions}
          onChange={handleSetAddress}
        />
      </TokenContainer>
    </Grid>
  );
};
