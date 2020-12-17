import React, { FC } from 'react';

import { SaveModeSelector } from './SaveModeSelector';
import { SaveProvider } from './SaveProvider';

export const SaveV2: FC = () => {
  return (
    <SaveProvider>
      <SaveModeSelector />
    </SaveProvider>
  );
};
