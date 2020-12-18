import React, { FC, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Fields } from '../../../../types';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { useSaveDispatch, useSaveState } from './SaveProvider';

interface Props {
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

export const AssetInputBox: FC<Props> = ({ fieldType }) => {
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
  const title = fieldType === Input ? 'Deposit' : 'Receive';

  // useEffect(() => {
  //   if (!(bAssets && massetState)) return;

  //   // const token = fieldType === Input ? massetState.token : bAssets[''];

  //   // how to get imusd
  //   setToken(fieldType, {
  //     address: massetState.token.address,
  //     decimals: massetState.token.decimals,
  //     symbol: massetState.token.symbol,
  //   });
  // }, [setToken, bAssets, field.token, fieldType, massetState]);

  const tokenAddresses = useMemo<string[]>(() => {
    if (!(bAssets && massetAddress)) return [];

    // where is mapping defined?
    return [massetAddress, '0x5b7f01dAe6BCE656c9cA4175Eb3E406ADC6c7957'];
  }, [bAssets, massetAddress]);

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
