import React, { FC } from 'react';
import styled from 'styled-components';

import {
  useToken,
  useTokenAllowance,
} from '../../context/DataProvider/TokensProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { ToggleInput } from './ToggleInput';
import { AmountInput } from './AmountInput';
import { ApproveButton } from './ApproveButton';
import { FontSize, ViewportWidth } from '../../theme';
import { Token } from '../core/Token';
import { Tooltip } from '../core/ReactTooltip';
import { CountUp } from '../core/CountUp';
import { Button } from '../core/Button';

interface Props {
  amount: {
    value?: BigDecimal;
    formValue: string | null;
    disabled?: boolean;
    handleChange?(formValue: string | null): void;
    handleClick?(): void;
    handleSetMax?(): void;
  };
  token: {
    address: string;
    addresses?: string[];
    disabled?: boolean;
    handleChange?(address: string): void;
  };
  toggle?: {
    canEnable: boolean;
    enabled: boolean;
    reasonCannotEnable?: string;
    handleToggle(): void;
  };
  approval?: {
    spender: string;
  };
  error?: string;
  valid?: boolean;
  overweight?: boolean;
}

const StyledCountUp = styled(CountUp)`
  display: block;
  text-align: right;
`;

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
  }

  input {
    margin-bottom: 0;
    height: 100%;
  }
`;

const Error = styled.div`
  padding-top: 8px;
  font-size: ${FontSize.s};
  color: ${({ theme }) => theme.color.red};
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

const BalanceContainer = styled.div``;

const Grid = styled.div<{ enabled?: boolean }>`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0 8px;
  align-items: center;

  ${TokenContainer} {
    grid-area: 1 / 1 / 2 / 5;
  }

  ${InputContainer} {
    grid-area: 2 / 1 / 3 / 9;
    overflow: hidden;
    transition: all 0.4s ease;
    opacity: ${({ enabled }) => (enabled ? 1 : 0)};
    max-height: ${({ enabled }) => (enabled ? '100px' : 0)};
    padding-top: ${({ enabled }) => (enabled ? '8px' : 0)};
  }

  ${BalanceContainer} {
    grid-area: 1 / 5 / 2 / 9;
  }

  @media (min-width: ${ViewportWidth.m}) {
    ${TokenContainer} {
      grid-area: 1 / 1 / 3 / 3;
    }

    ${InputContainer} {
      grid-area: 1 / 3 / 3 / 7;
      opacity: 1;
      max-height: 100%;
      padding-top: 0;
    }

    ${BalanceContainer} {
      grid-area: 1 / 7 / 3 / 9;
    }
  }
`;

const Container = styled.div<{
  valid?: boolean;
  overweight?: boolean;
  enabled?: boolean;
}>`
  border: 1px
    ${({ theme, valid }) =>
      valid ? theme.color.blackTransparent : theme.color.redTransparent}
    solid;
  border-radius: 3px;
  background: ${({ theme, overweight }) =>
    overweight ? theme.color.blackTransparenter : theme.color.white};
  padding: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 8px;
`;

const ToggleWrapper: FC<{
  canEnable: boolean;
  reasonCannotEnable?: string;
}> = ({ children, canEnable, reasonCannotEnable }) =>
  reasonCannotEnable && !canEnable ? (
    <Tooltip tip={reasonCannotEnable} hideIcon>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );

export const InlineTokenAmountInput: FC<Props> = ({
  amount,
  approval,
  token,
  error,
  overweight,
  toggle,
  valid,
}) => {
  const { decimals, symbol, balance } = useToken(token.address) || {};
  const allowance = useTokenAllowance(token.address, approval?.spender);
  const enabled = toggle ? toggle.enabled : true;
  return (
    <Container enabled={enabled} overweight={overweight} valid={valid}>
      <Grid enabled={enabled}>
        <TokenContainer>
          {toggle ? (
            <ToggleWrapper
              canEnable={toggle.canEnable}
              reasonCannotEnable={toggle.reasonCannotEnable}
            >
              <ToggleInput
                disabled={!toggle.canEnable}
                onClick={toggle.handleToggle}
                checked={toggle.enabled}
              />
            </ToggleWrapper>
          ) : null}
          {symbol ? <Token symbol={symbol} /> : null}
        </TokenContainer>
        <InputContainer onClick={amount.handleClick}>
          <Label>Amount</Label>
          {decimals ? (
            <Input>
              <AmountInput
                disabled={amount.disabled}
                value={amount.formValue}
                error={error}
                onChange={amount.handleChange}
              />
              {amount.handleSetMax ? (
                <Button type="button" onClick={amount.handleSetMax}>
                  Max
                </Button>
              ) : null}
              {approval &&
              allowance &&
              amount.value?.exact.gt(allowance.exact) ? (
                <ApproveButton
                  address={token.address}
                  spender={approval.spender}
                  amount={amount.value}
                />
              ) : null}
            </Input>
          ) : null}
        </InputContainer>
        <StyledCountUp
          container={BalanceContainer}
          end={balance?.simpleRounded || 0}
        />
      </Grid>
      {error ? <Error>{error}</Error> : null}
    </Container>
  );
};
