import React, { FC, ReactNode, useMemo, useRef } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import useOnClickOutside from 'use-onclickoutside'

import { UnstyledButton } from './Button'
import { ThemedSkeleton } from './ThemedSkeleton'
import { Chevron } from './Chevron'
import { TokenIcon, TokenPair } from '../icons/TokenIcon'
import { Tooltip } from './ReactTooltip'
import { AddressOption } from '../../types'

export interface DropdownOption {
  icon?: {
    symbol?: string
    hideNetwork?: boolean
  } // for TokenIcon use
  subtext?: ReactNode
  asset?: AddressOption
}

interface Props {
  className?: string
  defaultOption?: string
  options?: Record<string, DropdownOption>
  onChange?(title?: string): void
  disabled?: boolean
}

const Balance = styled.span`
  ${({ theme }) => theme.mixins.numeric};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
`

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  > div {
    display: flex;
    align-items: center;

    span {
      font-weight: 600;
    }

    > * svg {
      margin-left: 0.5rem;
    }
  }
`
const OptionContainer = styled(UnstyledButton)<{
  active?: boolean
  selected?: boolean
  disabled?: boolean
}>`
  display: flex;
  width: 100%;
  background: ${({ theme, selected, active }) => (selected && active ? `${theme.color.backgroundAccent}` : `none`)};
  text-align: left;
  padding: 0.5rem 0.5rem;
  align-items: center;
  font-size: 1.125rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  border-top-left-radius: ${({ active, selected }) => (active ? `0.75rem` : !selected ? 0 : `0.75rem`)};
  border-top-right-radius: ${({ active, selected }) => (active ? `0.75rem` : !selected ? 0 : `0.75rem`)};
  border-bottom-left-radius: ${({ active, selected }) => (active ? 0 : !selected ? 0 : `0.75rem`)};
  border-bottom-right-radius: ${({ active, selected }) => (active ? 0 : !selected ? 0 : `0.75rem`)};

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
`

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
  width: 100%;
`

const Container = styled.div`
  position: relative;
`

const Asset: FC<{ asset?: AddressOption }> = ({ asset }) => {
  if (!asset) return null
  const { tip, label, symbol, balance } = asset
  return (
    <>
      <div>
        <span>{label ?? symbol}</span>
        {tip && <Tooltip tip={tip} />}
      </div>
      {(balance?.simple ?? 0) > 0 && <Balance>{balance?.format(2, false)}</Balance>}
    </>
  )
}

const Option: FC<{
  selected?: boolean
  active?: boolean
  onClick: () => void
  option?: string
  options?: Record<string, DropdownOption>
  disabled?: boolean
}> = ({ onClick, option, options, selected = false, active = false, disabled }) => {
  if (!option)
    return (
      <OptionContainer active disabled>
        <ThemedSkeleton height={24} width={84} />
      </OptionContainer>
    )

  const { icon, subtext, asset } = options?.[option] ?? {}
  const { symbol, hideNetwork } = icon ?? {}
  const symbols = symbol?.split('/')

  return (
    <OptionContainer onClick={onClick} active={active} selected={selected} disabled={disabled}>
      {symbol && (symbols?.length ?? 0) < 2 ? <TokenIcon symbol={symbol} hideNetwork={hideNetwork} /> : <TokenPair symbols={symbols} />}
      <TokenDetails>
        {asset ? (
          <Asset asset={asset} />
        ) : (
          <>
            <div>
              <span>{symbol ?? option}</span>
            </div>
            {!!subtext && subtext}
          </>
        )}
      </TokenDetails>
      {Object.keys(options ?? {}).length > 1 && selected && <Chevron direction={active ? 'up' : 'down'} />}
    </OptionContainer>
  )
}

export const Dropdown: FC<Props> = ({ defaultOption, options, onChange, disabled, className }) => {
  const [show, toggleShow] = useToggle(false)

  const selected = useMemo(
    () =>
      defaultOption && options ? Object.keys(options).find(option => defaultOption.toLowerCase() === option.toLowerCase()) : undefined,
    [options, defaultOption],
  )

  const handleSelect = (option?: string): void => {
    toggleShow(false)
    onChange?.(option)
  }

  const container = useRef(null)
  useOnClickOutside(container, () => {
    toggleShow(false)
  })

  const isDropdown = options && Object.keys(options).length > 1

  return (
    <Container ref={container} className={className}>
      <Option
        onClick={() => {
          if (isDropdown) toggleShow()
        }}
        option={selected}
        options={options}
        selected
        active={show}
        disabled={disabled}
      />
      {options && (
        <OptionList hidden={!show}>
          {Object.keys(options)
            .filter(m => m !== selected)
            .map(option => (
              <Option key={option} onClick={() => handleSelect(option)} option={option} options={options} />
            ))}
        </OptionList>
      )}
    </Container>
  )
}
