import React, { FC, useCallback, useMemo } from 'react'
import { useKeyPress } from 'react-use'
import styled from 'styled-components'

import { ChainIds, useChainIdCtx, NETWORKS } from '../../context/NetworkProvider'
import { ViewportWidth } from '../../theme'

import { Dropdown } from './Dropdown'

const StyledDropdown = styled(Dropdown)`
  * {
    font-size: 1rem;
  }
  p {
    font-size: 0.875rem;
  }

  > button > div {
    > div {
      display: none;
    }
    margin-right: 0.125rem;
  }
  > div {
    min-width: 3.5rem;
    > button > div > div {
      display: none;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > button > div {
      > div {
        display: inline-block;
      }
      margin-right: 0.5rem;
    }
    > div {
      min-width: 3.5rem;
      > button > div > div {
        display: inline-block;
      }
    }
`

export const NetworkDropdown: FC = () => {
  const [chainId, setChainId] = useChainIdCtx()
  const [isAltPressed] = useKeyPress('Alt')

  const handleSelect = useCallback(
    (_chainId: string) => {
      const parsed = parseInt(_chainId)
      setChainId(parsed > 0 ? (parsed as ChainIds) : 1)
    },
    [setChainId],
  )

  const options = useMemo(
    () =>
      Object.fromEntries(
        NETWORKS.filter(({ isTestnet, chainId: _chainId }) => _chainId === chainId || !isTestnet || isAltPressed).map(
          ({ protocolName, chainName, chainId: _chainId, isTestnet }) => [
            _chainId,
            {
              icon: { symbol: protocolName, hideNetwork: true },
              subtext: isTestnet ? chainName : undefined,
            },
          ],
        ),
      ),
    [chainId, isAltPressed],
  )

  return <StyledDropdown onChange={handleSelect} options={options} defaultOption={chainId?.toString()} />
}
