import React, { FC, useMemo, useRef } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';

import { UnstyledButton } from './Button';
import { ThemedSkeleton } from './ThemedSkeleton';
import { Chevron } from './Chevron';

interface Props {
  defaultOption?: string;
  options?: string[];
  onChange?(title?: string): void;
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

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  > span:first-child {
    font-weight: 600;
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
    selected && active ? `${theme.color.backgroundAccent}` : `none`};
  text-align: left;
  padding: 0.5rem 0.5rem;
  align-items: center;
  font-size: 1.25rem;
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
    background: ${({ theme }) => theme.color.backgroundAccent};
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
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  min-width: 5.5rem;
  z-index: 2;
`;

const Container = styled.div`
  position: relative;
`;

const Option: FC<{
  selected?: boolean;
  active?: boolean;
  onClick: () => void;
  option?: string;
}> = ({ onClick, option, selected = false, active = false }) => {
  if (!option)
    return (
      <OptionContainer active disabled>
        <ThemedSkeleton height={24} width={84} />
      </OptionContainer>
    );

  return (
    <OptionContainer onClick={onClick} active={active} selected={selected}>
      <TokenDetails>
        <span>{option}</span>
      </TokenDetails>
      <ChevronContainer selected={selected} active={active}>
        <Chevron direction={active ? 'up' : 'down'} />
      </ChevronContainer>
    </OptionContainer>
  );
};

export const Dropdown: FC<Props> = ({
  defaultOption,
  options,
  onChange,
  className,
}) => {
  const [show, toggleShow] = useToggle(false);

  const selected = useMemo(
    () =>
      defaultOption && options
        ? options.find(
            option => defaultOption.toLowerCase() === option.toLowerCase(),
          )
        : undefined,
    [options, defaultOption],
  );

  const handleSelect = (option?: string): void => {
    toggleShow(false);
    onChange?.(option);
  };

  const container = useRef(null);
  useOnClickOutside(container, () => {
    toggleShow(false);
  });

  const isDropdown = (options?.length ?? 0) > 1;

  return (
    <Container ref={container} className={className}>
      <Option
        onClick={() => {
          if (isDropdown) toggleShow();
        }}
        option={selected}
        selected
        active={show}
      />
      {options && (
        <OptionList hidden={!show}>
          {options
            .filter(m => m !== selected)
            .map(option => (
              <Option
                key={option}
                onClick={() => handleSelect(option)}
                option={option}
              />
            ))}
        </OptionList>
      )}
    </Container>
  );
};
