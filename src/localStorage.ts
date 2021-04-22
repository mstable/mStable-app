/* eslint-disable no-empty */

const STORAGE_PREFIX = '__mStable-app__'
const STORAGE_VERSION = 3

type VersionedStorage<V extends number, T> = {
  version: V
} & Omit<T, 'version'>

export interface StorageV0 extends VersionedStorage<0, {}> {
  connectorId?: string
}

export interface StorageV1 extends VersionedStorage<1, {}> {
  connector?: { id: string; subType?: string }
}

export interface StorageV2 extends VersionedStorage<2, StorageV1> {
  viewedEarnOnboarding?: boolean
}

export interface StorageV3 extends VersionedStorage<3, StorageV2> {
  walletName?: string
  themeMode?: string
  viewedPoolOnboarding?: {
    user?: boolean
    active?: boolean
  }
  tcsViewed?: boolean
  polygonViewed?: boolean
}

export interface StorageV4 extends VersionedStorage<4, StorageV3> {
  mostRecentChainId?: number
  polygonViewed?: boolean
}

export type AllStorage = { version: number } & Omit<StorageV0, 'version'> &
  Omit<StorageV1, 'version'> &
  Omit<StorageV2, 'version'> &
  Omit<StorageV3, 'version'> &
  Omit<StorageV4, 'version'>

const getStorageKey = (key: string): string => `${STORAGE_PREFIX}.${key}`

export const LocalStorage = {
  // It might not be possible to write to localStorage, e.g. in Incognito mode;
  // ignore any get/set/clear errors.
  set<S extends AllStorage, T extends keyof S>(key: T, value: S[T]): void {
    const storageKey = getStorageKey(key as string)
    const json = JSON.stringify(value)
    try {
      window.localStorage.setItem(storageKey, json)
    } finally {
    }
  },
  setVersion(version: number): void {
    const storageKey = getStorageKey('version')
    const json = JSON.stringify(version)
    try {
      window.localStorage.setItem(storageKey, json)
    } finally {
    }
  },
  get<K extends keyof AllStorage>(key: K): AllStorage[K] {
    const storageKey = getStorageKey(key as string)
    let value
    try {
      value = window.localStorage.getItem(storageKey)
    } finally {
    }
    return value && value.length > 0 ? JSON.parse(value) : undefined
  },
  removeItem<K extends keyof AllStorage>(key: K): void {
    const storageKey = getStorageKey(key as string)
    try {
      window.localStorage.removeItem(storageKey)
    } finally {
    }
  },
  clearAll(): void {
    try {
      window.localStorage.clear()
    } finally {
    }
  },
}

const migrateLocalStorage = (): void => {
  // Migrations haven't been used for a while
  LocalStorage.setVersion(STORAGE_VERSION)
}

;(() => migrateLocalStorage())()
