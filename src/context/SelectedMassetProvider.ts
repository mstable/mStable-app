import { Dispatch, SetStateAction } from 'react';
import createStateContext from 'react-use/lib/createStateContext';

import { MassetName } from '../types';

const [useSelectedMassetCtx, SelectedMassetProvider] = createStateContext<
  MassetName
>('mUSD');

export const useSelectedMasset = (): MassetName => useSelectedMassetCtx()[0];

export const useSetSelectedMasset = (): Dispatch<SetStateAction<MassetName>> =>
  useSelectedMassetCtx()[1];

export { SelectedMassetProvider };
