import React, { FC, useCallback, useEffect } from 'react';

import {
  SaveVersion,
  useActiveSaveVersionState,
  useSetActiveVersion,
  useSetSaveVersions,
} from './ActiveSaveVersionProvider';
import { useV1SavingsBalance } from '../../../context/DataProvider/DataProvider';
import { Toggle } from '../../core/Toggle';
import { useSelectedSaveV2Contract } from '../../../web3/hooks';

const { V1, V2 } = SaveVersion;

const VERSION_TITLES = new Map<SaveVersion, string>([
  [V1, 'V1'],
  [V2, 'V2'],
]);

export const ToggleSave: FC = () => {
  const { activeVersion, versions } = useActiveSaveVersionState();
  const setActiveVersion = useSetActiveVersion();
  const setSaveVersions = useSetSaveVersions();
  const v1Balance = useV1SavingsBalance();
  const v2Contract = useSelectedSaveV2Contract();

  // Set the save version to v1 (once only) if there is a v1 balance
  useEffect(() => {
    if (activeVersion !== undefined) {
      return;
    }

    // v2 contract not present, set versions to [v1]
    if (v2Contract === undefined) {
      setSaveVersions([V1]);
      return;
    }

    // v2 contract present, set to [v2, v1]
    setSaveVersions([V2, V1]);

    // priortise ordering based on balance
    if (v1Balance?.balance) {
      if (v1Balance.balance.exact.gt(0)) {
        setActiveVersion(V1);
      }
    }
  }, [activeVersion, setActiveVersion, setSaveVersions, v1Balance, v2Contract]);

  const handleOnClick = useCallback(
    (i: number) => setActiveVersion(i === 0 ? versions[0] : versions[1]),
    [setActiveVersion, versions],
  );

  const titles = versions.map(
    (version, i) =>
      `${VERSION_TITLES.get(version) ?? ''} ${i > 0 ? ` (Deprecated)` : ''}`,
  );

  return (
    <Toggle
      onClick={handleOnClick}
      titles={titles}
      activeIndex={versions.length - (activeVersion ?? 0)}
    />
  );
};
