import React, { FC, ChangeEventHandler, useCallback } from 'react';
import styled from 'styled-components';

import { ToggleInput } from '../ToggleInput';
import { Color, ViewportWidth } from '../../../theme';
import {
  useGasPrices,
  useEthPrice,
} from '../../../context/TransactionsProvider';
import {
  GasPriceType,
  useSetGasPrice,
  useManifest,
  useCurrentGasPrice,
} from './FormProvider';

interface Props {
  valid: boolean;
}

type GasPriceName = 'standard' | 'fast' | 'instant';

const OPTIONS: {
  type: GasPriceType;
  name?: GasPriceName;
  label: string;
}[] = [
  {
    type: GasPriceType.Standard,
    name: 'standard',
    label: 'Standard',
  },
  {
    type: GasPriceType.Fast,
    name: 'fast',
    label: 'Fast',
  },
  {
    type: GasPriceType.Instant,
    name: 'instant',
    label: 'Instant',
  },
  {
    type: GasPriceType.Custom,
    label: 'Custom',
  },
];

const ToggleLabel = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  > span:last-child {
    font-weight: bold;
  }
`;

const Price = styled.div`
  ${({ theme }) => theme.mixins.numeric}
`;

const Fee = styled(Price)`
  color: grey;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PricesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input<{ error?: string | void; disabled?: boolean }>`
  appearance: none;
  background: ${({ theme, disabled }) =>
    disabled ? theme.color.blackTransparenter : theme.color.white};

  border: ${({ theme, disabled }) =>
    `1px ${
      disabled ? theme.color.blackTransparent : 'rgba(0, 0, 0, 0.5)'
    } solid`};

  color: ${({ theme, disabled }) => (disabled ? '#404040' : theme.color.black)};
  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  min-width: 0;
  outline: none;
  height: 1.5rem;
  width: 4rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    background: ${({ theme }) => theme.color.blueTransparent};
  }

  ${({ theme }) => theme.mixins.numeric};
`;

const GasPriceOption = styled.div<{ checked: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
  min-height: 58px;
  background: white;
  color: rgb(37, 39, 45);
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px
    ${({ theme, checked }) =>
      checked ? theme.color.greenTransparent : theme.color.lightGrey}
    solid;
  border-radius: 1rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    padding-bottom: 1rem;
  }
`;

export const GasPriceSelector: FC<Props> = () => {
  const gasPrices = useGasPrices();
  const ethPrice = useEthPrice();
  const manifest = useManifest();
  const setGasPrice = useSetGasPrice();
  const currentGasPrice = useCurrentGasPrice();

  const customTransactionFee =
    currentGasPrice.type === GasPriceType.Custom &&
    currentGasPrice.value &&
    ethPrice &&
    manifest?.gasLimit
      ? (currentGasPrice.value / 1e9) *
        (ethPrice / 1e9) *
        manifest.gasLimit.toNumber()
      : undefined;

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      setGasPrice({ value: parseFloat(event.target.value) * 1e9 });
    },
    [setGasPrice],
  );

  return (
    <Container>
      {OPTIONS.map(({ type, label, name }) => {
        const gasPrice = name && gasPrices ? gasPrices[name] : undefined;
        const transactionFee =
          gasPrice && ethPrice && manifest?.gasLimit
            ? gasPrice * (ethPrice / 1e9) * manifest.gasLimit.toNumber()
            : undefined;
        const checked = type === currentGasPrice.type;
        return (
          <GasPriceOption key={type} checked={checked}>
            <ToggleLabel>
              <ToggleInput
                checked={checked}
                onClick={() => {
                  setGasPrice({ value: (gasPrice as number) * 1e9, type });
                }}
                enabledColor={Color.green}
                disabledColor={Color.greyTransparent}
              />
              <span>{label}</span>
            </ToggleLabel>
            <div>
              {type !== GasPriceType.Custom ? (
                <PricesContent>
                  <Price>{gasPrice?.toFixed(2)}</Price>
                  <Fee>
                    {transactionFee ? `$${transactionFee.toFixed(2)}` : '–'}
                  </Fee>
                </PricesContent>
              ) : (
                <InputContainer>
                  <Input
                    disabled={type !== currentGasPrice.type}
                    placeholder="10"
                    onChange={handleChange}
                  />
                  <Fee>
                    {customTransactionFee
                      ? `$${customTransactionFee.toFixed(2)}`
                      : '$–'}
                  </Fee>
                </InputContainer>
              )}
            </div>
          </GasPriceOption>
        );
      })}
    </Container>
  );
};
