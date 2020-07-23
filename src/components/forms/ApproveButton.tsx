import React, { FC, useCallback } from 'react';
import { BigNumber } from 'ethers';

import { useFormId } from './TransactionForm/FormProvider';
import { useErc20Contract } from '../../context/DataProvider/ContractsProvider';
import {
  useHasPendingApproval,
  useSendTransaction,
} from '../../context/TransactionsProvider';
import { Button } from '../core/Button';
import { Size } from '../../theme';
import { Interfaces, SendTxManifest } from '../../types';

interface Props {
  address: string;
  spender: string;
  approveQuantity?: BigNumber;
}

export const ApproveButton: FC<Props> = ({
  address,
  spender,
  approveQuantity,
}) => {
  const sendTransaction = useSendTransaction();
  const tokenContract = useErc20Contract(address);
  const formId = useFormId();
  const pending = useHasPendingApproval(address, spender);

  const handleClick = useCallback((): void => {
    if (!(tokenContract && spender)) return;

    const manifest: SendTxManifest<Interfaces.ERC20, 'approve'> = {
      iface: tokenContract,
      fn: 'approve',
      formId,
      args: [spender, approveQuantity as BigNumber],
    };

    if (approveQuantity) {
      sendTransaction(manifest);
      return;
    }

    tokenContract.totalSupply().then(totalSupply => {
      manifest.args[1] = totalSupply;
      sendTransaction(manifest);
    });
  }, [sendTransaction, tokenContract, spender, formId, approveQuantity]);

  return (
    <Button
      size={Size.s}
      onClick={handleClick}
      type="button"
      disabled={pending}
    >
      {pending ? 'Approving' : 'Approve'}
    </Button>
  );
};
