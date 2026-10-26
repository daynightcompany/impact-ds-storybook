import { useLayoutEffect } from 'react';

/**
 * Breakpoint mode of the design tokens: Desktop (1920, the default) or
 * Mobile (375).
 *
 * tokens.css ships Mobile as four attribute blocks, one per Figma variable
 * collection. Switching mode means setting all four attributes on <html>
 * (tokens.text-modes.css relies on <html> too); Desktop is simply none of
 * them. The components are not breakpoint-aware themselves: they only read
 * tokens, so every size follows this switch.
 *
 * If the attribute names change after a tokens re-export, update
 * MOBILE_ATTRIBUTES. Nothing else needs to change.
 */
export type BreakpointMode = 'desktop' | 'mobile';

export const MOBILE_ATTRIBUTES: Readonly<Record<string, string>> = {
  'data-breakpoint': '375-mobile',
  'data-spacing': 'impact-mobile',
  'data-font': 'impact-mobile',
  'data-radius': 'impact-mobile',
};

/** Viewports narrower than this many px use the Mobile tokens. */
export const MOBILE_BREAKPOINT = 768;

/** Set (mobile) or clear (desktop) the token attributes on <html>. */
export function applyBreakpoint(mode: BreakpointMode): void {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(MOBILE_ATTRIBUTES)) {
    if (mode === 'mobile') root.setAttribute(name, value);
    else root.removeAttribute(name);
  }
}

/**
 * Follow the viewport width: Mobile below MOBILE_BREAKPOINT, Desktop at and
 * above it. Returns a function that stops listening. Use it directly outside
 * React, or call it before the first render to avoid a first-paint flash.
 */
export function watchBreakpoint(): () => void {
  const query = window.matchMedia(`(width < ${MOBILE_BREAKPOINT}px)`);
  const update = () => applyBreakpoint(query.matches ? 'mobile' : 'desktop');
  update();
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
}

/**
 * Switch the tokens between Desktop and Mobile by viewport width. Call it
 * once, near the root of the app. Runs before paint, so a Mobile screen
 * never shows Desktop sizes first.
 */
export function useBreakpointTokens(): void {
  useLayoutEffect(() => watchBreakpoint(), []);
}
