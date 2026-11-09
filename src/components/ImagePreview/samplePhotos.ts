/**
 * Pictures for the stories only: small drawings (a sky, a sun and two hills) as
 * data addresses, so the stories show real images without any file to ship.
 * `samplePhoto(n)` gives a different one for each n. The tone is for a picture
 * with text on it: `'dark'` has a dark sky for light text and `'pale'` a pale one
 * for dark text; both keep mid-tone hills, so buttons over them stay readable.
 */
export type SamplePhotoTone = 'light' | 'dark' | 'pale';

/** [saturation %, lightness %] of the parts of a scene, and where the sun is. */
const SCENES = {
  light: { skyTop: [70, 78], skyBottom: [80, 62], sun: [90, 85], back: [45, 38], front: [50, 24] },
  dark: { skyTop: [55, 14], skyBottom: [60, 34], sun: [90, 70], back: [42, 50], front: [46, 44] },
  pale: { skyTop: [75, 93], skyBottom: [75, 80], sun: [90, 97], back: [42, 66], front: [46, 58] },
} as const;

export function samplePhoto(index = 0, tone: SamplePhotoTone = 'light'): string {
  const hue = (index * 47 + 205) % 360;
  const sunHue = (hue + 150) % 360;
  const scene = SCENES[tone];
  // The light scene has its sun in the upper third; with text on the picture it goes lower, clear of the text.
  const sunX = tone === 'light' ? 130 + ((index * 70) % 300) : 330 + ((index * 40) % 100);
  const sunY = tone === 'light' ? 120 : 215;
  const hsl = (h: number, [s, l]: readonly [number, number] | readonly number[]) => `hsl(${h} ${s}% ${l}%)`;
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">',
    '<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">',
    `<stop offset="0" stop-color="${hsl(hue, scene.skyTop)}"/><stop offset="1" stop-color="${hsl((hue + 35) % 360, scene.skyBottom)}"/>`,
    '</linearGradient></defs>',
    '<rect width="600" height="400" fill="url(#s)"/>',
    `<circle cx="${sunX}" cy="${sunY}" r="46" fill="${hsl(sunHue, scene.sun)}"/>`,
    `<path d="M0 400V270C90 220 170 230 250 270S410 320 600 240V400Z" fill="${hsl(hue, scene.back)}"/>`,
    `<path d="M0 400V330C120 290 220 320 320 345S500 350 600 310V400Z" fill="${hsl(hue, scene.front)}"/>`,
    '</svg>',
  ].join('');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
