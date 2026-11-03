import { createContext, useContext, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref, RefObject } from 'react';
import styles from './Menu.module.css';
import { Button } from '../Button/Button';
import type { ButtonSize } from '../Button/Button';
import { Icon } from '../Icon';
import { Popover } from '../Popover/Popover';
import type { PopoverCloseReason, PopoverPlacement } from '../Popover/Popover';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Why the menu asked to close: a Popover reason, or `select` when an item was chosen. */
export type MenuCloseReason = PopoverCloseReason | 'select';

const MenuContext = createContext<{ close: () => void } | null>(null);

const ITEMS = '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])';

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Whether the menu is open (controlled). */
  open: boolean;
  /**
   * Called when the menu asks to close: Escape, a press outside it and its
   * anchor, the focus leaving it, or an item being chosen. Set `open` to false
   * in response.
   */
  onOpenChange: (open: boolean, reason: MenuCloseReason) => void;
  /** The element the menu opens from, usually the button that toggles it. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Where the menu sits against its anchor. Defaults to below it, lined up with its start edge. */
  placement?: PopoverPlacement;
  /** The `MenuItem`s. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Impact DS Menu — the list that a "…" button opens, for the items that did not
 * fit (the folded pages of a Breadcrumb, the tabs that do not fit a navigation
 * bar). It has no Figma counterpart: Figma draws the "…" button only. It is a
 * `Popover` (top layer, placed against the anchor, flips when there is no
 * room, scrolls when it is taller than the room) with a panel like the Figma
 * Popup (background/primary, cornerRadius/m, Shadow M) around rows drawn like a
 * Secondary Tab of size L: text only, filled on hover, and the selected row
 * filled with a ring.
 *
 * It has the menu semantics: `role="menu"` (give it an `aria-label`), items
 * with `role="menuitem"` or, when they have a `selected` state,
 * `menuitemradio`. The focus moves to the selected item (the first one when
 * none is selected) when it opens; Up and Down, Home and End move it, Escape
 * closes the menu and gives the focus back to the anchor, Tab leaves it, and
 * choosing an item closes it.
 */
export function Menu({
  open,
  onOpenChange,
  anchorRef,
  placement = 'bottom-start',
  children,
  onKeyDown,
  ref,
  ...rest
}: MenuProps) {
  const element = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => element.current as HTMLDivElement);

  // The focus goes to the selected item, or the first one, when the menu opens.
  useLayoutEffect(() => {
    if (!open) return;
    const items = Array.from(element.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []);
    const target = items.find((item) => item.getAttribute('aria-checked') === 'true') ?? items[0] ?? element.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest' });
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEMS));
    if (event.key === 'Tab') {
      onOpenChange(false, 'focus-out');
      return;
    }
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next: number;
    if (event.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    items[next].focus();
    items[next].scrollIntoView({ block: 'nearest' });
  };

  return (
    <MenuContext.Provider value={{ close: () => onOpenChange(false, 'select') }}>
      <Popover
        {...rest}
        ref={element}
        role="menu"
        open={open}
        onOpenChange={onOpenChange}
        anchorRef={anchorRef}
        placement={placement}
        autoFocus={false}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.menu}>{children}</div>
      </Popover>
    </MenuContext.Provider>
  );
}

export interface MenuItemProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel' | 'download'> {
  /** The text of the item. */
  children?: ReactNode;
  /**
   * Draws the item as the selected one (a filled row with a ring) and makes it
   * a `menuitemradio`. Leave it out for a plain `menuitem`.
   */
  selected?: boolean;
  /** Dims the item (30%, as a disabled Button) and keeps it from being chosen. */
  disabled?: boolean;
  /** Called when the item is chosen; the menu closes afterwards. */
  onSelect?: () => void;
  /** Makes the item a link (an `a`) instead of a button. */
  href?: string;
}

/**
 * One row of a `Menu`: a button, or a link when it has an `href`. Choosing it
 * calls `onSelect` (and `onClick`) and closes the menu.
 */
export function MenuItem({ children, selected, disabled, onSelect, href, className, onClick, ...rest }: MenuItemProps) {
  const menu = useContext(MenuContext);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    onSelect?.();
    menu?.close();
  };
  const shared = {
    role: selected === undefined ? 'menuitem' : 'menuitemradio',
    'aria-checked': selected,
    'aria-disabled': disabled || undefined,
    tabIndex: -1,
    className: [styles.item, className].filter(Boolean).join(' '),
    onClick: handleClick,
    ...rest,
  };
  const label = <span className={styles.label}>{children}</span>;
  return href !== undefined ? (
    <a href={href} {...shared}>
      {label}
    </a>
  ) : (
    <button type="button" {...shared}>
      {label}
    </button>
  );
}

export type MoreMenuItem = Omit<MenuItemProps, 'children'> & {
  /** The text of the item. */
  label: ReactNode;
  /** Tells the item apart from the others (the item's index is used when it is left out). */
  key?: string;
};

export interface MoreMenuProps {
  /** The items the menu lists: the ones that did not fit. */
  items: MoreMenuItem[];
  /** Accessible name of the "…" button and of the menu. */
  label?: string;
  /** Size of the "…" button (a Tertiary Button, icon only). */
  size?: ButtonSize;
  /** Where the menu opens. Defaults to below the button, lined up with its start edge. */
  placement?: PopoverPlacement;
  /** For the "…" button, e.g. to place it in a layout. */
  className?: string;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** The "…" button. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Impact DS "More" menu — the "…" button of Figma's Breadcrumb and navigation
 * (a Tertiary Button, icon only, with the more glyph) and the `Menu` it opens,
 * listing the `items` that did not fit. The button is a menu button
 * (`aria-haspopup="menu"`, `aria-expanded`); pressing it again closes the menu.
 */
export function MoreMenu({
  items,
  label = 'More',
  size = 'L',
  placement = 'bottom-start',
  className,
  onOpenChange,
  ref,
}: MoreMenuProps) {
  const anchor = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => anchor.current as HTMLButtonElement);
  const id = useId();
  const [open, setOpen] = useState(false);
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <>
      <Button
        ref={anchor}
        type="button"
        hierarchy="Tertiary"
        size={size}
        icon="Only"
        iconElement={<Icon name="more" size={size === 'XL' ? 32 : 24} />}
        className={className}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => change(!open)}
      />
      <Menu id={id} aria-label={label} anchorRef={anchor} placement={placement} open={open} onOpenChange={(next) => change(next)}>
        {items.map(({ label: text, key, ...item }, index) => (
          <MenuItem key={key ?? index} {...item}>
            {text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default Menu;
