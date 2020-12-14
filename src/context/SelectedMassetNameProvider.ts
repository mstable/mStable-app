import { Dispatch, SetStateAction } from 'react';
import { createStateContext } from 'react-use';

import { MassetName } from '../types';

const [
  useSelectedMassetNameCtx,
  SelectedMassetNameProvider,
] = createStateContext<MassetName>('mUSD');

export const useSelectedMassetName = (): MassetName =>
  useSelectedMassetNameCtx()[0];

export const useSetSelectedMassetName = (): Dispatch<SetStateAction<
  MassetName
>> => useSelectedMassetNameCtx()[1];

export { SelectedMassetNameProvider };
