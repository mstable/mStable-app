import React, { FC, useMemo } from 'react';

import { useTokens, useTokenSubscription } from '../../context/TokensProvider';
import { Dropdown } from '../core/Dropdown';
import { TransactionOption } from '../../types';

interface Props {
  value?: string;
  options?: TransactionOption[];
  onChange?(tokenAddress?: string): void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const SubscribedTokenInput: FC<Props> = ({
  value,
  options: _options,
  onChange,
  disabled = false,
}) => {
  const token = useTokenSubscription(value);
  const tokens = useTokens(
    _options
      ?.filter(option => !option.custom)
      .map(option => option.address ?? '') ?? [],
  );

  const options = useMemo(
    () =>
      _options
        ? [...tokens, ..._options.filter(option => option.custom)]
        : [
            {
              address: token?.address,
              balance: token?.balance,
              symbol: token?.symbol,
            },
          ],
    [_options, token, tokens],
  );

  return (
    <Dropdown
      onChange={onChange}
      options={options}
      defaultAddress={value}
      disabled={disabled}
    />
  );
};
