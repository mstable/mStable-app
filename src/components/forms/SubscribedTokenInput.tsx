import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';

import { BigDecimal } from '../../web3/BigDecimal';
import { useTokenSubscription } from '../../context/TokensProvider';
import { TokenIcon } from '../icons/TokenIcon';
import { FontSize, ViewportWidth } from '../../theme';

// TODO: - Create base component for SubscribedTokenInput & TokenInput and inherit.

interface Props {
  value?: string;
  options?: { address: string; balance?: BigDecimal; label?: string }[];
  onChange?(tokenAddress?: string): void;
  error?: string;
  disabled?: boolean;
}

const RelativeContainer = styled.div`
  position: relative;
  overflow: visible;
`;

const TokenSymbol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
`;

const Balance = styled.div`
  font-size: ${FontSize.s};
  font-weight: normal;
  text-overflow: ellipsis;
`;

const OptionsContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  z-index: 2;

  // Offset parent border, even with box-sizing: border-box
  top: -1px;
  left: -1px;
  right: -1px;

  background: ${({ theme }) => theme.color.white};
  border: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  border-radius: 0 0 4px 4px;
`;

const OptionContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ selected, theme }) =>
    selected ? theme.color.blueTransparent : 'transparent'};

  img {
    padding-right: 6px;
    width: 36px;
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
  selected?: boolean;
  onClick?(address: string): void;
}> = ({ address, balance: _balance, label, selected, onClick }) => {
  const token = useTokenSubscription(address);
  const balance = _balance ?? token?.balance;
  return (
    <OptionContainer
      onClick={() => {
        onClick?.(address);
      }}
      selected={selected}
    >
      {token?.symbol && <TokenIcon symbol={token.symbol} />}
      <TokenSymbol>
        {label ?? token?.symbol}
        {!!balance?.simple && <Balance>{balance.format(2, true)}</Balance>}
      </TokenSymbol>
    </OptionContainer>
  );
};

const placeholderText = 'Select';

const Container = styled.div<Pick<Props, 'error' | 'disabled'>>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ error, theme }) =>
    error ? theme.color.redTransparenter : theme.color.white};
  outline: 0;
  border: 1px
    ${({ theme, error }) =>
      error ? theme.color.redTransparent : theme.color.blackTransparent}
    solid;
  border-radius: 1rem;
  color: ${({ theme }) => theme.color.black};
  font-size: ${FontSize.s};
  font-weight: bold;
  height: 3rem;
  user-select: none;
  min-width: 100px;

  @media (min-width: ${ViewportWidth.s}) {
    min-width: 145px;
    font-size: ${FontSize.m};
  }
`;

/**
 * TokenInput form component
 * Select a token from a given list of tokens.
 *
 * @param error Error message
 * @param value Selected token address value (address)
 * @param options Available tokens (list of addresses or { address, balance })
 * @param onChange Optional callback for change event
 * @param disabled Optional flag to disable the input
 */
export const SubscribedTokenInput: FC<Props> = ({
  value,
  options,
  onChange,
  disabled = false,
  error,
}) => {
  const [open, setOpen] = useState<boolean>(false);

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

  useEffect(() => {
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
    >
      <Selected>
        {value ? (
          <Option address={value} />
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
          {options?.map(({ address, balance, label }) => (
            <div key={address}>
              <Option
                address={address}
                balance={balance}
                label={label}
                selected={address === value}
                onClick={onChange}
              />
            </div>
          ))}
        </OptionsContainer>
      </RelativeContainer>
    </Container>
  );
};
