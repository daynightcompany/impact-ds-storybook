import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CellSelector, type CellSelectorKind } from './CellSelector';
import { Icon } from '../Icon';

const KINDS: CellSelectorKind[] = ['switch', 'radio', 'check'];

const meta = {
  title: 'Impact DS/Cell selector',
  component: CellSelector,
  tags: ['autodocs'],
  argTypes: {
    selector: { control: 'select', options: KINDS },
    subtitle: { control: 'text' },
    showIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "cell selector" component set (node 9587:5668) in the SMAL Impact Design System file. Source of truth for variants: Figma. Selector is `switch`, `radio` or `check`; Subtitle adds a second line (and makes the title semibold); Selected is the control\'s checked state; "Show icon" is `showIcon`. The row is 48px tall (64px with a subtitle) on Desktop and fills its container (Figma draws it 924px wide). The whole row is the click target and the title names the input. Put rows in a Cell group to get dividers and, for radios, a shared selection. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CellSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Switch: Story = {
  args: { selector: 'switch', children: 'Title' },
};

export const Checkbox: Story = {
  args: { selector: 'check', children: 'Title' },
};

export const Radio: Story = {
  args: { selector: 'radio', children: 'Title', name: 'cell-radio-demo' },
};

export const WithSubtitle: Story = {
  args: { selector: 'switch', children: 'Title', subtitle: 'Subtitle' },
};

export const Selected: Story = {
  args: { selector: 'switch', children: 'Title', defaultChecked: true },
};

export const WithoutIcon: Story = {
  args: { selector: 'switch', children: 'Title', showIcon: false },
};

export const CustomIcon: Story = {
  args: { selector: 'switch', children: 'Notifications', icon: <Icon name="alert" /> },
};

export const Disabled: Story = {
  args: { selector: 'switch', children: 'Title', disabled: true },
};

export const AllVariants: Story = {
  parameters: {
    // Snapshot both breakpoint modes so a Mobile regression is caught too.
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: 420 }}>
      {KINDS.map((kind) => (
        <div key={kind} style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Selector {kind}</span>
          {[false, true].map((subtitle) =>
            [false, true].map((selected) => (
              <CellSelector
                key={`${subtitle}-${selected}`}
                selector={kind}
                subtitle={subtitle ? 'Subtitle' : undefined}
                defaultChecked={selected}
                name={`all-${kind}-${subtitle}-${selected}`}
              />
            )),
          )}
          <CellSelector selector={kind} showIcon={false} name={`all-${kind}-noicon`} />
          <CellSelector selector={kind} disabled name={`all-${kind}-disabled`} />
        </div>
      ))}
    </div>
  ),
};
