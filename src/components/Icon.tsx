interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Inline icon (converted from Figma's circle glyph, node 2767:7460).
 * Uses stroke="currentColor" so it always matches the surrounding text color
 * — white on Primary buttons, dark on Secondary/Tertiary — no CSS masking needed.
 */
export function Icon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Icon;
