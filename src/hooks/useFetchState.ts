import { Dispatch, useMemo, useState } from 'react';

export interface FetchState<Value extends unknown> {
  value?: Value;
  fetching?: boolean;
  error?: string;
}

export const useFetchState = <Value extends unknown>(): [
  FetchState<Value>,
  {
    value: Dispatch<Value | undefined>;
    fetching: Dispatch<void>;
    error: Dispatch<string>;
  },
] => {
  const [state, setState] = useState<FetchState<Value>>({ fetching: false });

  const callbacks = useMemo(
    () => ({
      value: (value?: Value) => {
        setState({ value, fetching: false });
      },
      fetching: () => {
        setState({ fetching: true });
      },
      error: (error?: string) => {
        setState({ error, fetching: false });
      },
    }),
    [],
  );

  return [state, callbacks];
};
