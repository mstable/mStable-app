import React, { FC } from 'react';

import { ExitForm } from './ExitForm';
import { ExitProvider } from './ExitProvider';

export const Exit: FC<{}> = () => (
  <ExitProvider>
    <ExitForm />
  </ExitProvider>
);
