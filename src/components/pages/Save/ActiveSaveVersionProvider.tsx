import { createStateContext } from 'react-use';
import { SaveVersion } from './v1/SaveProvider';

export const SAVE_VERSIONS: SaveVersion[] = [
  { version: 1 },
  { version: 2, isCurrent: true },
];

export const CURRENT_SAVE_VERSION = SAVE_VERSIONS.find(
  v => v.isCurrent,
) as SaveVersion;

export const [
  useActiveSaveVersion,
  ActiveSaveVersionProvider,
] = createStateContext(CURRENT_SAVE_VERSION);
