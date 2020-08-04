import React, { FC, useCallback } from 'react';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { SubmitButton } from '../../core/Form';
import { H3 } from '../../core/Typography';
import {
  useFormId,
  useFormSubmitting,
  useManifest,
  useSubmitEnd,
  useSubmitStart,
} from './FormProvider';

interface Props {
  confirmLabel: string;
  valid: boolean;
}

export const ConfirmPane: FC<Props> = ({ children, confirmLabel, valid }) => {
  const sendTransaction = useSendTransaction();
  const manifest = useManifest();
  const submitting = useFormSubmitting();
  const submitStart = useSubmitStart();
  const submitEnd = useSubmitEnd();
  const formId = useFormId();

  const handleSend = useCallback(() => {
    if (valid && manifest) {
      submitStart();
      sendTransaction({ ...manifest, formId }, submitEnd);
    }
  }, [manifest, valid, sendTransaction, formId, submitEnd, submitStart]);

  return (
    <div>
      <>
        <H3 borderTop>Confirm transaction</H3>
        <SubmitButton
          type="button"
          onClick={handleSend}
          disabled={submitting || !valid}
        >
          {confirmLabel}
        </SubmitButton>
        <div>{children}</div>
      </>
    </div>
  );
};
