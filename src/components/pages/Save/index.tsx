import React, { FC } from 'react'
import { useChainIdCtx, ChainIds } from '../../../context/NetworkProvider'

import { EthereumSave } from './EthereumSave'
import { PolygonSave } from './PolygonSave'

export const Save: FC = () => {
  const [chainId] = useChainIdCtx()
  return chainId === ChainIds.EthereumMainnet ? <EthereumSave /> : <PolygonSave />
}
