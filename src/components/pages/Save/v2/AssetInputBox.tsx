import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { Fields } from '../../../../types';
import { AssetTokenInput } from './AssetTokenInput';
import { useSaveDispatch, useSaveState } from './SaveProvider';

interface Props {
  fieldType: Fields;
  title: string;
  showExchangeRate?: boolean;
  className?: string;
}

const { Input } = Fields;

const Container = styled.div`
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 0.75rem;
`;

const Header = styled.div`
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;

  h3 {
    font-weight: 600;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.black};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.grey};
  }
`;

const Body = styled.div`
  padding: 0.75rem;
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
    <Container className={className}>
      <Header>
        <h3>{title}</h3>
        {showExchangeRate && tokensAvailable && (
          <p>
            {`1 ${input.token?.symbol} = ${formattedExchangeRate} ${output.token?.symbol}`}
          </p>
        )}
      </Header>
      <Body>
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
      </Body>
    </Container>
  );
};
