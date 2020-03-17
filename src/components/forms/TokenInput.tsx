import React, { ChangeEventHandler, FC, useCallback } from 'react';
import { TokenDetailsFragment } from '../../graphql/generated';

interface Props {
  value: string | null;
  tokens: TokenDetailsFragment[];
  onChange?(token: string): void;
  disabled?: boolean;
}

/**
 * TokenInput form component
 * Select a token from a given list of tokens.
 *
 * @param value Selected token address value (address)
 * @param tokens Available tokens (list of addresses)
 * @param onChange Optional callback for change event
 * @param disabled Optional flag to disable the input
 */
export const TokenInput: FC<Props> = ({
  value,
  tokens,
  onChange,
  disabled = false,
}) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    event => {
      onChange?.(event.target.value);
    },
    [onChange],
  );
  return (
    <select onChange={handleChange} value={value || ''} disabled={disabled}>
      {tokens.map(token => (
        <option key={token.address}>{token.symbol}</option>
      ))}
    </select>
  );
};
