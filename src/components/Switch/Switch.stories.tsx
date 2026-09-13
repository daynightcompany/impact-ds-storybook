import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = {
  title: 'Impact DS/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['S', 'M', 'L'] },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'From the Figma "Switch" component set (node 3304:9342). Built on a real native input (role="switch") — try tabbing to it and pressing Space.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { size: 'S' },
};

export const On: Story = {
  args: { size: 'S', defaultChecked: true },
};

export const Disabled: Story = {
  args: { size: 'S', disabled: true },
};

export const DisabledOn: Story = {
  args: { size: 'S', disabled: true, defaultChecked: true },
};

// Real icons from Figma's shared icon library (Other=sun/moon, Type=stroke,
// Size=24px — matching the icon slot's actual 24x24 size, not a smaller
// variant scaled/padded to fit). Day (off) = sun, night (on) = moon.
const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.4808 12C17.4808 15.0269 15.0269 17.4808 12 17.4808M17.4808 12C17.4808 8.97305 15.0269 6.51923 12 6.51923M17.4808 12H19.125M12 17.4808C8.97305 17.4808 6.51923 15.0269 6.51923 12M12 17.4808V19.125M6.51923 12C6.51923 8.97305 8.97305 6.51923 12 6.51923M6.51923 12H4.875M12 6.51923V4.875M6.96187 6.96187L8.12451 8.12451M15.8755 15.8755L17.0381 17.0381M17.0381 6.96187L15.8755 8.12451M8.12452 15.8755L6.96188 17.0381"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M19.0912 14.7846C17.9139 17.3741 15.3047 19.1607 12.2838 19.1504C8.16078 19.1363 4.8377 15.7904 4.85179 11.6675C4.86211 8.64648 6.6665 6.04963 9.26397 4.89C8.83326 5.82903 8.59223 6.86372 8.58849 7.95621C8.57443 12.0697 11.8975 15.4251 16.0205 15.4392C17.113 15.4429 18.1493 15.2089 19.0912 14.7846Z"
      stroke="currentColor"
    />
  </svg>
);

export const DayNightToggle: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          size="L"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          icon={checked ? <MoonIcon /> : <SunIcon />}
        />
      );
    }
    return <Demo />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'L-only Figma variant: track swaps from the success-green fill to a neutral/primary pair, and the icon/knob swap sides on toggle. Icon swaps live: sun (off/day) to moon (on/night).',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['S', 'M', 'L'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 24, fontSize: 12, color: '#888' }}>{size}</span>
          <Switch size={size} />
          <Switch size={size} defaultChecked />
          <Switch size={size} disabled />
          <Switch size={size} disabled defaultChecked />
        </div>
      ))}
    </div>
  ),
};
