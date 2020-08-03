import React, { FC, useCallback, useState } from 'react';
import { BigNumber } from 'ethers/utils';
import { MaxUint256 } from 'ethers/constants';

import styled from 'styled-components';
import { useFormId } from './TransactionForm/FormProvider';
import { useErc20Contract } from '../../context/DataProvider/ContractsProvider';
import {
  useHasPendingApproval,
  useSendTransaction,
} from '../../context/TransactionsProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { Button } from '../core/Button';
import { Color, Size } from '../../theme';
import { Interfaces, SendTxManifest } from '../../types';
import { AmountInput } from './AmountInput';

interface Props {
  address: string;
  amount?: BigDecimal;
  decimals?: number;
  spender: string;
}

const StyledButton = styled(Button)`
  padding-left: 4px;
  padding-right: 4px;
  font-size: 12px;
`;

const MaxButton = styled(StyledButton)<{ active?: boolean }>`
  background-color: ${({ active, theme }) =>
    active ? theme.color.green : theme.color.white};
`;

const StyledAmountInput = styled(AmountInput)`
  font-size: 12px;
  height: 100%;
  margin: 0 4px;
  padding: 4px;
` as typeof AmountInput;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  background: ${Color.offWhite};
  border-radius: 2px;
  border: 1px ${Color.blackTransparent} solid;
  min-width: 200px;
`;

export const ApproveButton: FC<Props> = ({
  address,
  amount,
  decimals,
  spender,
}) => {
  const sendTransaction = useSendTransaction();
  const tokenContract = useErc20Contract(address);
  const formId = useFormId();
  const pending = useHasPendingApproval(address, spender);

  const [approveAmount, setApproveAmount] = useState<BigDecimal | undefined>(
    amount || new BigDecimal(MaxUint256, 18),
  );
  const [approveFormValue, setApproveFormValue] = useState<string | null>(
    amount?.string || null,
  );

  const handleApprove = useCallback((): void => {
    if (!(tokenContract && spender && approveAmount?.exact.gt(0))) return;

    const manifest: SendTxManifest<Interfaces.ERC20, 'approve'> = {
      args: [spender, approveAmount?.exact as BigNumber],
      fn: 'approve',
      formId,
      iface: tokenContract,
    };

    sendTransaction(manifest);
  }, [sendTransaction, tokenContract, spender, formId, approveAmount]);

  const handleSetMax = useCallback(() => {
    setApproveAmount(new BigDecimal(MaxUint256, 18));
    setApproveFormValue(null);
  }, [setApproveAmount, setApproveFormValue]);

  return (
    <Container>
      <StyledButton
        onClick={handleApprove}
        size={Size.s}
        type="button"
        disabled={pending}
      >
        {pending ? 'Approving' : 'Approve'}
      </StyledButton>
      <StyledAmountInput
        value={approveFormValue || null}
        name="amount"
        onChange={(_, _amount) => {
          setApproveFormValue(_amount);
          if (decimals) {
            setApproveAmount(BigDecimal.maybeParse(_amount, decimals));
          }
        }}
        disabled={pending}
      />
      <MaxButton
        size={Size.s}
        type="button"
        onClick={handleSetMax}
        active={approveAmount?.exact.eq(MaxUint256)}
      >
        ∞
      </MaxButton>
    </Container>
  );
};
