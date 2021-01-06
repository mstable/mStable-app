import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { TokenIcon } from '../icons/TokenIcon';
import { useTokens, useTokenSubscription } from '../../context/TokensProvider';
import { FontSize, ViewportWidth } from '../../theme';
import { SubscribedToken } from '../../types';

// TODO: - Create base component for SubscribedTokenInput & TokenInput and inherit.

interface Props {
  name: string;
  value: string | null;
  tokenAddresses: string[];
  onChange?(name: string, token?: SubscribedToken): void;
  error?: string;
  disabled?: boolean;
}

interface TokenOptionProps {
  address: string;
  symbol: string;
  selected?: boolean;
  onClick?(address: string): void;
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

const OptionContainer = styled.div<Pick<TokenOptionProps, 'selected'>>`
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

  ${Balance} {
    display: none;
  }
`;

const DownArrow = styled.div`
  padding: 4px;
`;

const Option: FC<TokenOptionProps> = ({
  address,
  symbol,
  selected,
  onClick,
}) => {
  const token = useTokenSubscription(address);
  const hasBalance = !!token?.balance.simple;
  const handleClick = useCallback(() => {
    onClick?.(address);
  }, [onClick, address]);
  return (
    <OptionContainer onClick={handleClick} selected={selected}>
      <TokenIcon symbol={symbol} />
      <TokenSymbol>
        {symbol}
        {hasBalance && <Balance>{token?.balance.format(2, true)}</Balance>}
      </TokenSymbol>
    </OptionContainer>
  );
};

const placeholderText = 'Select a token';

const Container = styled.div<Pick<Props, 'error' | 'disabled'>>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ error, theme }) =>
    error ? theme.color.redTransparenter : theme.color.white};
  outline: 0;
  border: 1px
    ${({ theme, error }) =>
      error ? theme.color.redTransparent : theme.color.blackTransparent}
    solid;
  border-radius: 3px;
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
 * @param name Name of the field, e.g. 'input'
 * @param error Error message
 * @param value Selected token address value (address)
 * @param tokens Available tokens (list of addresses)
 * @param onChange Optional callback for change event
 * @param disabled Optional flag to disable the input
 */
export const SubscribedTokenInput: FC<Props> = ({
  name,
  value,
  tokenAddresses,
  onChange,
  disabled = false,
  error,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const subscribedToken = useTokenSubscription(value);
  const subscribedTokens = useTokens(tokenAddresses);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      setOpen(!open);
    }
  }, [open, setOpen, disabled]);

  const handleUnset = useCallback(() => {
    if (open) {
      onChange?.(name, undefined);
    }
  }, [onChange, name, open]);

  const handleSelect = useCallback(
    (address: string) => {
      const selected = subscribedTokens.find(t => t.address === address);

      if (selected) {
        onChange?.(name, selected);
      }
    },
    [name, onChange, subscribedTokens],
  );

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
      onClick={handleClick}
      ref={container}
      error={error}
      disabled={disabled}
    >
      <Selected>
        {subscribedToken ? (
          <Option
            address={subscribedToken.address}
            symbol={subscribedToken.symbol}
          />
        ) : (
          <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
        )}
        {subscribedTokens.length > 1 && <DownArrow>▼</DownArrow>}
      </Selected>
      <RelativeContainer>
        <OptionsContainer open={open}>
          {value ? (
            <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
          ) : null}
          {subscribedTokens.map(({ address, symbol }) => (
            <div key={address}>
              <Option
                address={address}
                symbol={symbol}
                selected={address === value}
                onClick={handleSelect}
              />
            </div>
          ))}
        </OptionsContainer>
      </RelativeContainer>
    </Container>
  );
};