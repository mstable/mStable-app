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
  useCurrentGasPriceType,
  useSetGasPriceType,
  useSetGasPrice,
  useManifest,
  useCurrentGasPrice,
} from './FormProvider';

interface Props {
  valid: boolean;
}

type GasPriceName = 'standard' | 'fast' | 'instant';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    padding-bottom: 16px;
    > :last-child {
      margin-right: 0;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  > :last-child {
    color: grey;
    opacity: 70%;
    ${({ theme }) => theme.mixins.numeric};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  background: white;
  color: rgb(37, 39, 45);
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  padding: 8px 16px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  border-radius: 3px;
  margin-bottom: 10px;
  width: 100%;
  > :first-child {
    padding-right: 10px;
  }
  @media (min-width: ${ViewportWidth.m}) {
    margin-bottom: 0;
    margin-right: 15px;
  }
`;

const PricesContent = styled.div`
  display: flex;
  ${({ theme }) => theme.mixins.numeric};
  p {
    margin-right: 10px;
  }
  > :last-child {
    color: grey;
    opacity: 70%;
  }
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
  width: 100%;
  outline: none;
  height: 20px;
  width: 40px;
  margin-right: 10px;
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    background: ${({ theme }) => theme.color.blueTransparent};
  }

  ${({ theme }) => theme.mixins.numeric};
`;

const gasPriceOptions: {
  type: GasPriceType;
  name?: GasPriceName;
  label: string;
}[] = [
  {
    type: GasPriceType.Standard,
    name: 'standard',
    label: 'STANDARD',
  },
  {
    type: GasPriceType.Fast,
    name: 'fast',
    label: 'FAST',
  },
  {
    type: GasPriceType.Instant,
    name: 'instant',
    label: 'INSTANT',
  },
  {
    type: GasPriceType.Custom,
    label: 'CUSTOM',
  },
];

export const GasPrice: FC<Props> = () => {
  const gasPrices = useGasPrices();
  const ethPrice = useEthPrice();
  const manifest = useManifest();
  const setGasPrice = useSetGasPrice();
  const setGasPriceType = useSetGasPriceType();
  const currentGasPriceType = useCurrentGasPriceType();
  const currentGasPrice = useCurrentGasPrice();
  const customTransactionFee =
    currentGasPriceType === GasPriceType.Custom &&
    currentGasPrice &&
    ethPrice &&
    manifest?.gasLimit
      ? (currentGasPrice / 1e9) *
        (ethPrice / 1e9) *
        manifest.gasLimit.toNumber()
      : undefined;
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      setGasPrice(parseFloat(event.target.value) * 1e9);
    },
    [setGasPrice],
  );
  const handleClick = (
    gasPriceType: GasPriceType,
    gasPriceValue: number,
  ): void => {
    setGasPriceType(gasPriceType);
    setGasPrice(gasPriceValue);
  };

  return (
    <Container>
      {gasPriceOptions.map(({ type, label, name }) => {
        const gasPrice = name && gasPrices ? gasPrices[name] : undefined;
        const transactionFee =
          gasPrice && ethPrice && manifest?.gasLimit
            ? gasPrice * (ethPrice / 1e9) * manifest.gasLimit.toNumber()
            : undefined;
        return (
          <ButtonContent key={type}>
            <ToggleInput
              checked={type === currentGasPriceType}
              onClick={() => handleClick(type, (gasPrice as number) * 1e9)}
              enabledColor={Color.green}
              disabledColor={Color.greyTransparent}
            />
            <div>
              <p>{label}</p>
              {type !== GasPriceType.Custom ? (
                <PricesContent>
                  <p>{gasPrice}</p>
                  <p>
                    {transactionFee ? `$${transactionFee.toFixed(2)}` : '$–'}
                  </p>
                </PricesContent>
              ) : (
                <FlexContainer>
                  <Input
                    disabled={type !== currentGasPriceType}
                    placeholder="10"
                    onChange={handleChange}
                  />
                  <p>
                    {customTransactionFee
                      ? `$${customTransactionFee.toFixed(2)}`
                      : '$–'}
                  </p>
                </FlexContainer>
              )}
            </div>
          </ButtonContent>
        );
      })}
    </Container>
  );
};
