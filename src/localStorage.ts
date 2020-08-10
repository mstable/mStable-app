/* eslint-disable no-empty */

import { Connectors } from 'use-wallet';
import { CONNECTORS } from './web3/connectors';

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

export interface StorageV2 extends VersionedStorage<2, StorageV1> {
  viewedEarnOnboarding?: boolean;
}

export type AllStorage = StorageV0 & StorageV1 & StorageV2;

export type Storage = Extract<AllStorage, { version: typeof STORAGE_VERSION }>;

const getStorageKey = (key: string): string => `${STORAGE_PREFIX}.${key}`;

export const LocalStorage = {
  // It might not be possible to write to localStorage, e.g. in Incognito mode;
  // ignore any get/set/clear errors.
  set<S extends Storage, T extends keyof S>(key: T, value: S[T]): void {
    const storageKey = getStorageKey(key as string);
    const json = JSON.stringify(value);
    try {
      window.localStorage.setItem(storageKey, json);
    } finally {
    }
  },
  setVersion(version: number): void {
    const storageKey = getStorageKey('version');
    const json = JSON.stringify(version);
    try {
      window.localStorage.setItem(storageKey, json);
    } finally {
    }
  },
  get<K extends keyof AllStorage>(key: K): AllStorage[K] {
    const storageKey = getStorageKey(key);
    let value;
    try {
      value = window.localStorage.getItem(storageKey);
    } finally {
    }
    return value && value.length > 0 ? JSON.parse(value) : undefined;
  },
  removeItem<K extends keyof AllStorage>(key: K): void {
    const storageKey = getStorageKey(key as string);
    try {
      window.localStorage.removeItem(storageKey);
    } finally {
    }
  },
  clearAll(): void {
    try {
      window.localStorage.clear();
    } finally {
    }
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
