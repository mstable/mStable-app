import React, { FC, useCallback, useEffect, useRef } from 'react';

import {
  CURRENT_SAVE_VERSION,
  SAVE_VERSIONS,
  useActiveSaveVersion,
} from './ActiveSaveVersionProvider';
import { useV1SavingsBalance } from '../../../context/DataProvider/DataProvider';
import { Toggle } from '../../core/Toggle';

export const ToggleSave: FC = () => {
  const setSaveVersion = useRef(false);
  const [activeVersion, setActiveVersion] = useActiveSaveVersion();
  const v1Balance = useV1SavingsBalance();

  // const v1Contract = useSelectedSaveV1Contract();
  // const v2Contract = useSelectedSaveV2Contract();

  useEffect(() => {
    // Set the save version to v1 (once only) if there is a v1 balance
    if (!setSaveVersion.current && v1Balance?.balance) {
      if (v1Balance.balance.exact.gt(0)) {
        setActiveVersion(SAVE_VERSIONS[0]);
        setSaveVersion.current = true;
      }
    }
  }, [setActiveVersion, v1Balance]);

  const handleOnClick = useCallback(
    (i: number) =>
      setActiveVersion(i === 0 ? CURRENT_SAVE_VERSION : SAVE_VERSIONS[0]),
    [setActiveVersion],
  );

  const titles = ((): string[] | undefined => {
    // if (v2Contract === undefined && v1Contract === undefined) return undefined;
    // if (v2Contract !== undefined) {
    //   return ['V2', 'V1 (Deprecated)'];
    // }
    return ['V1'];
  })();

  return (
    <Toggle
      onClick={handleOnClick}
      titles={titles}
      activeIndex={activeVersion.isCurrent ? 0 : 1}
    />
  );
};
