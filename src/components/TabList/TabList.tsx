import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

/** The tab each list's underline was last put under. */
const placedUnder = new WeakMap<HTMLElement, HTMLElement>();

/**
 * Puts the list's underline under the selected tab (Primary tabs). It reads
 * the position and width of that tab and hands them to the CSS as --tabline-x,
 * --tabline-bottom and --tabline-w. `data-indicator` is "slide" while the line
 * eases to another tab and "jump" for a placement that must not move: the first
 * one, a change of layout, or a call with `animate` off. Only a different
 * selected tab makes the line slide, so it stays on its tab when that tab moves
 * or changes size. Without a selected tab, or while the list is hidden, there is
 * no attribute and the tabs draw their own line.
 */
function placeUnderline(list: HTMLElement, animate: boolean) {
  const tab = list.querySelector<HTMLButtonElement>(':scope > [role="tab"][aria-selected="true"]');
  if (!tab || tab.offsetWidth === 0) {
    list.removeAttribute('data-indicator');
    list.removeAttribute('data-indicator-disabled');
    return;
  }
  const x = `${tab.offsetLeft}px`;
  const bottom = `${tab.offsetTop + tab.offsetHeight}px`;
  const width = `${tab.offsetWidth}px`;
  const { style } = list;
  const placed = list.hasAttribute('data-indicator');
  if (
    placed &&
    style.getPropertyValue('--tabline-x') === x &&
    style.getPropertyValue('--tabline-bottom') === bottom &&
    style.getPropertyValue('--tabline-w') === width &&
    list.hasAttribute('data-indicator-disabled') === tab.disabled
  ) {
    return;
  }
  const still = !placed || !animate || placedUnder.get(list) === tab;
  placedUnder.set(list, tab);
  if (still) list.setAttribute('data-indicator', 'jump');
  style.setProperty('--tabline-x', x);
  style.setProperty('--tabline-bottom', bottom);
  style.setProperty('--tabline-w', width);
  list.toggleAttribute('data-indicator-disabled', tab.disabled);
  // The new place is applied while the line cannot move; only then may it move again.
  if (still) void list.offsetWidth;
  list.setAttribute('data-indicator', 'slide');
}

/**
 * Impact DS Tab list — converted from the Figma "Tab" component sets (nodes
 * 9587:4382 for Primary tabs and 9587:4584 for Secondary tabs): a row (or
 * column) of tabs with spacing/button/2xs between them.
 *
 * In a list of Primary tabs the underline of the selected tab slides to the
 * tab that is selected next, as in the Figma prototype; with reduced motion
 * it jumps.
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

  // Primary tabs share one underline. It is placed from the layout, so it follows
  // the tabs when they change size (a font that loads, the Mobile mode, a new label)
  // without moving; only a new selection makes it slide.
  const slides = variant === 'Primary';
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list || !slides) return undefined;
    placeUnderline(list, false);
    const clear = () => {
      list.removeAttribute('data-indicator');
      list.removeAttribute('data-indicator-disabled');
    };
    if (typeof ResizeObserver === 'undefined') return clear;
    const resize = new ResizeObserver(() => placeUnderline(list, false));
    const watch = () => {
      resize.disconnect();
      resize.observe(list);
      for (const tab of Array.from(list.children)) resize.observe(tab);
    };
    watch();
    const mutation = new MutationObserver(() => {
      watch();
      placeUnderline(list, false);
    });
    mutation.observe(list, { childList: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
      clear();
    };
  }, [slides]);
  // After every render, so a new selection (the list's or a Tab's own `selected`) slides.
  useLayoutEffect(() => {
    const list = ref.current;
    if (list && slides) placeUnderline(list, true);
  });

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
