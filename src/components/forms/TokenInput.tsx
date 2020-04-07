import React, { ChangeEventHandler, FC, useCallback } from 'react';
import { TokenDetailsFragment } from '../../graphql/generated';
import { Select } from '../core/Select';

interface Props {
  name: string;
  value: string | null;
  tokens: TokenDetailsFragment[];
  onChange?(name: string, token: TokenDetailsFragment | null): void;
  disabled?: boolean;
}

const UNSET = 'UNSET';

/**
 * TokenInput form component
 * Select a token from a given list of tokens.
 *
 * @param name @TODO
 * @param value Selected token address value (address)
 * @param tokens Available tokens (list of addresses)
 * @param onChange Optional callback for change event
 * @param disabled Optional flag to disable the input
 */
export const TokenInput: FC<Props> = ({
  name,
  value,
  tokens,
  onChange,
  disabled = false,
}) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    event => {
      if (!onChange) return;

      const selection = event.target.value;

      if (selection === UNSET) {
        onChange(name, null);
        return;
      }

      const token = tokens.find(t => t.address === selection);
      if (token) onChange(name, token);
    },
    [onChange, tokens, name],
  );
  return (
    <Select onChange={handleChange} value={value || ''} disabled={disabled}>
      <option key={UNSET} value={UNSET}>
        Select a token
      </option>
      {tokens.map(token => (
        <option key={token.address} value={token.address}>
          {token.symbol}
        </option>
      ))}
    </Select>
  );
};
