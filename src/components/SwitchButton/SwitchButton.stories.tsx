import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchButton } from './SwitchButton';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Switch button',
  component: SwitchButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['Primary', 'Secondary'] },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    offLabel: { control: 'text' },
    onLabel: { control: 'text' },
  },
  args: { 'aria-label': 'Notifications' },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Switch Button" component set (node 9587:3589), built on "Base/SwitchButton" 9587:3563. Source of truth for variants: Figma. Type is Primary (40px tall, 8px corners) or Secondary (48px tall, rounded); State is the checked state. Off shows a white thumb on the left item over a grey track; On slides it to the right item over a green track and turns the left label light. `offLabel` and `onLabel` are the Items slot: text or icons, both items the same width. Built on a real native input (role="switch") — tab to it and press Space. Figma has no hover or disabled state: hover fills the inactive item like a Tab/Secondary, and disabled fades to 30%. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SwitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { type: 'Primary' },
};

export const On: Story = {
  args: { type: 'Primary', defaultChecked: true },
};

export const Secondary: Story = {
  args: { type: 'Secondary' },
};

export const SecondaryOn: Story = {
  args: { type: 'Secondary', defaultChecked: true },
};

export const Disabled: Story = {
  args: { type: 'Primary', disabled: true },
};

export const BillingPeriod: Story = {
  args: { type: 'Secondary', offLabel: 'Monthly', onLabel: 'Yearly', 'aria-label': 'Billing period' },
};

export const WithIcons: Story = {
  args: {
    type: 'Secondary',
    offLabel: <Icon name="sun" />,
    onLabel: <Icon name="moon" />,
    'aria-label': 'Dark mode',
  },
};

function ControlledDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <SwitchButton
        type="Primary"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        aria-label="Notifications"
      />
      <span style={{ fontSize: 14 }}>Notifications are {checked ? 'on' : 'off'}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
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
  // Both labels read "Switch", like the Figma instances, so the sizes match.
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['Primary', 'Secondary'] as const).map((type) => (
        <div key={type} style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <span style={{ width: 80, fontSize: 12, color: '#888' }}>{type}</span>
          <SwitchButton type={type} offLabel="Switch" onLabel="Switch" aria-label={`${type}, off`} />
          <SwitchButton type={type} offLabel="Switch" onLabel="Switch" defaultChecked aria-label={`${type}, on`} />
          <SwitchButton type={type} offLabel="Switch" onLabel="Switch" disabled aria-label={`${type}, disabled`} />
        </div>
      ))}
    </div>
  ),
};
