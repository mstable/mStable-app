import { Dispatch, SetStateAction, useCallback } from 'react';
import createStateContext from 'react-use/lib/createStateContext';
import { useHistory } from 'react-router-dom';

import { MassetName } from '../types';

const [useSelectedMassetCtx, SelectedMassetProvider] = createStateContext<
  MassetName
>('mUSD');

export const useSelectedMasset = (): MassetName => useSelectedMassetCtx()[0];

export const useSetSelectedMasset = (): Dispatch<SetStateAction<MassetName>> =>
  useSelectedMassetCtx()[1];

export { SelectedMassetProvider };

export const getMassetRoute = (
  massetName: MassetName,
  ...parts: (string | undefined)[]
): string =>
  `/${[
    massetName.toLowerCase(),
    ...parts
      ?.filter(Boolean)
      .map(p => ((p as string).startsWith('/') ? (p as string).slice(1) : p)),
  ].join('/')}`;

export const useHandleMassetClick = (): ((massetName: MassetName) => void) => {
  const setSelectedMasset = useSetSelectedMasset();
  const history = useHistory();
  return useCallback(
    (massetName: MassetName) => {
      setSelectedMasset(massetName);
      history.push(getMassetRoute(massetName, 'mint'));
    },
    [history, setSelectedMasset],
  );
};
