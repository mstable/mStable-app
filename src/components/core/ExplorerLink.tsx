import React, { FC } from 'react'

import { useGetExplorerUrl } from '../../context/NetworkProvider'
import { truncateAddress } from '../../utils/strings'
import { ExternalLink } from './ExternalLink'

export const ExplorerLink: FC<{
  data: string
  type?: 'transaction' | 'account' | 'address' | 'token'
  truncate?: boolean
  showData?: boolean
}> = ({ children, type = 'address', data, showData, truncate = true }) => {
  const getExplorerUrl = useGetExplorerUrl()
  return (
    <ExternalLink href={getExplorerUrl(data, type)} title={`View ${type} on Etherscan`}>
      {children || (showData ? (truncate ? truncateAddress(data) : data) : null)}
    </ExternalLink>
  )
}
