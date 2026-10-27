import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tab, type TabIcon } from './Tab';

const ICONS: TabIcon[] = ['False', 'Leading', 'Trailing', 'Only'];

const meta = {
  title: 'Impact DS/Tab',
  component: Tab,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['Primary', 'Secondary'] },
    size: { control: 'select', options: ['L', 'XL'] },
    icon: { control: 'select', options: ICONS },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onClick: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Tab/Primary" (node 9587:4270) and "Tab/Secondary" (node 9587:4499) component sets. Source of truth for variants: Figma. L is 56px tall (40px on Mobile), XL is 64px (48px on Mobile). Primary is an underlined text tab (unselected tabs sit at 50% opacity), Secondary is a filled pill. A Tab on its own is a toggle button; put tabs in a Tab list for the tab semantics and arrow-key navigation. The Only layout has no label: pass an `aria-label`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'Primary', size: 'L', icon: 'False', children: 'Tab' },
};

export const PrimarySelected: Story = {
  args: { variant: 'Primary', size: 'L', icon: 'False', selected: true, children: 'Tab' },
};

export const Secondary: Story = {
  args: { variant: 'Secondary', size: 'L', icon: 'False', children: 'Tab' },
};

export const SecondarySelected: Story = {
  args: { variant: 'Secondary', size: 'L', icon: 'False', selected: true, children: 'Tab' },
};

export const ExtraLarge: Story = {
  args: { variant: 'Primary', size: 'XL', icon: 'False', selected: true, children: 'Tab' },
};

export const WithLeadingIcon: Story = {
  args: { variant: 'Primary', size: 'L', icon: 'Leading', children: 'Tab' },
};

export const WithTrailingIcon: Story = {
  args: { variant: 'Primary', size: 'L', icon: 'Trailing', children: 'Tab' },
};

export const IconOnly: Story = {
  args: { variant: 'Primary', size: 'L', icon: 'Only', 'aria-label': 'Settings' },
};

export const Disabled: Story = {
  args: { variant: 'Primary', size: 'L', icon: 'False', disabled: true, children: 'Tab' },
};

const STATES = [
  { label: 'Unselected', selected: false, disabled: false },
  { label: 'Selected', selected: true, disabled: false },
  { label: 'Disabled', selected: false, disabled: true },
] as const;

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
    <div style={{ display: 'grid', gap: 32 }}>
      {(['Primary', 'Secondary'] as const).map((variant) =>
        (['L', 'XL'] as const).map((size) => (
          <div key={`${variant}-${size}`} style={{ display: 'grid', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#888' }}>
              {variant}, size {size}
            </span>
            {STATES.map(({ label, selected, disabled }) => (
              <div key={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <span style={{ width: 90, fontSize: 12, color: '#888' }}>{label}</span>
                {ICONS.map((icon) => (
                  <Tab
                    key={icon}
                    variant={variant}
                    size={size}
                    icon={icon}
                    selected={selected}
                    disabled={disabled}
                    aria-label={icon === 'Only' ? 'Settings' : undefined}
                  >
                    Tab
                  </Tab>
                ))}
              </div>
            ))}
          </div>
        )),
      )}
    </div>
  ),
};
