import React, { FC } from 'react';
import { Form } from '../../core/Form';
import { useFormSubmitting } from './FormProvider';

export const InputPane: FC<{}> = ({ children }) => {
  const submitting = useFormSubmitting();
  return <Form submitting={submitting}>{children}</Form>;
};
