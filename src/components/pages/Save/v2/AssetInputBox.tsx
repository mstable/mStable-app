import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { Fields } from '../../../../types';
import { Widget } from '../../../core/Widget';
import { AssetTokenInput } from './AssetTokenInput';
import { useSaveDispatch, useSaveState } from './SaveProvider';

interface Props {
  className?: string;
  fieldType: Fields;
  title: string;
  showExchangeRate?: boolean;
}

const { Input } = Fields;

const ExchangeRate = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.grey};

  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`;

export const AssetInputBox: FC<Props> = ({
  fieldType,
  showExchangeRate = false,
  title,
  className,
}) => {
  const {
    exchange: { input, output, rate: exchangeRate },
    error,
  } = useSaveState();
  const { setToken, setInput, setMaxInput } = useSaveDispatch();

  const isInput = fieldType === Fields.Input;
  const field = isInput ? input : output;
  const inputToken = input.token;
  const outputToken = output.token;
  const tokensAvailable = inputToken?.symbol && outputToken?.symbol;

  const formattedExchangeRate = exchangeRate?.format(4);

  const tokenAddresses = useMemo<string[]>(() => {
    // TODO - this can probably be changed to compile list from bassets+massets?
    if (!(inputToken?.address && outputToken?.address)) return [];

    // add more here to create dropdown
    if (fieldType === Input) {
      return [inputToken.address];
    }
    return [outputToken.address];
  }, [fieldType, inputToken, outputToken]);

  return (
    <Widget
      className={className}
      title={title}
      border
      boldTitle
      headerContent={
        showExchangeRate &&
        tokensAvailable && (
          <ExchangeRate>
            <span>1</span>
            {` `}
            {input.token?.symbol}
            <span> = {formattedExchangeRate}</span>
            {` ${output.token?.symbol}`}
          </ExchangeRate>
        )
      }
    >
      <AssetTokenInput
        name={fieldType}
        amount={{
          formValue: field?.formValue,
          disabled: !isInput,
          handleChange: isInput ? setInput : undefined,
          handleSetMax: isInput ? setMaxInput : undefined,
        }}
        token={{
          address: field?.token?.address,
          addresses: tokenAddresses,
          // disabled: !isInput,
          handleChange: setToken,
        }}
        error={isInput ? error : undefined}
      />
    </Widget>
  );
};
