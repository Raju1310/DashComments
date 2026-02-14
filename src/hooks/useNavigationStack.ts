import { useState, useCallback } from 'react';

export type ScreenName = 'GATEWAY' | 'VOUCHER_ENTRY';

export interface ScreenState {
  name: ScreenName;
  props?: Record<string, any>;
}

export const useNavigationStack = (initialScreen: ScreenName = 'GATEWAY') => {
  const [stack, setStack] = useState<ScreenState[]>([{ name: initialScreen }]);

  const push = useCallback((screen: ScreenName, props?: Record<string, any>) => {
    setStack((prev) => [...prev, { name: screen, props }]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev; // Cannot pop the last item (Gateway)
      return prev.slice(0, -1);
    });
  }, []);

  const currentScreen = stack[stack.length - 1];

  return {
    stack,
    currentScreen,
    push,
    pop,
  };
};
