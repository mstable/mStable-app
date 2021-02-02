import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';

import { BigDecimal } from '../../web3/BigDecimal';
import { useTokenSubscription } from '../../context/TokensProvider';
import { TokenIcon } from '../icons/TokenIcon';
import { FontSize, ViewportWidth } from '../../theme';

// TODO: - Create base component for SubscribedTokenInput & TokenInput and inherit.

interface Props {
  value?: string;
  options?: {
    address: string;
    balance?: BigDecimal;
    label?: string;
    symbol?: string;
  }[];
  onChange?(tokenAddress?: string): void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const RelativeContainer = styled.div`
  position: relative;
  overflow: visible;
`;

const TokenSymbol = styled.div<{ hasBalance: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;

  span {
    font-size: ${({ hasBalance }) => (hasBalance ? `1rem` : `1.125rem`)};
  }
`;

const Balance = styled.div`
  font-size: ${FontSize.s};
  font-weight: normal;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.color.grey};
  ${({ theme }) => theme.mixins.numeric}
`;

const OptionsContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  z-index: 2;

  // Offset parent border, even with box-sizing: border-box
  top: -1px;
  left: -1px;
  right: -1px;

  background: ${({ theme }) => theme.color.accent};
  border: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  border-radius: 0 0 4px 4px;
`;

const OptionContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: hidden;
  padding: 0.5rem;
  background: ${({ selected, theme }) =>
    selected ? theme.color.blueTransparent : 'transparent'};

  img {
    padding-right: 0.75rem;
    width: 2.75rem;
  }

  &:hover {
    background: ${({ theme }) => theme.color.blueTransparent};
  }
`;

const Placeholder = styled(OptionContainer)`
  font-size: ${FontSize.s};
  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.m};
  }
  &:hover {
    background: none;
  }
`;

const Selected = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;

  > div:hover {
    background: none;
  }
`;

const DownArrow = styled.div`
  padding: 4px;
`;

const Option: FC<{
  address: string;
  balance?: BigDecimal;
  label?: string;
  symbol?: string;
  selected?: boolean;
  onClick?(address: string): void;
}> = ({
  address,
  balance: _balance,
  symbol: _symbol,
  label,
  selected,
  onClick,
}) => {
  const token = useTokenSubscription(address);
  const balance = _balance ?? token?.balance;
  const symbol = _symbol ?? token?.symbol;
  return (
    <OptionContainer
      onClick={() => {
        onClick?.(address);
      }}
      selected={selected}
    >
      {symbol && <TokenIcon symbol={symbol} />}
      <TokenSymbol hasBalance={!!balance?.simple}>
        <span>{label ?? symbol}</span>
        {!!balance?.simple && <Balance>{balance.format(2, true)}</Balance>}
      </TokenSymbol>
    </OptionContainer>
  );
};

const placeholderText = 'Select';

const Container = styled.div<Pick<Props, 'error' | 'disabled'>>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ error, theme, disabled }) =>
    error
      ? theme.color.redTransparenter
      : disabled
      ? theme.color.accent
      : 'transparent'};
  outline: 0;
  border: 1px
    ${({ theme, error }) =>
      error ? theme.color.redTransparent : theme.color.blackTransparent}
    solid;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.color.body};
  font-size: ${FontSize.s};
  font-weight: bold;
  user-select: none;
  min-width: 8rem;

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.m};
  }
`;

export const SubscribedTokenInput: FC<Props> = ({
  value,
  options,
  onChange,
  disabled = false,
  error,
  className,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const selectedOption = useMemo(
    () =>
      value && options
        ? options.find(option => value === option.address)
        : undefined,
    [options, value],
  );

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleUnset = useCallback(() => {
    if (open) {
      onChange?.();
    }
  }, [onChange, open]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClickOutside();
      }
    },
    [handleClickOutside],
  );

  const container = useRef(null);

  useOnClickOutside(container, handleClickOutside);

  useLayoutEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Container
      onClick={() => {
        if (!disabled) {
          setOpen(!open);
        }
      }}
      ref={container}
      error={error}
      disabled={disabled}
      className={className}
    >
      <Selected>
        {value ? (
          <Option
            address={value}
            balance={selectedOption?.balance}
            label={selectedOption?.label}
            symbol={selectedOption?.symbol}
          />
        ) : (
          <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
        )}
        {options && options.length > 1 && <DownArrow>▼</DownArrow>}
      </Selected>
      <RelativeContainer>
        <OptionsContainer open={open}>
          {value ? (
            <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
          ) : null}
          {options?.map(({ address, balance, label, symbol }) => (
            <div key={address}>
              <Option
                address={address}
                balance={balance}
                label={label}
                selected={address === value}
                symbol={symbol}
                onClick={onChange}
              />
            </div>
          ))}
        </OptionsContainer>
      </RelativeContainer>
    </Container>
  );
};
