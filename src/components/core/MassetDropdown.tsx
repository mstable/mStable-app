import React, { FC, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useLocation } from 'react-use'

import { useDataState } from '../../context/DataProvider/DataProvider'
import { useSelectedMasset, useSelectedMassetName, useSetSelectedMassetName } from '../../context/MassetProvider'
import { MassetName } from '../../types'
import { Dropdown, DropdownOption } from './Dropdown'
import { ViewportWidth } from '../../theme'

const StyledDropdown = styled(Dropdown)`
  > *:first-child {
    background: ${({ theme }) => theme.color.background[1]};
  }

  > *:first-child:hover {
    background: ${({ theme }) => theme.color.background[2]};
  }

  img {
    box-shadow: 0 0 8px ${({ theme }) => theme.color.background[3]};
    border-radius: 1rem;
  }

  * {
    margin-right: 0 !important;
  }

  > button > div:nth-child(2),
  > div > button > div:nth-child(2) {
    display: none;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > button > div {
      > div {
        display: flex;
      }
      margin-right: 0.5rem;
    }
    > div {
      min-width: 3.5rem;
      > button > div > div {
        display: flex;
      }
    }
  }
`

export const MassetDropdown: FC<{ className?: string }> = ({ className }) => {
  const dataState = useDataState()
  const history = useHistory()
  const [selected, setMassetName] = useSelectedMasset()

  const options = useMemo<Record<string, DropdownOption>>(
    () =>
      Object.fromEntries([
        ...Object.values(dataState).map(massetState => [
          massetState.token.symbol,
          {
            icon: {
              symbol: massetState.token.symbol,
              hideNetwork: true,
            },
          },
        ]),
      ]),
    [dataState],
  )

  // Handle the masset changing directly from the URL
  const setSelectedMassetName = useSetSelectedMassetName()
  const massetName = useSelectedMassetName()
  const location = useLocation()
  useEffect(() => {
    const massetNameInUrl = location.hash?.match(/^#\/(musd|mbtc)\//)?.[1] as MassetName | undefined
    if (massetNameInUrl && massetNameInUrl !== massetName) {
      setSelectedMassetName(massetNameInUrl)
    }
  }, [location, massetName, setSelectedMassetName])

  return (
    <StyledDropdown
      className={className}
      onChange={(selectedAddress?: string): void => {
        if (!selectedAddress) return

        const slug = Object.keys(options)
          .find(address => address === selectedAddress)
          ?.toLowerCase() as MassetName

        setMassetName(slug as MassetName)

        const tab = window.location.hash.split('/')[2]
        history.push(`/${slug}/${tab}`)
      }}
      options={options}
      defaultOption={dataState[selected]?.token?.symbol}
    />
  )
}
