/* eslint-disable no-empty */

import { CONNECTORS } from './constants';

const STORAGE_PREFIX = '__mStable-app__';
const STORAGE_VERSION = 3;

type VersionedStorage<V extends number, T> = {
  version: V;
} & Omit<T, 'version'>;

export interface StorageV0 extends VersionedStorage<0, {}> {
  connectorId?: string;
}

export interface StorageV1 extends VersionedStorage<1, {}> {
  connector?: { id: string; subType?: string };
}

export interface StorageV2 extends VersionedStorage<2, StorageV1> {
  viewedEarnOnboarding?: boolean;
}

export interface StorageV3 extends VersionedStorage<3, StorageV2> {
  walletName?: string;
  themeMode?: string;
  viewedPoolOnboarding?: {
    user?: boolean;
    active?: boolean;
  };
}

export type AllStorage = { version: number } & Omit<StorageV0, 'version'> &
  Omit<StorageV1, 'version'> &
  Omit<StorageV2, 'version'> &
  Omit<StorageV3, 'version'>;

const getStorageKey = (key: string): string => `${STORAGE_PREFIX}.${key}`;

export const LocalStorage = {
  // It might not be possible to write to localStorage, e.g. in Incognito mode;
  // ignore any get/set/clear errors.
  set<S extends AllStorage, T extends keyof S>(key: T, value: S[T]): void {
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
    const storageKey = getStorageKey(key as string);
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

  if (version === 2) {
    const connector = LocalStorage.get<'connector'>('connector');

    if (connector) {
      const { id, subType } = connector;
      let walletName;
      switch (id) {
        case 'injected':
          if (subType === 'metamask') {
            walletName = 'MetaMask';
          } else if (subType === 'brave') {
            walletName = 'Brave';
          } else if (subType === 'meetOne') {
            walletName = 'MeetOne';
          }
          break;
        case 'fortmatic':
          walletName = 'Fortmatic';
          break;
        case 'portis':
          walletName = 'Portis';
          break;
        case 'authereum':
          walletName = 'Authereum';
          break;
        case 'squarelink':
          walletName = 'SquareLink';
          break;
        case 'torus':
          walletName = 'Torus';
          break;
        case 'walletconnect':
          walletName = 'WalletConnect';
          break;
        case 'walletlink':
          walletName = 'WalletLink';
          break;
        default:
          break;
      }
      LocalStorage.set('walletName', walletName);
    }
  }

  LocalStorage.setVersion(STORAGE_VERSION);
};

(() => migrateLocalStorage())();
