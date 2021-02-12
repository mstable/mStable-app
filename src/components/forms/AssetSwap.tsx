import React, { FC } from 'react';

import { AssetExchange, Props } from './AssetExchange';

export const AssetSwap: FC<Props> = ({
  inputAddressOptions,
  outputAddressOptions,
  error,
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
}) => {
  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      outputAddressOptions={outputAddressOptions}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      exchangeRate={exchangeRate}
      handleSetInputAddress={address => {
        handleSetInputAddress?.(address);
        if (address === outputAddress) {
          handleSetOutputAddress?.(inputAddress);
        }
      }}
      handleSetInputAmount={handleSetInputAmount}
      handleSetInputMax={handleSetInputMax}
      handleSetOutputAmount={handleSetOutputAmount}
      handleSetOutputMax={handleSetOutputMax}
      handleSetOutputAddress={address => {
        handleSetOutputAddress?.(address);
        if (address === inputAddress) {
          handleSetInputAddress?.(outputAddress);
        }
      }}
      outputAddress={outputAddress}
      outputFormValue={outputFormValue}
      error={error}
    >
      {children}
    </AssetExchange>
  );
};
