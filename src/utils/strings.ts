import { ErrorCode } from '@ethersproject/logger'

export const truncateAddress = (address: string): string => `${address.slice(0, 6)}…${address.slice(-4)}`

export const humanizeList = (list: string[]): string =>
  list.length < 3 ? list.join(' and ') : `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`

interface EthersError extends Error {
  code?: ErrorCode
  error?: Error
}

const sanitizeEthersError = (error: EthersError): string => {
  let { message } = error

  switch (error.code) {
    case ErrorCode.UNPREDICTABLE_GAS_LIMIT: {
      if (error.error?.message) {
        break
      }
      return 'Unable to estimate gas'
    }
    case ErrorCode.INSUFFICIENT_FUNDS:
      return 'Insufficient funds'
    case ErrorCode.NETWORK_ERROR:
      return 'Network error'
    case ErrorCode.REPLACEMENT_UNDERPRICED:
      return 'Replacement transaction underpriced'
    case ErrorCode.TIMEOUT:
      return 'Timeout'
    default:
      break
  }

  if (error.error?.message) {
    message = error.error.message
  }

  return message.replace('execution reverted: ', '')
}

export const sanitizeMassetError = (error: EthersError): string => {
  const message = sanitizeEthersError(error)

  switch (message) {
    case 'Out of bounds':
      return 'This swap would exceed hard limits to maintain diversification. Try a different pair of assets or a smaller amount.'
    default:
      return message
  }
}
