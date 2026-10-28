import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInputGroup } from './TextInputGroup';
import { InputField } from '../InputField/InputField';
import { Dropdown } from '../Dropdown/Dropdown';

const meta = {
  title: 'Impact DS/Text input group',
  component: TextInputGroup,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
  args: { 'aria-label': 'Name' },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Text Input group" component set (node 9587:5242): fields in one box with a 1px divider between them. The children are Input fields (or a Dropdown) that lose their own stroke inside the group; a hovered or focused field draws its own stroke, and each field\'s label glides into its caption as in the Input field. Fields are 310px wide at the least and share the row, so they wrap into rows when the group is narrower than two fields (as on Mobile), with a horizontal divider between the rows. The AllVariants story shows Hover and Focused by putting `data-state` on a wrapper. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
  render: (args) => (
    <TextInputGroup {...args}>
      <InputField label="First name" autoComplete="given-name" />
      <InputField label="Last name" autoComplete="family-name" />
    </TextInputGroup>
  ),
} satisfies Meta<typeof TextInputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Text Input group" / Idle. */
export const Default: Story = {};

export const Populated: Story = {
  render: (args) => (
    <TextInputGroup {...args}>
      <InputField label="First name" defaultValue="Ada" />
      <InputField label="Last name" defaultValue="Lovelace" />
    </TextInputGroup>
  ),
};

export const ThreeFields: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TextInputGroup {...args}>
      <InputField label="Street" />
      <InputField label="City" />
      <InputField label="Postcode" />
    </TextInputGroup>
  ),
};

export const WithDropdown: Story = {
  render: (args) => (
    <TextInputGroup {...args}>
      <InputField label="Phone" type="tel" />
      <Dropdown label="Country" value="Estonia" />
    </TextInputGroup>
  ),
};

/** Narrower than two fields: the fields wrap into rows. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 327 }}>
        <Story />
      </div>
    ),
  ],
};

/** Figma states Idle, Hover and Populated (first field focused), wide and narrow. */
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
    <div style={{ display: 'grid', gap: 24 }}>
      {[
        { name: 'Idle', state: undefined, values: [undefined, undefined] },
        { name: 'Hover', state: 'hover' as const, values: [undefined, undefined] },
        { name: 'Populated (first field focused)', state: 'focus' as const, values: ['Input', undefined] },
      ].flatMap(({ name, state, values }) =>
        [640, 327].map((width) => (
          <div key={`${name}${width}`} style={{ display: 'grid', gap: 4, width }}>
            <span style={{ fontSize: 11, color: '#888' }}>
              {name} · {width}px
            </span>
            <TextInputGroup aria-label="Name">
              <InputField label="Label" defaultValue={values[0]} data-state={state} />
              <InputField label="Label" defaultValue={values[1]} />
            </TextInputGroup>
          </div>
        )),
      )}
    </div>
  ),
};
