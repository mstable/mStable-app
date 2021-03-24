import React, { FC, useMemo } from 'react';

import { useTokens, useTokenSubscription } from '../../context/TokensProvider';
import { AssetDropdown } from '../core/AssetDropdown';
import { AddressOption } from '../../types';

interface Props {
  value?: string;
  options?: (AddressOption | string)[];
  onChange?(tokenAddress?: string): void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const SubscribedTokenInput: FC<Props> = ({
  value,
  options: _options = [],
  onChange,
  disabled = false,
}) => {
  // Subscribe to the selected token
  const token = useTokenSubscription(value);

  // Subscribe the other options
  const tokens = useTokens(
    _options
      .filter(
        (option: AddressOption | string) =>
          typeof option === 'string' || !option.custom,
      )
      .map(option => (typeof option === 'string' ? option : option.address)),
  );

  const options = useMemo<AddressOption[]>(
    () =>
      // Merge selected token, subscribed options and custom options & filter out token duplication
      [
        token,
        ...tokens.filter(t => t.address !== token?.address),
        ..._options.filter(
          option => typeof option !== 'string' && option.custom,
        ),
      ].filter(Boolean) as AddressOption[],
    [_options, token, tokens],
  );

  return (
    <AssetDropdown
      onChange={onChange}
      addressOptions={options}
      defaultAddress={value}
      disabled={disabled}
    />
  );
};
