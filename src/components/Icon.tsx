export type IconName =
  | 'placeholder'
  | 'x'
  | 'plus'
  | 'minus'
  | 'check'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'search'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrows-both-sides'
  | 'account'
  | 'edit'
  | 'menu'
  | 'more'
  | 'alert'
  | 'files'
  | 'cart'
  | 'sun'
  | 'moon'
  | 'arrow-top-right';

/**
 * Glyph outlines, read from the Figma "icons" component set (node 9587:483):
 * 24 x 24 box, 1px stroke, round caps and joins, no fill. Not ported yet:
 * fb, inst, YT, IN (the filled brand marks).
 */
export const ICON_GLYPHS: Record<IconName, readonly string[]> = {
  placeholder: [
    'M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z',
  ],
  x: ['M6 6L18 18', 'M6 18L18 6'],
  plus: ['M18.5 12H5.5', 'M12 5.5V18.5'],
  minus: ['M18.5 12H5.5'],
  check: ['M19.1825 6.68103L9.36375 16.4998L5 12.136'],
  'chevron-down': ['M4 7.75L12 16.25L20 7.75'],
  'chevron-up': ['M20 16.25L12 7.75L4 16.25'],
  'chevron-left': ['M16.5 3.5L8.00003 12L16.5 20.5'],
  'chevron-right': ['M8 20.5L16.5 12L8 3.5'],
  search: [
    'M22 21L17.4646 16.4729M17.4646 16.4729C18.9478 14.9918 19.8654 12.9444 19.8654 10.6827C19.8654 6.16352 16.2019 2.5 11.6827 2.5C7.16352 2.5 3.5 6.16352 3.5 10.6827C3.5 15.2019 7.16352 18.8654 11.6827 18.8654C13.9402 18.8654 15.9841 17.9512 17.4646 16.4729Z',
  ],
  'arrow-left': ['M11 3.5L2.5 12L11 20.5', 'M2.5 12L21.5 12'],
  'arrow-right': ['M13 20.5L21.5 12L13 3.5', 'M21.5 12H2.5'],
  'arrows-both-sides': ['M9 18L3 12L9 6', 'M3.5 12H20.5', 'M15 6L21 12L15 18'],
  account: [
    'M11.9999 12.4999C14.4914 12.4999 16.5111 10.4802 16.5111 7.98867C16.5111 5.49717 14.4914 3.47742 11.9999 3.47742C9.50837 3.47742 7.48862 5.49717 7.48862 7.98867C7.48862 10.4802 9.50837 12.4999 11.9999 12.4999Z',
    'M19.5 20.5124C18.69 15.0274 15.3537 12.4836 12.045 12.4836C8.73625 12.4836 5.31125 15.0261 4.5 20.5111',
  ],
  edit: [
    'M18.7825 8.72008L7.25 20.3176L2.5 21.5001L3.68875 16.7501L15.2738 5.16508L18.7875 8.71758L20.7188 6.78633C21.695 5.81133 21.7463 4.20758 20.77 3.23383C20.2951 2.76512 19.6547 2.50232 18.9875 2.50232C18.3203 2.50232 17.6799 2.76512 17.205 3.23383L15.2688 5.16758',
  ],
  menu: ['M5 12H19', 'M5 8H19', 'M5 16H19'],
  more: [
    'M6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14Z',
    'M18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z',
    'M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z',
  ],
  alert: [
    'M21.0538 17.0348C22.0988 18.8835 21.2501 20.4998 19.1538 20.4998H4.8463C2.7563 20.4998 1.90005 18.8835 2.9463 17.0348L10.1001 3.89354C11.1413 2.10104 12.8501 2.00604 13.9013 3.89354L21.0538 17.0348Z',
    'M12 7.5V14.5625',
    'M12 17.25C12.1381 17.25 12.25 17.1381 12.25 17C12.25 16.8619 12.1381 16.75 12 16.75C11.8619 16.75 11.75 16.8619 11.75 17C11.75 17.1381 11.8619 17.25 12 17.25Z',
  ],
  files: [
    'M7.29133 6.11201C6.94885 6.11201 6.62039 6.24551 6.37822 6.48316C6.13605 6.72081 6 7.04313 6 7.37921V18.7328C6 19.0689 6.13605 19.3912 6.37822 19.6288C6.62039 19.8665 6.94885 20 7.29133 20H14.1262C14.4687 20 14.7971 19.8665 15.0393 19.6288C15.2815 19.3912 15.4175 19.0689 15.4175 18.7328M18 7.37921L14.5565 4H9.87382C9.53134 4 9.20288 4.13351 8.96071 4.37116C8.71854 4.6088 8.58249 4.93112 8.58249 5.2672V16.6208C8.58249 16.9569 8.71854 17.2792 8.96071 17.5168C9.20288 17.7545 9.53134 17.888 9.87382 17.888H16.7087C17.0512 17.888 17.3796 17.7545 17.6218 17.5168C17.8639 17.2792 18 16.9569 18 16.6208V7.37921Z',
    'M15 4V7H18',
  ],
  cart: [
    'M12.5 19C12.5 19.8284 11.8284 20.5 11 20.5C10.1716 20.5 9.5 19.8284 9.5 19C9.5 18.1716 10.1716 17.5 11 17.5C11.8284 17.5 12.5 18.1716 12.5 19Z',
    'M18.5 19C18.5 19.8284 17.8284 20.5 17 20.5C16.1716 20.5 15.5 19.8284 15.5 19C15.5 18.1716 16.1716 17.5 17 17.5C17.8284 17.5 18.5 18.1716 18.5 19Z',
    'M2.5 3.5L5.75 3.5L9.375 14.5L18.625 14.5L21.5 5.5L6.4688 5.5',
  ],
  sun: [
    'M17.4808 12C17.4808 15.0269 15.0269 17.4808 12 17.4808C8.9731 17.4808 6.5192 15.0269 6.5192 12C6.5192 8.9731 8.9731 6.5192 12 6.5192C15.0269 6.5192 17.4808 8.9731 17.4808 12Z',
    'M17.4808 12L19.125 12M12 17.4808L12 19.125M6.5192 12L4.875 12M12 6.5192L12 4.875M6.9619 6.9619L8.1245 8.1245M15.8755 15.8755L17.0381 17.0381M17.0381 6.9619L15.8755 8.1245M8.1245 15.8755L6.9619 17.0381',
  ],
  moon: [
    'M19.0912 14.7846C17.9139 17.3741 15.3047 19.1607 12.2838 19.1504C8.1608 19.1363 4.8377 15.7904 4.8518 11.6675C4.8621 8.6465 6.6665 6.0496 9.264 4.89C8.8333 5.829 8.5922 6.8637 8.5885 7.9562C8.5744 12.0697 11.8975 15.4251 16.0205 15.4392C17.113 15.4429 18.1493 15.2089 19.0912 14.7846Z',
  ],
  'arrow-top-right': ['M4.8777 19.125L19.1223 4.875M19.1223 4.875L11.4507 4.875M19.1223 4.875L19.1223 12.5466'],
};

interface IconProps {
  size?: number;
  className?: string;
  /** Glyph from the Figma icon set. Defaults to the generic circle placeholder. */
  name?: IconName;
  /**
   * Keep the stroke at 1px however large or small the icon is drawn. Figma
   * scales an icon's geometry but not its stroke weight, so an icon box that
   * CSS shrinks or stretches (24 -> 32, 24 -> 16) needs this to match.
   */
  fixedStroke?: boolean;
}

/**
 * Inline icon. The default glyph is the generic circle (Figma node 2767:7460,
 * the "placeholder" of the icon set) that fills the icon slots until real icons
 * are chosen; `name` picks any other glyph of the set (node 9587:483).
 * Uses stroke="currentColor" so it always matches the surrounding text color
 * — white on Primary buttons, dark on Secondary/Tertiary — no CSS masking needed.
 */
export function Icon({ size = 24, className, name = 'placeholder', fixedStroke = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {ICON_GLYPHS[name].map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect={fixedStroke ? 'non-scaling-stroke' : undefined}
        />
      ))}
    </svg>
  );
}

export default Icon;
