import { Connectors } from 'use-wallet';
import { CONNECTORS } from './web3/constants';

const STORAGE_PREFIX = '__mStable-app__';
const STORAGE_VERSION = 1;

interface BaseStorage {
  version?: number;
}

export interface StorageV0 extends BaseStorage {
  connectorId?: keyof Connectors;
}

export interface StorageV1 extends BaseStorage {
  version: 1;
  connector?: { id: keyof Connectors; subType?: string };
}

export type AllStorage = StorageV0 | StorageV1;

export type Storage = Extract<AllStorage, { version: typeof STORAGE_VERSION }>;

const getStorageKey = <S extends BaseStorage>(key: keyof S): string =>
  `${STORAGE_PREFIX}.${key}`;

export const LocalStorage = {
  set<S extends BaseStorage, T extends keyof S>(key: T, value: S[T]): void {
    window.localStorage.setItem(getStorageKey<S>(key), JSON.stringify(value));
  },
  get<S extends BaseStorage, T extends keyof S>(key: T): S[T] {
    const value = window.localStorage.getItem(getStorageKey<S>(key));
    return value && value.length > 0 ? JSON.parse(value) : undefined;
  },
  removeItem<S extends BaseStorage, T extends keyof S>(key: T): void {
    window.localStorage.removeItem(getStorageKey<S>(key));
  },
  clearAll(): void {
    window.localStorage.clear();
  },
};

const migrateLocalStorage = (): void => {
  const version = LocalStorage.get('version');

  if (version === 0) {
    const connectorId = LocalStorage.get<StorageV0, 'connectorId'>(
      'connectorId',
    );

    if (connectorId) {
      // The injected connector now requires a subType (MetaMask/Brave/etc),
      // so we can't assume the type; these users will have to connect again.
      if (connectorId !== 'injected') {
        const subType = CONNECTORS.find(c => c.id === connectorId)?.subType;
        LocalStorage.set<StorageV1, 'connector'>('connector', {
          id: connectorId,
          subType,
        });
      }
      LocalStorage.removeItem<StorageV0, 'connectorId'>('connectorId');
    }

    LocalStorage.set('version', 1);
  }
};

(() => migrateLocalStorage())();
