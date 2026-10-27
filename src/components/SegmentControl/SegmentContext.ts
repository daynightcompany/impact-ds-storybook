import { createContext } from 'react';

export type SegmentControlSize = 'M' | 'L';

export interface SegmentContextValue {
  size: SegmentControlSize;
  /** Shared by every radio of the group, so the arrow keys move between them. */
  name: string;
  value: string | undefined;
  disabled: boolean | undefined;
  select(value: string): void;
}

/** Lets a <SegmentItem> read the selection of the <SegmentControl> around it. */
export const SegmentContext = createContext<SegmentContextValue | null>(null);
