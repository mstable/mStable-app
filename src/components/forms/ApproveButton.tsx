import React, { FC, useCallback, useMemo, useState } from 'react';
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
import { useTokenAllowance } from '../../context/DataProvider/TokensProvider';

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
  Zero,
}

const APPROVE_EDGE_CASES: Record<string, string> = {
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT', // Mainnet
  '0xb404c51bbc10dcbe948077f18a4b8e553d160084': 'USDT', // Ropsten
};

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
  const allowance = useTokenAllowance(address, spender);

  const [approveMode, setApproveMode] = useState<ApproveMode>();

  const isApproveEdgeCase = useMemo<boolean>(
    () =>
      Boolean(
        APPROVE_EDGE_CASES[address] &&
          allowance &&
          allowance.exact.gt(0) &&
          allowance.exact.lt(amount.exact),
      ),
    [address, allowance, amount],
  );

  const handleApprove = useCallback(
    (_approveMode: ApproveMode): void => {
      setApproveMode(_approveMode);
      const approveAmount =
        _approveMode === ApproveMode.Infinite
          ? INFINITE
          : _approveMode === ApproveMode.Zero
          ? new BigDecimal(0, amount.decimals)
          : amount;

      if (!(tokenContract && spender)) return;

      const manifest: SendTxManifest<Interfaces.ERC20, 'approve'> = {
        args: [spender, approveAmount.exact as BigNumber],
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
      {isApproveEdgeCase ? (
        <Tooltip
          tip={`The approved amount is less than the required amount, 
          but ${APPROVE_EDGE_CASES[address]} is a token that requires 
          resetting the approved amount first.`}
        >
          <StyledButton
            onClick={() => {
              handleApprove(ApproveMode.Zero);
            }}
            type="button"
            disabled={pending}
          >
            {pending && approveMode === ApproveMode.Zero
              ? 'Resetting approval'
              : 'Reset approval'}
          </StyledButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip
            tip="Approve this contract to spend an infinite amount"
            hideIcon
          >
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
        </>
      )}
    </Container>
  );
};
