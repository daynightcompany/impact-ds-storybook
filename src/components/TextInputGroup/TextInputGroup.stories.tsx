import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInputGroup } from './TextInputGroup';
import { InputField } from '../InputField/InputField';
import { Dropdown } from '../Dropdown/Dropdown';

const meta = {
  title: 'Impact DS/Text input group',
  component: TextInputGroup,
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) => (
      <div style={{ width: parameters.fullWidth ? 'auto' : 640, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: { 'aria-label': 'Name' },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Text Input group" component set (node 9587:5242): fields in one box with a divider between them. The children are Input fields (or a Dropdown) that lose their own stroke inside the group; a hovered or focused field draws its own stroke in place of the dividers around it (while one field is focused, open or in error, hovering another one only changes the colour of the outline that is already there), and each field\'s label glides into its caption as in the Input field (a focused field that is still empty keeps its label at half opacity). Responsive: on a wide layout the fields share one row, each at least 310 wide; when the group has no room for all of them at that width (a narrower container, a layout that changes) they regroup into a vertical stack, one field per row, with a horizontal divider between the rows (all of them at once, so three fields never end up as two and one). On Mobile the stack is always vertical. Drag the corner of the box in the Resizable story to see it change. The AllVariants story shows Hover and Focused by putting `data-state` on a wrapper. Use the Breakpoint switch in the toolbar to see the Mobile values.',
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
  parameters: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: 960, maxWidth: '100%' }}>
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

/** Not wide enough for all three fields at their minimum width, though two would fit: all of them stack. */
export const ThreeFieldsStacked: Story = {
  name: 'Three fields, stacked',
  render: ThreeFields.render,
};

export const WithDropdown: Story = {
  render: (args) => (
    <TextInputGroup {...args}>
      <InputField label="Phone" type="tel" />
      <Dropdown label="Country" value="Estonia" />
    </TextInputGroup>
  ),
};

/** Wide enough for one field only: the fields regroup into a vertical stack. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 327, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

/** Drag the bottom-right corner of the box: the fields stack once there is no room for each of them side by side, and line up again when there is. */
export const Resizable: Story = {
  parameters: { fullWidth: true, chromatic: { disableSnapshot: true } },
  decorators: [
    (Story) => (
      <div style={{ width: 960, maxWidth: '100%', minWidth: 200, overflow: 'auto', resize: 'horizontal', paddingBottom: 12 }}>
        <Story />
      </div>
    ),
  ],
  render: ThreeFields.render,
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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
      {[
        { name: 'Idle', state: undefined, values: [undefined, undefined] },
        { name: 'Hover', state: 'hover' as const, values: [undefined, undefined] },
        { name: 'Populated (first field focused)', state: 'focus' as const, values: ['Input', undefined] },
      ].flatMap(({ name, state, values }) =>
        [640, 327].map((width) => (
          <div key={`${name}${width}`} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 4, width, maxWidth: '100%' }}>
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
