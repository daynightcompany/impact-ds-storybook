import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, HTMLAttributes, PointerEvent, ReactNode } from 'react';
import styles from './Tooltip.module.css';
import { Icon } from '../Icon';
import { Popover } from '../Popover/Popover';
import type { PopoverPlacement } from '../Popover/Popover';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Icon` (true/false): the copy icon after the text. */
  icon?: boolean;
  /** Replaces the default copy icon. */
  iconElement?: ReactNode;
  children?: ReactNode;
}

/**
 * Impact DS Tooltip — converted from the Figma "Tooltip" component set (node
 * 9587:5993 in the SMAL Impact Design System (Public) Figma file).
 * A dark bubble with one line of text and, optionally, a copy icon. Figma
 * defines only the bubble. To show it next to an element on hover and focus,
 * wrap the element in <TooltipTrigger>; to place it yourself, point the
 * element at the bubble with `aria-describedby`.
 */
export function Tooltip({
  icon = true,
  iconElement,
  children = 'Tooltip',
  className,
  ...rest
}: TooltipProps) {
  return (
    <div role="tooltip" className={[styles.tooltip, className].filter(Boolean).join(' ')} {...rest}>
      <span className={styles.text}>{children}</span>
      {icon && <span className={styles.icon}>{iconElement ?? <Icon name="copy" />}</span>}
    </div>
  );
}

export interface TooltipTriggerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** What the bubble says. */
  content: ReactNode;
  /**
   * The element the tooltip is about, such as a Button or a TextLink. It
   * should take the focus, so the keyboard can reach the tooltip, and it is
   * described by the bubble (`aria-describedby`).
   */
  children: ReactNode;
  /** Where the bubble sits against the trigger. It is centred on it, above it by default, and flips to the opposite side when there is no room. */
  placement?: PopoverPlacement;
  /** Figma `Icon`: the copy icon after the text. Off here, since most tooltips only name their trigger. */
  icon?: boolean;
  /** Replaces the default copy icon. */
  iconElement?: ReactNode;
  /** How long the pointer rests on the trigger before the bubble appears, in milliseconds. Keyboard focus shows it at once. */
  showDelay?: number;
  /** How long the bubble stays after the pointer has left the trigger and the bubble, in milliseconds. */
  hideDelay?: number;
  /** Controlled: whether the bubble is shown. Leave it out and the trigger shows it on hover and focus by itself. */
  open?: boolean;
  /** Called when the bubble asks to show or hide: hover, focus, Escape or a press. */
  onOpenChange?: (open: boolean) => void;
  /** Turns the tooltip off: only the children are rendered. */
  disabled?: boolean;
}

/**
 * Impact DS Tooltip trigger — makes the Tooltip bubble pop up next to an
 * element. It has no Figma counterpart: Figma draws the bubble only.
 *
 * The bubble appears when the pointer rests on the trigger for `showDelay`
 * and when the trigger takes the focus from the keyboard (at once), and goes
 * away when the pointer or the focus leaves, after `hideDelay`; it stays
 * while the pointer is on the bubble itself, so its text can be read and
 * selected. Escape and a press on the trigger close it. Touch does not show
 * it, so the trigger must not depend on it. It is placed with the Popover (in
 * the browser's top layer, so nothing clips it, flipped at the edge of the
 * viewport), fades and slides in as every popup does, and the trigger is
 * pointed at it with `aria-describedby`, also while it is hidden.
 *
 * The children sit in an inline wrapper (the popover's anchor); give it a
 * `className` to change its layout.
 */
export function TooltipTrigger({
  content,
  children,
  placement = 'top',
  icon = false,
  iconElement,
  showDelay = 200,
  hideDelay = 100,
  open: openProp,
  onOpenChange,
  disabled = false,
  className,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onFocus,
  onBlur,
  ...rest
}: TooltipTriggerProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const id = useId();
  const [shown, setShown] = useState(false);
  const controlled = openProp !== undefined;
  const open = !disabled && (controlled ? openProp : shown);

  // The latest props, for the timers.
  const latest = useRef({ controlled, onOpenChange });
  useLayoutEffect(() => {
    latest.current = { controlled, onOpenChange };
  });
  const request = (next: boolean) => {
    if (!latest.current.controlled) setShown(next);
    latest.current.onOpenChange?.(next);
  };

  const timer = useRef<number | undefined>(undefined);
  const cancel = () => window.clearTimeout(timer.current);
  const later = (next: boolean, delay: number) => {
    cancel();
    if (delay > 0) timer.current = window.setTimeout(() => request(next), delay);
    else request(next);
  };
  useEffect(() => cancel, []);

  if (disabled) return <>{children}</>;

  // The bubble is a DOM child of the wrapper, so the pointer moving from the trigger onto the
  // bubble is still "inside" it (pointerleave fires only if it crosses the gap and takes longer
  // than `hideDelay`).
  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerEnter?.(event);
    if (event.pointerType === 'touch') return;
    if (open) cancel();
    else later(true, showDelay);
  };
  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerLeave?.(event);
    if (event.pointerType === 'touch') return;
    later(false, hideDelay);
  };
  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);
    // Pressing the trigger hides the bubble (it would be in the way); pressing the bubble does not.
    if (bubble.current?.contains(event.target as Node)) return;
    later(false, 0);
  };
  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    onFocus?.(event);
    // A click focuses a button too, but only the keyboard is a reason to show the bubble.
    if (!event.target.matches(':focus-visible')) return;
    later(true, 0);
  };
  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    onBlur?.(event);
    later(false, 0);
  };

  const trigger = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], id].filter(Boolean).join(' '),
      })
    : children;

  return (
    <span
      {...rest}
      ref={anchor}
      className={[styles.trigger, className].filter(Boolean).join(' ')}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {trigger}
      <Popover
        ref={bubble}
        id={id}
        role="tooltip"
        className={styles.popover}
        anchorRef={anchor}
        open={open}
        onOpenChange={(next) => later(next, 0)}
        placement={placement}
        autoFocus={false}
        restoreFocus={false}
        keepMounted
      >
        {/* The popover is the tooltip for assistive technology; the bubble is only its look. */}
        <Tooltip role="presentation" icon={icon} iconElement={iconElement}>
          {content}
        </Tooltip>
      </Popover>
    </span>
  );
}

export default Tooltip;
