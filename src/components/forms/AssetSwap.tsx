import React, { FC } from 'react'

import { AssetExchange, Props } from './AssetExchange'

export const AssetSwap: FC<Props> = ({
  inputAddressOptions,
  outputAddressOptions,
  exchangeRate,
  handleSetInputAddress,
  handleSetInputAmount,
  handleSetInputMax,
  handleSetOutputAddress,
  handleSetOutputAmount,
  handleSetOutputMax,
  inputAddress,
  inputFormValue,
  outputAddress,
  outputFormValue,
  children,
  className,
  isFetching,
  inputDecimals,
}) => {
  return (
    <AssetExchange
      className={className}
      inputAddressOptions={inputAddressOptions}
      outputAddressOptions={outputAddressOptions}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      exchangeRate={exchangeRate}
      handleSetInputAddress={address => {
        handleSetInputAddress?.(address)
        if (address === outputAddress) {
          handleSetOutputAddress?.(inputAddress)
        }
      }}
      handleSetInputAmount={handleSetInputAmount}
      handleSetInputMax={handleSetInputMax}
      handleSetOutputAmount={handleSetOutputAmount}
      handleSetOutputMax={handleSetOutputMax}
      handleSetOutputAddress={address => {
        handleSetOutputAddress?.(address)
        if (address === inputAddress) {
          handleSetInputAddress?.(outputAddress)
        }
      }}
      outputAddress={outputAddress}
      outputFormValue={outputFormValue}
      isFetching={isFetching}
      inputDecimals={inputDecimals}
    >
      {children}
    </AssetExchange>
  )
}
