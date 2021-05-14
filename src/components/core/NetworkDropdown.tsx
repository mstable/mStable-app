import React, { FC, useCallback, useMemo } from 'react'
import { useKeyPress } from 'react-use'
import styled from 'styled-components'

import { ChainIds, useChainIdCtx, NETWORKS } from '../../context/NetworkProvider'

import { Dropdown } from './Dropdown'

const StyledDropdown = styled(Dropdown)`
  > *:first-child {
    background: ${({ theme }) => theme.color.background[1]};
  }

  > *:first-child:hover {
    background: ${({ theme }) => theme.color.background[2]};
  }

  * {
    font-size: 1rem;
  }
  p {
    font-size: 0.875rem;
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
