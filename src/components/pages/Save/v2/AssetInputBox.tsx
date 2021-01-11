import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { Fields } from '../../../../types';
import { Widget } from '../../../core/Widget';
import { AssetTokenInput } from './AssetTokenInput';
import { useSaveDispatch, useSaveState } from './SaveProvider';
import { SaveMode } from './types';
import { BigDecimal } from '../../../../web3/BigDecimal';

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

// TODO simplify (overspecified)
export const AssetInputBox: FC<Props> = ({
  fieldType,
  showExchangeRate = false,
  title,
  className,
}) => {
  const { setToken, setInput, setMaxInput } = useSaveDispatch();

  const {
    massetState,
    mode,
    exchange: { input, output, rate: exchangeRate },
    error,
  } = useSaveState();

  const massetAddress = massetState?.address;
  const saveAddress = massetState?.savingsContracts.v2?.address;
  const vaultAddress =
    massetState?.savingsContracts.v2?.boostedSavingsVault?.address;
  const inputAddress = input.token?.address;

  const isInput = fieldType === Fields.Input;
  const field = isInput ? input : output;

  const formattedExchangeRate = exchangeRate?.format(4);

  // TODO support fewer options with separate forms (this is overspecified)
  const options = useMemo<
    { address: string; balance?: BigDecimal; label?: string }[]
  >(() => {
    if (!vaultAddress || !saveAddress || !massetAddress) return [];

    // TODO read vault balance
    const vaultBalance = new BigDecimal(0);

    const vaultOption = {
      address: vaultAddress,
      label: 'Vault',
      balance: vaultBalance,
    };
    const massetOption = { address: massetAddress };
    const saveOption = { address: saveAddress };

    if (mode === SaveMode.Deposit) {
      if (fieldType === Input) {
        return [massetOption, saveOption];
      }

      return inputAddress === massetAddress ? [saveOption] : [vaultOption];
    }

    if (fieldType === Input) {
      return [saveOption, vaultOption];
    }

    return inputAddress === saveAddress ? [massetOption] : [saveOption];
  }, [fieldType, inputAddress, massetAddress, mode, saveAddress, vaultAddress]);

  return (
    <Widget
      className={className}
      title={title}
      border
      boldTitle
      headerContent={
        showExchangeRate &&
        input.token &&
        output.token && (
          <ExchangeRate>
            <span>1</span>
            {` `}
            {input.token.symbol}
            <span> = {formattedExchangeRate}</span>
            {` ${output.token.symbol}`}
          </ExchangeRate>
        )
      }
    >
      <AssetTokenInput
        amount={{
          formValue: field?.formValue,
          disabled: !isInput,
          handleChange: isInput ? setInput : undefined,
          handleSetMax: isInput ? setMaxInput : undefined,
        }}
        token={{
          address: field?.token?.address,
          options,
          // disabled: !isInput,
          handleChange: address => {
            setToken(fieldType, address);
          },
        }}
        error={isInput ? error : undefined}
      />
    </Widget>
  );
};
