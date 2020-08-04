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
import { Interfaces, SendTxManifest } from '../../types';
import { Tooltip } from '../core/ReactTooltip';

interface Props {
  address: string;
  amount: BigDecimal;
  className?: string;
  spender: string;
}

const StyledButton = styled(Button)`
  line-height: 15px;

  > span {
    font-size: 16px;
    line-height: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    margin-right: 8px;
  }
`;

const INFINITE = new BigDecimal(MaxUint256, 18);

enum ApproveMode {
  Exact,
  Infinite,
}

export const ApproveButton: FC<Props> = ({
  address,
  amount,
  className,
  spender,
}) => {
  const sendTransaction = useSendTransaction();
  const tokenContract = useErc20Contract(address);
  const formId = useFormId();
  const pending = useHasPendingApproval(address, spender);

  const [approveMode, setApproveMode] = useState<ApproveMode>();

  const handleApprove = useCallback(
    (_approveMode: ApproveMode): void => {
      setApproveMode(_approveMode);
      const approveAmount =
        _approveMode === ApproveMode.Infinite ? INFINITE : amount;

      if (!(tokenContract && spender && approveAmount.exact.gt(0))) return;

      const manifest: SendTxManifest<Interfaces.ERC20, 'approve'> = {
        args: [spender, approveAmount?.exact as BigNumber],
        fn: 'approve',
        formId,
        iface: tokenContract,
      };

      sendTransaction(manifest);
    },
    [amount, tokenContract, spender, formId, sendTransaction],
  );

  return (
    <Container className={className}>
      <Tooltip tip="Approve this contract to spend an infinite amount" hideIcon>
        <StyledButton
          onClick={() => {
            handleApprove(ApproveMode.Infinite);
          }}
          type="button"
          disabled={pending}
        >
          {pending && approveMode === ApproveMode.Infinite ? (
            'Approving'
          ) : (
            <>
              Approve <span>∞</span>
            </>
          )}
        </StyledButton>
      </Tooltip>
      <Tooltip
        tip="Approve this contract to spend enough for this transaction"
        hideIcon
      >
        <StyledButton
          onClick={() => {
            handleApprove(ApproveMode.Exact);
          }}
          type="button"
          disabled={pending}
        >
          {pending && approveMode === ApproveMode.Exact
            ? 'Approving'
            : 'Approve exact'}
        </StyledButton>
      </Tooltip>
    </Container>
  );
};
