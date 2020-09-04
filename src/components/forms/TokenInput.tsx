import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { TokenDetailsFragment } from '../../graphql/mstable';
import { TokenIcon } from '../icons/TokenIcon';
import { useToken } from '../../context/DataProvider/TokensProvider';
import { ViewportWidth } from '../../theme';

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
  align-items: center;
  height: 46px;

  padding: ${({ theme }) => theme.spacing.xs};

  background: ${({ selected, theme }) =>
    selected ? theme.color.blueTransparent : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.color.blueTransparent};
  }

  > :first-child {
    padding-right: 6px;
  }

  img {
    width: 36px;
  }
`;

const Placeholder = styled(OptionContainer)`
  font-size: ${({ theme }) => theme.fontSize.m};
`;

const Option: FC<TokenOptionProps> = ({
  address,
  symbol,
  selected,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(address);
  }, [onClick, address]);
  return (
    <OptionContainer onClick={handleClick} selected={selected}>
      <TokenIcon symbol={symbol} />
      <div>{symbol}</div>
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
  font-size: ${({ theme }) => theme.fontSize.m};
  font-weight: bold;
  height: 3rem;
  user-select: none;
  min-width: 100px;
  
  ${OptionContainer}:hover {
    background: transparent;
  }

  @media (min-width: ${ViewportWidth.s}) {
    min-width: 145px;
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
      {token ? (
        <Option address={token.address} symbol={token.symbol} />
      ) : (
        <Placeholder onClick={handleUnset}>{placeholderText}</Placeholder>
      )}
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
