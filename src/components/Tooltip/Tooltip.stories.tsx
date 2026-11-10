import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipTrigger } from './Tooltip';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import { TextLink } from '../TextLink/TextLink';

const meta = {
  title: 'Impact DS/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipTrigger },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Tooltip" component set (node 9587:5993) in the SMAL Impact Design System file. Source of truth for variants: Figma. A dark bubble (interactive/idle/primary) with one line of text and, with `icon`, a copy icon after it. Figma defines only the bubble. To show it next to an element, wrap the element in `TooltipTrigger` (see the Demo story): the bubble pops up above it when the pointer rests on it and when the keyboard focuses it, and goes away when the pointer or the focus leaves; it stays while the pointer is on the bubble, Escape or a press on the trigger closes it, and touch does not show it. The bubble sits in the browser\'s top layer, so nothing clips it, and the trigger is described by it (`aria-describedby`). To place the bubble yourself, give it an id and point the element at it with `aria-describedby`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The link to the page the story is on: the Storybook page around the preview, else the preview itself. */
function pageLink(): string {
  try {
    return window.parent.location.href;
  } catch {
    return window.location.href;
  }
}

/** Puts `text` on the clipboard. Where the Clipboard API is not available (a page that is not secure, a frame that may not use it), a hidden field and `execCommand` do it. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const focused = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(field);
    field.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      field.remove();
      if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    }
  }
}

/** `copy(text)` copies the text, and `copied` is true for two seconds after, for the bubble to say so. */
function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = (text: string) => {
    copyToClipboard(text).then((done) => {
      if (!done) return;
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    });
  };
  return [copied, copy];
}

/** Hover the button, or tab to it: the bubble pops up above it, and goes away when the pointer or the focus leaves. Escape closes it. Press the button to copy the link: the bubble then says "Link copied" for two seconds. */
export const Demo: Story = {
  args: { icon: false, children: 'Copy the link to this page' },
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render({ children, icon }) {
    const [copied, copy] = useCopy();
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0 16px' }}>
        <TooltipTrigger
          content={copied ? 'Link copied' : children}
          icon={icon}
          iconElement={copied ? <Icon name="check" /> : undefined}
          open={copied || undefined}
        >
          <Button hierarchy="Secondary" onClick={() => copy(pageLink())}>
            Copy link
          </Button>
        </TooltipTrigger>
      </div>
    );
  },
};

/** Figma Icon=Yes. */
export const Default: Story = {
  args: { icon: true, children: 'One month FREE with promo code: VFMSURANCE' },
};

export const WithoutIcon: Story = {
  name: 'Without icon',
  args: { icon: false, children: 'One month FREE with promo code: VFMSURANCE' },
};

/** The bubble hugs its text and only wraps when its container is narrower. */
export const Wrapping: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 240, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: { icon: true, children: 'One month FREE with promo code: VFMSURANCE' },
};

/** The bubble shown, above its trigger (`open` controls it; leave it out and the trigger decides). Press the button to copy the link: the bubble says "Link copied" for two seconds. */
export const Open: Story = {
  parameters: { layout: 'padded', chromatic: { delay: 700 }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [copied, copy] = useCopy();
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0 16px' }}>
        <TooltipTrigger content={copied ? 'Link copied' : 'Copy the link to this page'} open>
          <Button hierarchy="Secondary" onClick={() => copy(pageLink())}>
            Copy link
          </Button>
        </TooltipTrigger>
      </div>
    );
  },
};

/** The four sides, each bubble outward from its trigger and centred on it; near the edge of the viewport it flips to the opposite side. */
export const Placements: Story = {
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, max-content)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'min(24px, 2vw)',
        padding: '72px clamp(0px, calc((100% - 340px) / 2), 200px)',
      }}
    >
      {[
        { placement: 'top', column: 2, row: 1 },
        { placement: 'left', column: 1, row: 2 },
        { placement: 'right', column: 3, row: 2 },
        { placement: 'bottom', column: 2, row: 3 },
      ].map(({ placement, column, row }) => (
        <TooltipTrigger
          key={placement}
          content={`On the ${placement}`}
          placement={placement as 'top' | 'left' | 'right' | 'bottom'}
          style={{ gridColumn: column, gridRow: row, justifySelf: 'center' }}
        >
          <Button hierarchy="Secondary">{placement[0].toUpperCase() + placement.slice(1)}</Button>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

/** Anything that takes the focus can be a trigger: a link, an icon button. The copy icon is Figma's `Icon`; the icon button copies the promo code and the bubble says so for two seconds. */
export const OnOtherElements: Story = {
  name: 'On other elements',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [copied, copy] = useCopy();
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, padding: '64px 0 16px' }}>
        <TooltipTrigger content="Opens in a new tab">
          <TextLink href="#terms" size="M">
            Terms and conditions
          </TextLink>
        </TooltipTrigger>
        <TooltipTrigger
          content={copied ? 'Promo code copied' : 'One month FREE with promo code: VFMSURANCE'}
          icon
          iconElement={copied ? <Icon name="check" /> : undefined}
          open={copied || undefined}
        >
          <Button
            hierarchy="Tertiary"
            size="L"
            icon="Only"
            iconElement={<Icon name="copy" />}
            aria-label="Copy promo code"
            onClick={() => copy('VFMSURANCE')}
          />
        </TooltipTrigger>
      </div>
    );
  },
};
