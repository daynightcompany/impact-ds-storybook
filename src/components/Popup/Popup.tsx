import type { CSSProperties, HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import styles from './Popup.module.css';
import { Popover, type PopoverCloseReason, type PopoverPlacement } from '../Popover/Popover';
import { footerSlot, isShown, searchSlot, tabsSlot, type Slot } from './PopupParts';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface PopupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma boolean "Search". `true` shows an empty search field; pass your own
   * <Search> (with its `value` and `onChange`) to filter the list.
   */
  search?: Slot;
  /**
   * Figma boolean "Tabs". `true` shows a Primary tab list of placeholder tabs;
   * pass your own <TabList> to use real ones. The tabs are size M here (40 high,
   * like the Button M and the Chip M); a <TabList> with its own `size` keeps it.
   */
  tabs?: Slot;
  /**
   * Figma boolean "Footer". `true` shows the 3 CTA footer (Tertiary at the
   * start, Secondary and Primary at the end, one under another on Mobile); pass
   * your own <DialogFooter> to name the buttons and handle them (give it
   * `stackOnMobile` to stack its buttons on Mobile too).
   */
  footer?: Slot;
  /** The list: Figma has a Cell group of checkbox cells here. It is the part that scrolls. */
  children?: ReactNode;
  /** Width of the panel: a number of pixels or any CSS length. The default is the Figma width, the 375 wide sheet on Mobile; it never exceeds the space it is in. */
  width?: number | string;
  /**
   * Opens the popup from an element as a popover (see <Popover>): set it to the
   * ref of the button that toggles the popup, and control `open`. Without it the
   * popup is just the panel, in the flow.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /** The popup is open. Only with `anchorRef`. */
  open?: boolean;
  /** Called when the popup asks to close: Escape, a press outside, the focus leaving. Only with `anchorRef`. */
  onOpenChange?: (open: boolean, reason: PopoverCloseReason) => void;
  /** Only with `anchorRef`. */
  placement?: PopoverPlacement;
  /** Only with `anchorRef`: the gap to the anchor, in pixels (spacing/s unless given). */
  offset?: number;
  /** Only with `anchorRef`: makes the popup as wide as the anchor instead of `width`. */
  matchAnchorWidth?: boolean;
  /** Only with `anchorRef`: moves the focus into the popup when it opens. */
  autoFocus?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Impact DS Popup — converted from the Figma "Popup/Dropdown" component (node
 * 9723:19631): a panel with spacing/m padding and between its
 * parts, a Search field, a row of Tabs, a list (a Cell group of checkbox cells)
 * and a Footer, on the primary background with the M corner radius and Shadow M.
 * The booleans Search, Tabs and Footer are props (all on in Figma); turn them
 * off for a simple dropdown popover that is only a list.
 *
 * The panel is as tall as its parts. When it has a height limit (a popover has,
 * the room that is left in the viewport), the Search, Tabs and Footer stay and
 * the list scrolls.
 *
 * Figma draws the Popup for Desktop only and has its Mobile form in the Dialog
 * (Form=Select), so on the Mobile breakpoint the Popup takes that form: the
 * panel is the 375 wide sheet (as wide as the viewport, 688 at the most), with a
 * drag handle above it and the footer buttons one under another. The handle
 * belongs to a sheet, so a popup that opens from an element and a plain list
 * (no Search, Tabs or Footer, as under a Dropdown) do not have it. A `width`
 * you set is kept.
 *
 * Give it an `anchorRef` and it opens from that element as a popover: pair it
 * with a <Dropdown> as in the "Dropdown with a popup" story. `aria-label`,
 * `aria-labelledby` and `id` then go to the popover (a dialog); everything else
 * to the panel.
 */
export function Popup({
  search = true,
  tabs = true,
  footer = true,
  children,
  width,
  anchorRef,
  open = false,
  onOpenChange,
  placement,
  offset,
  matchAnchorWidth,
  autoFocus,
  className,
  style,
  ref,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: PopupProps) {
  const anchored = anchorRef !== undefined;
  const widthStyle = width !== undefined ? ({ '--popup-width': typeof width === 'number' ? `${width}px` : width } as CSSProperties) : undefined;

  const searchNode = searchSlot(search);
  const tabsNode = tabsSlot(tabs);
  const footerNode = footerSlot(footer, { buttonWidth: '3 CTA', stackOnMobile: true });
  // The drag handle of the Mobile sheet: not for a popover, nor for a plain list under a Dropdown.
  const sheet = !anchored && (isShown(searchNode) || isShown(tabsNode) || isShown(footerNode));

  const panel = (
    <div className={styles.sheet} style={widthStyle}>
      {sheet && <div className={styles.handle} aria-hidden />}
      <div
        {...rest}
        ref={ref}
        id={anchored ? undefined : id}
        aria-label={anchored ? undefined : ariaLabel}
        aria-labelledby={anchored ? undefined : ariaLabelledBy}
        className={[styles.popup, className].filter(Boolean).join(' ')}
        style={{ ...widthStyle, ...style }}
      >
        {isShown(searchNode) && <div className={styles.fixed}>{searchNode}</div>}
        {isShown(tabsNode) && <div className={`${styles.fixed} ${styles.tabs}`}>{tabsNode}</div>}
        {children != null && <div className={styles.list}>{children}</div>}
        {isShown(footerNode) && <div className={`${styles.fixed} ${styles.footer}`}>{footerNode}</div>}
      </div>
    </div>
  );

  if (!anchored) return panel;

  return (
    <Popover
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      anchorRef={anchorRef}
      open={open}
      onOpenChange={onOpenChange}
      placement={placement}
      offset={offset}
      matchAnchorWidth={matchAnchorWidth}
      autoFocus={autoFocus}
    >
      {panel}
    </Popover>
  );
}

export default Popup;
