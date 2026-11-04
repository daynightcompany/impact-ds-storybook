import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Search } from '../Search/Search';
import { Tab } from '../Tab/Tab';
import { TabList, type TabListProps } from '../TabList/TabList';
import { DialogFooter } from '../DialogFooter/DialogFooter';

/** A boolean-or-node slot: `false`, `null` and `undefined` hide it. */
export type Slot = boolean | ReactNode;

export function isShown(slot: Slot): boolean {
  return slot !== false && slot !== null && slot !== undefined;
}

/** The Figma Search instance: `true` shows an empty search field, a node replaces it. */
export function searchSlot(slot: Slot): ReactNode {
  if (!isShown(slot)) return null;
  return slot === true ? <Search /> : slot;
}

/**
 * The Figma Tab instance: `true` shows a Primary tab list of placeholder tabs, a
 * node replaces it. Tabs in a popup or a dialog are size M (40 high), the size of
 * the Button M and the Chip M that sit beside them, so the placeholders are M and
 * a <TabList> that sets no `size` is M here too. A `size` you set is kept.
 */
export function tabsSlot(slot: Slot): ReactNode {
  if (!isShown(slot)) return null;
  if (slot !== true) {
    return isValidElement(slot) && slot.type === TabList && (slot.props as TabListProps).size === undefined
      ? cloneElement(slot as ReactElement<TabListProps>, { size: 'M' })
      : slot;
  }
  return (
    <TabList variant="Primary" size="M" defaultValue="tab-1" aria-label="Sections">
      {[1, 2, 3, 4].map((number) => (
        <Tab key={number} value={`tab-${number}`}>
          Tab {number}
        </Tab>
      ))}
    </TabList>
  );
}

/** The Figma Dialog/Footer instance: `true` shows the default footer, a node (a <DialogFooter>) replaces it. */
export function footerSlot(
  slot: Slot,
  defaults: { buttonWidth: '3 CTA' | '2 CTA'; stackOnMobile?: boolean },
): ReactNode {
  if (!isShown(slot)) return null;
  return slot === true ? (
    <DialogFooter buttonWidth={defaults.buttonWidth} stackOnMobile={defaults.stackOnMobile} />
  ) : (
    slot
  );
}
