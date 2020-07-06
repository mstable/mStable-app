import { Connectors } from 'use-wallet';
import { CONNECTORS } from './web3/constants';

const STORAGE_PREFIX = '__mStable-app__';
const STORAGE_VERSION = 1;

type VersionedStorage<V extends number, T> = {
  version: V;
} & Omit<T, 'version'>;

export interface StorageV0 extends VersionedStorage<0, {}> {
  connectorId?: keyof Connectors;
}

export interface StorageV1 extends VersionedStorage<1, {}> {
  connector?: { id: keyof Connectors; subType?: string };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorageV2 extends VersionedStorage<2, StorageV1> {
  // Storage V2 goes here
}

export type AllStorage = StorageV0 & StorageV1 & StorageV2;

export type Storage = Extract<AllStorage, { version: typeof STORAGE_VERSION }>;

const getStorageKey = (key: string): string => `${STORAGE_PREFIX}.${key}`;

export const LocalStorage = {
  set<S extends Storage, T extends keyof S>(key: T, value: S[T]): void {
    window.localStorage.setItem(
      getStorageKey(key as string),
      JSON.stringify(value),
    );
  },
  setVersion(version: number): void {
    window.localStorage.setItem(
      getStorageKey('version'),
      JSON.stringify(version),
    );
  },
  get<K extends keyof AllStorage>(key: K): AllStorage[K] {
    const value = window.localStorage.getItem(getStorageKey(key));
    return value && value.length > 0 ? JSON.parse(value) : undefined;
  },
  removeItem<K extends keyof AllStorage>(key: K): void {
    window.localStorage.removeItem(getStorageKey(key as string));
  },
  clearAll(): void {
    window.localStorage.clear();
  },
};

const migrateLocalStorage = (): void => {
  const version = LocalStorage.get('version');

  if (version === 0) {
    const connectorId = LocalStorage.get<'connectorId'>('connectorId');

    if (connectorId) {
      // The injected connector now requires a subType (MetaMask/Brave/etc),
      // so we can't assume the type; these users will have to connect again.
      if (connectorId !== 'injected') {
        const subType = CONNECTORS.find(c => c.id === connectorId)?.subType;
        LocalStorage.set('connector', {
          id: connectorId,
          subType,
        });
      }
      LocalStorage.removeItem<'connectorId'>('connectorId');
    }

    LocalStorage.setVersion(1);
  }

  LocalStorage.setVersion(STORAGE_VERSION);
};

(() => migrateLocalStorage())();
