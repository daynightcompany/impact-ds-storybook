import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DialogHeader } from './DialogHeader';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Dialog header',
  component: DialogHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    showTitle: { control: 'boolean' },
    leftIcons: { control: 'boolean' },
    rightIcons: { control: 'boolean' },
    additionalIcons: { control: 'boolean' },
  },
  args: { onBack: fn(), onClose: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Dialog/Header" component (node 9587:6860) in the SMAL Impact Design System file: left icons, a centred title and right icons with a close button. Booleans: Left icons, Title, Right icons, Additional icons (shown with Right icons, as in Figma). Slots: pass a node to `leftIcons` / `additionalIcons` to replace the default back arrow / placeholder icons. The title is centred while the left icons are shown and sits at the start when they are not. Inside a Dialog or Popup the header has no padding of its own. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof DialogHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: every boolean on. */
export const Default: Story = {};

/** The configuration the Dialog uses: title at the start and the close button. */
export const InDialog: Story = {
  args: { leftIcons: false, additionalIcons: false },
};

export const WithBackArrow: Story = {
  args: { leftIcons: true, additionalIcons: false },
};

export const WithoutTitle: Story = {
  args: { showTitle: false, leftIcons: false },
};

export const CustomIcons: Story = {
  args: {
    title: 'Filters',
    leftIcons: (
      <button type="button" aria-label="Back" style={{ all: 'unset', display: 'inline-flex', cursor: 'pointer' }}>
        <Icon name="chevron-left" size={24} />
      </button>
    ),
    additionalIcons: (
      <button type="button" aria-label="Search" style={{ all: 'unset', display: 'inline-flex', cursor: 'pointer' }}>
        <Icon name="search" size={24} />
      </button>
    ),
  },
};

export const LongTitle: Story = {
  args: { title: 'A title that is far too long to fit on one line of the header', leftIcons: false, additionalIcons: false },
};

const BOOLS = [true, false] as const;

export const AllVariants: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 375 }}>
      {BOOLS.flatMap((left) =>
        BOOLS.flatMap((title) =>
          BOOLS.flatMap((right) =>
            BOOLS.map((additional) => (
              <div key={`${left}${title}${right}${additional}`} style={{ display: 'grid', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#888' }}>
                  left {String(left)} · title {String(title)} · right {String(right)} · additional {String(additional)}
                </span>
                <DialogHeader
                  leftIcons={left}
                  showTitle={title}
                  rightIcons={right}
                  additionalIcons={additional}
                />
              </div>
            )),
          ),
        ),
      )}
    </div>
  ),
};
