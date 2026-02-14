import { useSyncExternalStore } from "react";

export function create(init) {
  let state;
  const listeners = new Set();

  const setState = (partial) => {
    const next = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = init(setState, getState);

  return function useStore(selector = (s) => s) {
    return useSyncExternalStore(subscribe, () => selector(getState()));
  };
}
