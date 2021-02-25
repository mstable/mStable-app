import React, { FC, useMemo, useRef } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';

import { TokenIcon } from '../icons/TokenIcon';
import { UnstyledButton } from './Button';
import { TransactionOption } from '../../types';
import { ThemedSkeleton } from './ThemedSkeleton';
import { Chevron } from './Chevron';

interface Props {
  defaultAddress?: string;
  options?: TransactionOption[];
  onChange?(address?: string): void;
  disabled?: boolean;
  className?: string;
}

const ChevronContainer = styled.span<{ selected?: boolean; active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  opacity: ${({ selected }) => (selected ? 1 : 0)};

  svg {
    height: 8px;
    width: auto;
    margin-left: 0.5rem;
    transform: ${({ active }) => (active ? `rotate(180deg)` : `auto`)};
    transition: 0.1s ease-out transform;

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`;

const Balance = styled.span`
  ${({ theme }) => theme.mixins.numeric};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  > span:first-child {
    font-weight: bold;
  }
`;

const OptionContainer = styled(UnstyledButton)<{
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  width: 100%;
  background: ${({ theme, selected, active }) =>
    selected && active ? `${theme.color.accent}` : `none`};
  text-align: left;
  padding: 0.25rem 0.5rem;
  align-items: center;
  font-size: 1rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  border-top-left-radius: ${({ active, selected }) =>
    active ? `0.75rem` : !selected ? 0 : `0.75rem`};
  border-top-right-radius: ${({ active, selected }) =>
    active ? `0.75rem` : !selected ? 0 : `0.75rem`};
  border-bottom-left-radius: ${({ active, selected }) =>
    active ? 0 : !selected ? 0 : `0.75rem`};
  border-bottom-right-radius: ${({ active, selected }) =>
    active ? 0 : !selected ? 0 : `0.75rem`};

  &:hover {
    color: ${({ theme }) => theme.color.body};
    background: ${({ theme }) => theme.color.accent};
  }

  > * {
    margin-right: 0.5rem;
  }

  img {
    height: 32px;
    width: 32px;
  }
`;

const OptionList = styled.div`
  position: absolute;
  border-radius: 0.75rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: ${({ theme }) => theme.color.background};
  padding: 0.5rem 0;
  margin-top: -1px;
  border: 1px solid ${({ theme }) => theme.color.accent};
  min-width: 9.5rem;
  z-index: 2;
`;

const Container = styled.div<{
  chevronHidden?: boolean;
  hideTextMobile?: boolean;
}>`
  position: relative;
  min-width: ${({ chevronHidden }) => (chevronHidden ? `7.5rem` : `9.5rem`)};
`;

const Option: FC<{
  selected?: boolean;
  active?: boolean;
  onClick: () => void;
  option?: TransactionOption;
  disabled?: boolean;
  dropdownEnabled?: boolean;
}> = ({
  onClick,
  option,
  selected = false,
  active = false,
  disabled = false,
  dropdownEnabled = false,
}) => {
  if (!option)
    return (
      <OptionContainer active disabled>
        <ThemedSkeleton height={24} width={84} />
      </OptionContainer>
    );

  const { symbol, label, balance } = option;

  return (
    <OptionContainer
      onClick={onClick}
      active={active}
      selected={selected}
      disabled={disabled}
    >
      {symbol && <TokenIcon symbol={symbol} />}
      <TokenDetails>
        <span>{label ?? symbol}</span>
        {(balance?.simple ?? 0) > 0 && (
          <Balance>{balance?.format(4, false)}</Balance>
        )}
      </TokenDetails>
      {dropdownEnabled && (
        <ChevronContainer selected={selected} active={active}>
          <Chevron direction={active ? 'up' : 'down'} />
        </ChevronContainer>
      )}
    </OptionContainer>
  );
};

export const AssetDropdown: FC<Props> = ({
  defaultAddress,
  options,
  onChange,
  disabled,
  className,
}) => {
  const [show, toggleShow] = useToggle(false);

  const selected = useMemo(
    () =>
      defaultAddress && options
        ? options.find(option => defaultAddress === option.address)
        : undefined,
    [options, defaultAddress],
  );

  const handleSelect = (address?: string): void => {
    toggleShow(false);
    onChange?.(address);
  };

  const container = useRef(null);
  useOnClickOutside(container, () => {
    toggleShow(false);
  });

  const isDropdown = (options?.length ?? 0) > 1;

  return (
    <Container
      ref={container}
      chevronHidden={!isDropdown}
      className={className}
    >
      <Option
        onClick={() => {
          if (isDropdown) toggleShow();
        }}
        option={selected}
        selected
        active={show}
        disabled={disabled}
        dropdownEnabled={isDropdown}
      />
      {options && (
        <OptionList hidden={!show}>
          {options
            .filter(m => m.address !== selected?.address)
            .map(option => (
              <Option
                key={option?.symbol}
                onClick={() => handleSelect(option?.address)}
                option={option}
              />
            ))}
        </OptionList>
      )}
    </Container>
  );
};
