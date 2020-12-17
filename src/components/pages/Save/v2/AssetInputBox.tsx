import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Fields } from '../../../../types';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { useSaveDispatch, useSaveState } from './SaveProvider';

interface Props {
  title: string;
  fieldType: Fields;
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

export const AssetInputBox: FC<Props> = ({ title, fieldType }) => {
  const {
    exchange: { input, output }, // feeAmountSimple
    // inputError,
    // outputError,
    needsUnlock,
    massetState,
  } = useSaveState();
  const { setToken } = useSaveDispatch();

  const { address: massetAddress, bAssets = {} } = massetState || {};
  const field = fieldType === Input ? input : output;

  const tokenAddresses = useMemo<string[]>(() => {
    if (!(bAssets && massetAddress)) return [];

    const bassetAddresses = Object.keys(bAssets).sort();
    return fieldType === Input
      ? bassetAddresses
      : [massetAddress, ...bassetAddresses];
  }, [bAssets, fieldType, massetAddress]);

  const approveAmount = useMemo(
    () =>
      field.amount.exact && field.token.decimals
        ? new BigDecimal(field.amount.exact, field.token.decimals)
        : undefined,
    [field.amount, field.token.decimals],
  );

  const handleSetMax = (): void => {
    // switch on fieldType
  };

  return (
    <Container>
      <Header>
        <h3>{title}</h3>
        <p>{field.token.symbol}</p>
      </Header>
      <Body>
        <TokenAmountInput
          amountValue={field.formValue}
          approveAmount={approveAmount}
          tokenAddresses={tokenAddresses}
          tokenValue={field.token.address}
          name={fieldType}
          onChangeAmount={undefined} // setInputQuantity
          onChangeToken={setToken}
          onSetMax={handleSetMax}
          needsUnlock={needsUnlock}
          error={undefined} // inputError
          spender={massetAddress}
          showBalance={false}
        />
      </Body>
    </Container>
  );
};
