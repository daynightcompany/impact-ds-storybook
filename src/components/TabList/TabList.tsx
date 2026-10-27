import { useCallback, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';
import styles from './TabList.module.css';
import { TabContext } from '../Tab/TabContext';
import type { TabSize, TabVariant } from '../Tab/Tab';
import '../../styles/tokens.css';

export type TabListOrientation = 'Horizontal' | 'Vertical';

export interface TabListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Variant of every tab in the list. */
  variant?: TabVariant;
  /** Size of every tab in the list. */
  size?: TabSize;
  /** Figma Position. */
  orientation?: TabListOrientation;
  /** Selected tab (controlled). Matches the `value` of a <Tab>. */
  value?: string;
  /** Initially selected tab (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Impact DS Tab list — converted from the Figma "Tab" component sets (nodes
 * 9587:4382 for Primary tabs and 9587:4584 for Secondary tabs): a row (or
 * column) of tabs with 8px between them (spacing/button/2xs).
 *
 * It also carries the tab semantics: role="tablist", a roving tab stop on the
 * selected tab, and the arrow keys (Left/Right for Horizontal, Up/Down for
 * Vertical, Home and End) that move focus and select, skipping disabled tabs.
 * Tab panels are up to the app: give each panel role="tabpanel" and
 * `aria-labelledby` the id of its tab.
 */
export function TabList({
  variant = 'Primary',
  size = 'L',
  orientation = 'Horizontal',
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  onKeyDown,
  ...rest
}: TabListProps) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const ref = useRef<HTMLDivElement>(null);

  const select = useCallback(
    (next: string) => {
      if (!controlled) setInner(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const context = useMemo(() => ({ variant, size, value, select }), [variant, size, value, select]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const vertical = orientation === 'Vertical';
    const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    if (![previousKey, nextKey, 'Home', 'End'].includes(event.key)) return;

    const tabs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []);
    if (tabs.length === 0) return;
    const current = tabs.indexOf(event.target as HTMLButtonElement);
    let target: number;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = tabs.length - 1;
    else if (event.key === nextKey) target = (current + 1) % tabs.length;
    else target = (current - 1 + tabs.length) % tabs.length;

    event.preventDefault();
    tabs[target].focus();
    // Selection follows focus.
    tabs[target].click();
  };

  return (
    <TabContext.Provider value={context}>
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation === 'Vertical' ? 'vertical' : 'horizontal'}
        className={[styles.list, styles[orientation.toLowerCase()], className].filter(Boolean).join(' ')}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </TabContext.Provider>
  );
}

export default TabList;
