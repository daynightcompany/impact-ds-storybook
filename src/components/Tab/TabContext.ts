import { createContext } from 'react';
import type { TabSize, TabVariant } from './Tab';

/**
 * What a TabList hands down to its Tab children: the shared variant and size,
 * the selected value and how to change it.
 */
export interface TabContextValue {
  variant: TabVariant;
  size: TabSize;
  value: string | undefined;
  select: (value: string) => void;
}

export const TabContext = createContext<TabContextValue | null>(null);
