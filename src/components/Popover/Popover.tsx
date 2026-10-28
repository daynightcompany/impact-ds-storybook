import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import styles from './Popover.module.css';
import '../../styles/tokens.css';

/** Where the popover sits against its anchor. It flips to the other side when there is no room. */
export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/** Why the popover asked to close: Escape, a press outside, or the focus moving away. */
export type PopoverCloseReason = 'escape' | 'outside' | 'focus-out';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'popover' | 'onToggle'> {
  /** Whether the popover is open (controlled). */
  open: boolean;
  /**
   * Called when the popover asks to close: Escape, a press outside it and its
   * anchor, or the focus leaving both. Set `open` to false in response.
   */
  onOpenChange?: (open: boolean, reason: PopoverCloseReason) => void;
  /** The element the popover opens from, usually the button that toggles it. */
  anchorRef: RefObject<HTMLElement | null>;
  /** `bottom-start` lines the popover's start edge up with the anchor's, below it. */
  placement?: PopoverPlacement;
  /** Gap between the anchor and the popover, in px. Defaults to spacing/s (16px), the gap in the Figma Dropdown demo. */
  offset?: number;
  /** Makes the popover as wide as the anchor (`--popover-width`). */
  matchAnchorWidth?: boolean;
  /** Moves the focus into the popover when it opens. Turn it off for a popover that only informs. */
  autoFocus?: boolean;
  /** Keeps the children mounted while the popover is closed (their state survives). */
  keepMounted?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Keeps the popover this far from the edges of the viewport, in px. */
const VIEWPORT_MARGIN = 8;
/** The popover never gets squeezed below this height before it flips or scrolls, in px. */
const MIN_HEIGHT = 96;
/** The gap to the anchor when the CSS does not say (spacing/s), in px. */
const DEFAULT_OFFSET = 16;

/** The gap to the anchor from the CSS (`--popover-offset`, which follows spacing/s), in px. */
function cssOffset(element: HTMLElement): number {
  const value = parseFloat(getComputedStyle(element).getPropertyValue('--popover-offset'));
  return Number.isFinite(value) ? value : DEFAULT_OFFSET;
}

const SUPPORTS_POPOVER =
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';

const FOCUSABLE =
  'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';

function isTabbable(element: HTMLElement): boolean {
  if ((element as HTMLButtonElement).disabled) return false;
  if (element.getAttribute('tabindex') === '-1') return false;
  if (element.getClientRects().length === 0) return false;
  // In a radio group only the checked radio (or the first one) is a tab stop.
  if (element instanceof HTMLInputElement && element.type === 'radio' && element.name && !element.checked) {
    const root = element.form ?? element.ownerDocument;
    const group = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]')).filter(
      (radio) => radio.name === element.name,
    );
    if (group.some((radio) => radio.checked)) return false;
  }
  return true;
}

function firstFocusable(root: HTMLElement): HTMLElement | null {
  const marked = root.querySelector<HTMLElement>('[autofocus], [data-autofocus]');
  if (marked) return marked;
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).find(isTabbable) ?? null;
}

/**
 * Impact DS Popover — the positioned, top-layer shell behind a popup that opens
 * from an element, such as the dropdown's <Popup>. It has no Figma counterpart:
 * Figma draws the popup panel only.
 *
 * The popover is in the browser's top layer (the Popover API), so no ancestor
 * can clip it and it needs no z-index. It is placed against `anchorRef` with
 * `position: fixed`, flips above the anchor when there is no room below, and
 * limits its height (`--popover-max-height`) to the room that is left, so a
 * long list inside scrolls. It follows the anchor on scroll and resize.
 *
 * It fades and slides in from the anchor (ease out, 300ms, the easing of the
 * Figma prototypes) and out again (150ms); with a reduced-motion preference it
 * only appears and disappears. Its children stay in the page until it is gone.
 *
 * The anchor owns the toggle: open on its click and close on its next one.
 * The popover closes by itself on Escape, on a press outside it and on focus
 * moving away, by calling `onOpenChange(false, reason)`; the focus returns to
 * the anchor after Escape or when the app closes it from inside. It has
 * `role="dialog"`: give it an `aria-label`, and point the anchor's
 * `aria-controls` at its `id`.
 */
export function Popover({
  open,
  onOpenChange,
  anchorRef,
  placement = 'bottom-start',
  offset,
  matchAnchorWidth = false,
  autoFocus = true,
  keepMounted = false,
  role = 'dialog',
  className,
  style,
  children,
  onBlur,
  ref,
  ...rest
}: PopoverProps) {
  const element = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => element.current as HTMLDivElement);

  // The latest callback, so the listeners below don't resubscribe on every render.
  const changeRef = useRef(onOpenChange);
  useLayoutEffect(() => {
    changeRef.current = onOpenChange;
  });

  // Set when the user moved on by themselves: the focus must not jump back to the anchor.
  const skipRestoreFocus = useRef(false);
  const wasOpen = useRef(false);

  // The children stay in the page while the popover fades out (see below).
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);

  // Show and hide in the top layer.
  useLayoutEffect(() => {
    const el = element.current;
    if (open) {
      if (el && SUPPORTS_POPOVER && !el.matches(':popover-open')) {
        // The side it slides in from (see the CSS) is the one asked for, until place() decides.
        el.dataset.side = placement.startsWith('top') ? 'top' : 'bottom';
        el.showPopover();
      }
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    // Closing from inside (Escape, Apply, picking an option): the focus goes back to the anchor.
    const active = document.activeElement;
    const focusWasInside = !active || active === document.body || Boolean(el?.contains(active));
    if (el && SUPPORTS_POPOVER && el.matches(':popover-open')) el.hidePopover();
    if (focusWasInside && !skipRestoreFocus.current) {
      // After the key press or click that closed it: moved at once, a keydown (Enter in a list)
      // would go on to press the anchor button as well and open the popover again.
      window.setTimeout(() => {
        const now = document.activeElement;
        // The focus can still be inside while the popover fades out.
        if (!now || now === document.body || el?.contains(now)) anchorRef.current?.focus({ preventScroll: true });
      }, 0);
    }
    skipRestoreFocus.current = false;
  }, [open, placement, anchorRef]);

  // Once the fade-out has run, take the children out of the page. Without the
  // Popover API, or with reduced motion, there is nothing to wait for.
  useLayoutEffect(() => {
    if (open || !present) return;
    const running = SUPPORTS_POPOVER ? (element.current?.getAnimations() ?? []) : [];
    if (running.length === 0) {
      setPresent(false);
      return;
    }
    let cancelled = false;
    void Promise.allSettled(running.map((animation) => animation.finished)).then(() => {
      if (!cancelled) setPresent(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, present]);

  // Place it against the anchor, and keep it there.
  useLayoutEffect(() => {
    if (!open) return;
    const el = element.current;
    const anchor = anchorRef.current;
    if (!el || !anchor) return;

    const place = () => {
      const gap = offset ?? cssOffset(el);
      const a = anchor.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      // Measure the popover at its natural size first.
      el.style.removeProperty('--popover-max-height');
      if (matchAnchorWidth) el.style.setProperty('--popover-width', `${a.width}px`);
      else el.style.removeProperty('--popover-width');
      const width = el.offsetWidth;
      const naturalHeight = el.offsetHeight;

      const roomBelow = viewportHeight - a.bottom - gap - VIEWPORT_MARGIN;
      const roomAbove = a.top - gap - VIEWPORT_MARGIN;
      const preferred = placement.startsWith('top') ? 'top' : 'bottom';
      const room = { top: roomAbove, bottom: roomBelow };
      const other = preferred === 'top' ? 'bottom' : 'top';
      const side = naturalHeight <= room[preferred] || room[preferred] >= room[other] ? preferred : other;

      const height = Math.min(naturalHeight, Math.max(MIN_HEIGHT, room[side]));
      const top = side === 'bottom' ? a.bottom + gap : a.top - gap - height;
      const left = placement.endsWith('end') ? a.right - width : a.left;

      el.style.setProperty('--popover-max-height', `${height}px`);
      el.style.top = `${Math.round(top * 100) / 100}px`;
      el.style.left = `${Math.round(Math.min(Math.max(VIEWPORT_MARGIN, left), viewportWidth - width - VIEWPORT_MARGIN) * 100) / 100}px`;
      el.dataset.side = side;
    };

    place();

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    observer.observe(anchor);
    window.addEventListener('resize', schedule);
    // Capture: a scroll in any ancestor of the anchor moves it.
    document.addEventListener('scroll', schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      document.removeEventListener('scroll', schedule, true);
    };
  }, [open, placement, offset, matchAnchorWidth, anchorRef]);

  // Move the focus in.
  useLayoutEffect(() => {
    if (!open || !autoFocus) return;
    const el = element.current;
    if (!el) return;
    (firstFocusable(el) ?? el).focus({ preventScroll: true });
  }, [open, autoFocus]);

  // Escape and a press outside close it.
  useEffect(() => {
    if (!open) return;
    const el = element.current;
    const anchor = anchorRef.current;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || el?.contains(target) || anchor?.contains(target)) return;
      skipRestoreFocus.current = true;
      changeRef.current?.(false, 'outside');
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      changeRef.current?.(false, 'escape');
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, anchorRef]);

  // The focus moving to something outside the popover and its anchor closes it.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    const next = event.relatedTarget as Node | null;
    if (!next || event.currentTarget.contains(next) || anchorRef.current?.contains(next)) return;
    skipRestoreFocus.current = true;
    changeRef.current?.(false, 'focus-out');
  };

  return (
    <div
      {...rest}
      ref={element}
      role={role}
      tabIndex={-1}
      popover={SUPPORTS_POPOVER ? 'manual' : undefined}
      data-open={open ? 'true' : 'false'}
      className={[styles.popover, !SUPPORTS_POPOVER && styles.fallback, className].filter(Boolean).join(' ')}
      style={style}
      onBlur={handleBlur}
    >
      {(open || present || keepMounted) && children}
    </div>
  );
}

export default Popover;
