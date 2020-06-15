import { Connectors } from 'use-wallet';

const STORAGE_PREFIX = '__mStable-app__';

interface Storage {
  connectorId?: keyof Connectors;
}

const getStorageKey = (key: keyof Storage): string =>
  `${STORAGE_PREFIX}.${key}`;

export const LocalStorage = {
  set<T extends keyof Storage>(key: T, value: Storage[T]): void {
    window.localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  },
  get<T extends keyof Storage>(key: T): Storage[T] {
    const value = window.localStorage.getItem(getStorageKey(key));
    return value && value.length > 0 ? JSON.parse(value) : undefined;
  },
  clearItem<T extends keyof Storage>(key: T): void {
    window.localStorage.setItem(getStorageKey(key), '');
  },
  clearAll(): void {
    window.localStorage.clear();
  },
};
