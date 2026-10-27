import { createContext } from 'react';

/** Figma Type of the "Cell group": which kind of row the group holds. */
export type CellGroupType = 'Link' | 'Radio' | 'Switch' | 'Checkbox';

export interface CellGroupContextValue {
  type: CellGroupType;
  /** Radio groups: shared by every radio, so the arrow keys move between them. */
  name: string;
  /** Radio groups: the selected row's `value`. */
  value: string | undefined;
  select(value: string): void;
}

/** Lets a <CellSelector> read the group it sits in. */
export const CellGroupContext = createContext<CellGroupContextValue | null>(null);
