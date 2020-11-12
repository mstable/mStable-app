import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { TokenDetailsFragment } from '../../graphql/protocol';
import { TokenIcon } from '../icons/TokenIcon';
import { useToken } from '../../context/DataProvider/TokensProvider';
import { FontSize, ViewportWidth } from '../../theme';

interface Props {
  name: string;
  value: string | null;
  tokens: TokenDetailsFragment[];
  onChange?(name: string, token: TokenDetailsFragment | null): void;
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

const Token = styled.div`
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
  z-index: 1;

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
  const token = useToken(address);
  const hasBalance = !!token?.balance.simple;
  const handleClick = useCallback(() => {
    onClick?.(address);
  }, [onClick, address]);
  return (
    <OptionContainer onClick={handleClick} selected={selected}>
      <TokenIcon symbol={symbol} />
      <Token>
        {symbol}
        {hasBalance && <Balance>{token?.balance.format(2, true)}</Balance>}
      </Token>
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
export const TokenInput: FC<Props> = ({
  name,
  value,
  tokens,
  onChange,
  disabled = false,
  error,
}) => {
  const [open, setOpen] = useState<boolean>(false);

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
      onChange?.(name, null);
    }
  }, [onChange, name, open]);

  const handleSelect = useCallback(
    (address: string) => {
      const selected = tokens.find(t => t.address === address);
      if (selected) {
        onChange?.(name, selected);
      }
    },
    [onChange, name, tokens],
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

  const token = useToken(value);

  return (
    <Container
      onClick={handleClick}
      ref={container}
      error={error}
      disabled={disabled}
    >
      <Selected>
        {token ? (
          <Option address={token.address} symbol={token.symbol} />
        ) : (
          <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
        )}
        {tokens.length > 1 && <DownArrow>▼</DownArrow>}
      </Selected>
      <RelativeContainer>
        <OptionsContainer open={open}>
          {value ? (
            <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
          ) : null}
          {tokens.map(({ address, symbol }) => (
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
