import { useId, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Popover, type PopoverPlacement } from './Popover';
import { Button } from '../Button/Button';

const meta = {
  title: 'Impact DS/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
    offset: { control: 'number' },
    matchAnchorWidth: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    keepMounted: { control: 'boolean' },
    open: { table: { disable: true } },
    anchorRef: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    children: { control: false },
  },
  // The stories hold the real `open` and `anchorRef`; these satisfy the required props.
  args: { open: false, anchorRef: { current: null } },
  parameters: {
    docs: {
      description: {
        component:
          'The positioned shell behind a popup that opens from an element, such as the Popup (it has no Figma counterpart: Figma draws the panel only). It is in the browser\'s top layer, so no ancestor clips it; it is placed against the anchor, flips to the other side when there is no room, limits its height to the room that is left, and follows the anchor on scroll and resize. The anchor owns the toggle. The popover closes by itself on Escape, on a press outside and when the focus moves away, by calling `onOpenChange(false, reason)`, and gives the focus back to the anchor. It has `role="dialog"`: give it an `aria-label`.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function Card({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: 240,
        padding: 16,
        borderRadius: 12,
        background: 'var(--theme-color-background-primary)',
        boxShadow: 'var(--shadow-shadow-m)',
        color: 'var(--theme-color-font-interactive-idle-secondary)',
        fontFamily: 'var(--font-interactive-label-text-md-sans-regular-family), sans-serif',
        fontSize: 'var(--font-interactive-label-text-md-sans-regular-size)',
        lineHeight: 'var(--font-interactive-label-text-md-sans-regular-line-height)',
      }}
    >
      {children}
    </div>
  );
}

// The docs show this story's own source (`docs.source.type: 'code'`): the JSX Storybook would generate
// drops the hooks, and it reads `element.ref` on the anchor button, which React 19 warns about in dev.
/** Any content: a button toggles it, Escape, a press outside or tabbing away closes it. */
export const Default: Story = {
  args: { placement: 'bottom-start', offset: 8, matchAnchorWidth: false, autoFocus: true, keepMounted: false },
  parameters: { layout: 'padded', docs: { source: { type: 'code' } } },
  render: function Render(args) {
    const anchor = useRef<HTMLButtonElement>(null);
    const id = useId();
    const [open, setOpen] = useState(false);
    return (
      <div style={{ minHeight: 220 }}>
        <Button ref={anchor} hierarchy="Secondary" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          Details
        </Button>
        <Popover {...args} id={id} aria-label="Details" anchorRef={anchor} open={open} onOpenChange={setOpen}>
          <Card>
            <p style={{ margin: '0 0 12px' }}>Anything can go in here.</p>
            <Button size="L" onClick={() => setOpen(false)}>
              Got it
            </Button>
          </Card>
        </Popover>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /details/i }));
  },
};

/** The four placements. Near the edge of the viewport a popover flips to the other side. */
export const Placements: Story = {
  parameters: { layout: 'padded' },
  render: function Render() {
    const placements: PopoverPlacement[] = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
    const [active, setActive] = useState<PopoverPlacement>('bottom-start');
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'center', padding: '200px 0' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {placements.map((placement) => (
            <Button
              key={placement}
              hierarchy={placement === active ? 'Primary' : 'Secondary'}
              onClick={() => {
                setActive(placement);
                setOpen(true);
              }}
            >
              {placement}
            </Button>
          ))}
        </div>
        <Button ref={anchor} hierarchy="Tertiary" aria-expanded={open} onClick={() => setOpen(!open)}>
          Anchor
        </Button>
        <Popover aria-label="Placement" anchorRef={anchor} open={open} onOpenChange={setOpen} placement={active} autoFocus={false}>
          <Card>{active}</Card>
        </Popover>
      </div>
    );
  },
};
