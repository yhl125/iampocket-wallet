import { proxy, subscribe } from "valtio";

export function proxyWithLocalStorage<T extends object>(key: string, initialValue: T) {
  if (typeof window === "undefined") return proxy(initialValue);
  const storageItem = localStorage.getItem(key);

  const state = proxy(storageItem !== null ? (JSON.parse(storageItem) as T) : initialValue);

  subscribe(state, () => localStorage.setItem(key, JSON.stringify(state)));

  return state;
}