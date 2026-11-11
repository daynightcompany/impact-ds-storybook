import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';
import styles from './TabList.module.css';
import { MoreMenu } from '../Menu/Menu';
import type { MoreMenuItem } from '../Menu/Menu';
import { TabContext } from '../Tab/TabContext';
import type { TabSize, TabVariant } from '../Tab/Tab';
import '../../styles/tokens.css';

export type TabListOrientation = 'Horizontal' | 'Vertical';

/**
 * What happens to the tabs that do not fit the list: `none` lets a Horizontal
 * row scroll sideways (a Vertical one is left to the layout), `menu` hides them
 * behind a "…" button that opens a menu of them.
 */
export type TabListOverflow = 'none' | 'menu';

export interface TabListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Variant of every tab in the list. */
  variant?: TabVariant;
  /** Size of every tab in the list. L by default; a Popup, a Dropdown and a Dialog make it M when a list has no size. */
  size?: TabSize;
  /** Figma Position. */
  orientation?: TabListOrientation;
  /** Selected tab (controlled). Matches the `value` of a `Tab`. */
  value?: string;
  /** Initially selected tab (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * What happens to the tabs that do not fit the width of the list (the
   * height, when it is Vertical). `menu` shows the tabs that fit and hides the
   * rest behind a "…" button at the end of the list, which opens a menu of the
   * hidden ones. The list measures the room it has, so give it a container
   * that does not grow with it: a width of its own, or one that shrinks
   * (`min-width: 0` in a flex row); for Vertical, a height.
   */
  overflow?: TabListOverflow;
  /** Accessible name of the "…" button and of its menu, with `overflow="menu"`. */
  moreLabel?: string;
}

/** Set on a tab that does not fit (`overflow="menu"`): it is out of the layout and out of reach. */
const HIDDEN = 'data-overflow-hidden';

const isSelected = (tab: HTMLElement) => tab.getAttribute('aria-selected') === 'true';

/**
 * Shows the tabs that fit the wrapper and hides the rest (`overflow="menu"`).
 * It measures the natural size of every tab (a hidden tab keeps its size, see
 * the CSS), keeps as many from the start as leave room for the "…" button, and
 * marks the others. Everything is done on the elements, so it takes no render
 * and cannot flicker: it runs in a layout effect, before the browser paints.
 * When the selected tab is one of the hidden ones the "…" button is marked as
 * the current one, and the first tab becomes the list's tab stop, so the
 * keyboard can still get in.
 */
function fitTabs(
  wrapper: HTMLElement,
  list: HTMLElement,
  more: HTMLElement,
  vertical: boolean,
  state: { forced: HTMLElement | null },
) {
  const tabs = Array.from(list.querySelectorAll<HTMLElement>(':scope > [role="tab"]'));
  const extent = (element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    return vertical ? box.height : box.width;
  };
  const style = getComputedStyle(list);
  const gap = parseFloat(vertical ? style.rowGap : style.columnGap) || 0;
  const available = extent(wrapper);
  const sizes = tabs.map(extent);
  const total = sizes.reduce((sum, size) => sum + size, 0) + gap * Math.max(0, tabs.length - 1);

  let count = tabs.length;
  if (total > available + 0.5) {
    // The "…" button takes room too: keep the tabs that fit beside it.
    let used = extent(more);
    count = 0;
    for (const size of sizes) {
      if (used + gap + size > available + 0.5) break;
      used += gap + size;
      count += 1;
    }
  }

  tabs.forEach((tab, index) => tab.toggleAttribute(HIDDEN, index >= count));
  wrapper.toggleAttribute('data-overflowing', count < tabs.length);

  // The selected tab is hidden: the "…" button stands for it, and the first tab is the tab stop.
  const selected = tabs.findIndex(isSelected);
  const current = selected >= count;
  more.toggleAttribute('data-current', current);
  if (state.forced && state.forced !== tabs[selected]) state.forced.tabIndex = -1;
  state.forced = null;
  if (current && count > 0) {
    tabs[0].tabIndex = 0;
    state.forced = tabs[0];
  }
}

/** Takes the marks of `fitTabs` off again. */
function resetTabs(wrapper: HTMLElement, list: HTMLElement, more: HTMLElement, state: { forced: HTMLElement | null }) {
  for (const tab of Array.from(list.querySelectorAll<HTMLElement>(`:scope > [${HIDDEN}]`))) tab.removeAttribute(HIDDEN);
  wrapper.removeAttribute('data-overflowing');
  more.removeAttribute('data-current');
  if (state.forced && !isSelected(state.forced)) state.forced.tabIndex = -1;
  state.forced = null;
}

/** The hidden tabs as the items of the menu: choosing one presses that tab. */
function hiddenItems(list: HTMLElement): MoreMenuItem[] {
  return Array.from(list.querySelectorAll<HTMLElement>(`:scope > [role="tab"][${HIDDEN}]`)).map((tab, index) => ({
    key: tab.id || String(index),
    label: tab.getAttribute('aria-label') || tab.textContent?.trim() || tab.title || 'Tab',
    selected: isSelected(tab),
    disabled: (tab as HTMLButtonElement).disabled,
    onSelect: () => tab.click(),
  }));
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
  if (!tab || tab.offsetWidth === 0 || tab.hasAttribute(HIDDEN)) {
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

/** The tab each row was last scrolled to (see `revealSelected`). */
const revealedFor = new WeakMap<HTMLElement, HTMLElement>();

/** The room the CSS keeps at both ends of a scrolling row for the focus ring (TabList.module.css). */
const RING_ROOM = 4;

/**
 * Brings the selected tab of a row that scrolls sideways (more tabs than room)
 * into view, so a tab that is chosen, or selected from outside, is never left
 * half hidden. Only a different selected tab moves the row, so it can be
 * scrolled by hand without being pulled back. The first time it jumps; later
 * it eases, unless the person asked for reduced motion. It moves the row only,
 * never the page. A hidden list is left for the next render.
 */
function revealSelected(list: HTMLElement) {
  const tab = list.querySelector<HTMLElement>(':scope > [role="tab"][aria-selected="true"]');
  if (!tab) {
    revealedFor.delete(list);
    return;
  }
  if (list.clientWidth === 0 || revealedFor.get(list) === tab) return;
  const first = !revealedFor.has(list);
  revealedFor.set(list, tab);
  if (list.scrollWidth <= list.clientWidth) return;
  const box = list.getBoundingClientRect();
  const rect = tab.getBoundingClientRect();
  const toStart = rect.left - (box.left + RING_ROOM);
  const toEnd = rect.right - (box.right - RING_ROOM);
  // A tab wider than the row is brought to its start.
  const delta = toStart < 0 ? toStart : toEnd > 0 ? Math.min(toEnd, toStart) : 0;
  if (delta === 0) return;
  const still = first || window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  list.scrollBy?.({ left: delta, behavior: still ? 'auto' : 'smooth' });
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
 *
 * A Horizontal list with more tabs than it has room for does not wrap: it
 * scrolls sideways, without a scrollbar, and brings the selected tab into view
 * when another one is selected.
 *
 * With `overflow="menu"` the tabs that do not fit the width (the height, when
 * Vertical) are hidden behind a "…" button at the end of the list. The button
 * opens a menu of the hidden tabs (below the list, beside it when Vertical);
 * choosing one selects that tab. While the selected tab is hidden the button
 * has the selected look. The button sits outside the `tablist` element, which
 * keeps only tabs, and the arrow keys skip the hidden tabs.
 */
export function TabList({
  variant = 'Primary',
  size = 'L',
  orientation = 'Horizontal',
  value: valueProp,
  defaultValue,
  onValueChange,
  overflow = 'none',
  moreLabel = 'More tabs',
  className,
  style,
  children,
  onKeyDown,
  ...rest
}: TabListProps) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const ref = useRef<HTMLDivElement>(null);
  const menuOverflow = overflow === 'menu';
  const vertical = orientation === 'Vertical';
  const wrapper = useRef<HTMLDivElement>(null);
  const more = useRef<HTMLButtonElement>(null);
  const [hidden, setHidden] = useState<MoreMenuItem[]>([]);

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
  // A row that scrolls sideways shows the selected tab (after the underline, which is placed in the content).
  const scrolls = !menuOverflow && !vertical;
  useLayoutEffect(() => {
    const list = ref.current;
    if (list && scrolls) revealSelected(list);
  });

  // overflow="menu": keep the tabs that fit, hide the rest behind the "…" button. It
  // runs again when the room changes (the wrapper), when a tab changes size (a font
  // that loads, a new label), when tabs come or go, and after every render.
  const fit = useRef<(() => void) | undefined>(undefined);
  useLayoutEffect(() => {
    const box = wrapper.current;
    const list = ref.current;
    const button = more.current;
    if (!menuOverflow || !box || !list || !button) return undefined;
    const state: { forced: HTMLElement | null } = { forced: null };
    const measure = () => {
      fitTabs(box, list, button, vertical, state);
      if (slides) placeUnderline(list, false);
    };
    fit.current = measure;
    measure();
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    const watch = () => {
      resize?.disconnect();
      resize?.observe(box);
      resize?.observe(button);
      for (const tab of Array.from(list.children)) resize?.observe(tab);
    };
    watch();
    const mutation = new MutationObserver(() => {
      watch();
      measure();
    });
    mutation.observe(list, { childList: true });
    void document.fonts?.ready.then(measure);
    return () => {
      fit.current = undefined;
      resize?.disconnect();
      mutation.disconnect();
      resetTabs(box, list, button, state);
    };
  }, [menuOverflow, vertical, slides]);
  useLayoutEffect(() => {
    fit.current?.();
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const vertical = orientation === 'Vertical';
    const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    if (![previousKey, nextKey, 'Home', 'End'].includes(event.key)) return;

    const tabs = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>(`[role="tab"]:not(:disabled):not([${HIDDEN}])`) ?? [],
    );
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

  const list = (
    <div
      ref={ref}
      role="tablist"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={[styles.list, styles[orientation.toLowerCase()], !menuOverflow && className].filter(Boolean).join(' ')}
      style={menuOverflow ? undefined : style}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );

  return (
    <TabContext.Provider value={context}>
      {menuOverflow ? (
        <div
          ref={wrapper}
          className={[styles.overflow, styles[`overflow-${orientation.toLowerCase()}`], className].filter(Boolean).join(' ')}
          style={style}
          data-variant={variant.toLowerCase()}
        >
          {list}
          <MoreMenu
            ref={more}
            label={moreLabel}
            size={size}
            className={styles.more}
            placement={vertical ? 'right-start' : 'bottom-start'}
            items={hidden}
            onOpenChange={(open) => {
              // The menu lists the tabs that are hidden right now.
              if (open && ref.current) setHidden(hiddenItems(ref.current));
            }}
          />
        </div>
      ) : (
        list
      )}
    </TabContext.Provider>
  );
}

export default TabList;
