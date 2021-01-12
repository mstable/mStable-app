import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../theme';
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

  > :first-child {
    padding-right: 8px;
  }
`;

const Input = styled.div`
  display: flex;
  justify-content: space-between;

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }

  button {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :last-child {
    margin-right: 0;
    flex: 1;
  }

  input {
    margin-bottom: 0;
    height: 100%;
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.m}) {
    align-items: inherit;
  }
`;

const Label = styled.div`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;
  text-transform: uppercase;
  padding-right: 8px;

  @media (min-width: ${ViewportWidth.m}) {
    display: none;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BalanceContainer = styled.div``;

const Grid = styled.div<{ enabled?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;

  ${InputContainer} {
    overflow: hidden;
    transition: all 0.4s ease;
  }

  ${TokenContainer} {
    padding-top: 0.5rem;

    > div {
      flex: 1;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    ${InputContainer} {
      flex-basis: calc(60% - 0.25rem);
    }

    ${TokenContainer} {
      padding: 0;

      flex-basis: calc(40% - 0.25rem);
    }
  }
`;

const Container = styled.div`
  background: ${({ theme }) => theme.color.white};
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
    <Container>
      <Grid>
        <InputContainer>
          <Label>Amount</Label>
          <Input>
            <AmountInput
              disabled={amountDisabled}
              value={formValue}
              error={error}
              onChange={handleSetAmount}
            />
            {handleSetMax && (
              <Button type="button" onClick={handleSetMax} scale={0.75}>
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
    </Container>
  );
};
