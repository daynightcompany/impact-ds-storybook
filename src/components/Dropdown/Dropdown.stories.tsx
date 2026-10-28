import { useId, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { CellGroup } from '../CellGroup/CellGroup';
import { CellSelector } from '../CellSelector/CellSelector';
import { Popup } from '../Popup/Popup';
import { Dropdown, type DropdownProps } from './Dropdown';

const OPTIONS = ['Estonia', 'Finland', 'Latvia', 'Lithuania', 'Sweden'];

const optionCells = OPTIONS.map((option) => (
  <CellSelector key={option} value={option} showIcon={false}>
    {option}
  </CellSelector>
));

// The five cells of the Figma demo: radio, no icon, all titled "Title" (the first one is selected by the group).
const FIGMA_CELLS = ['1', '2', '3', '4', '5'].map((value) => (
  <CellSelector key={value} value={value} showIcon={false}>
    Title
  </CellSelector>
));

// What the docs show for the stories: the composition, not the demo components around it.
const OPEN_SOURCE = `const id = useId();

<Dropdown label="Label" aria-controls={id} />
<Popup id={id} aria-label="Label" width="100%" search={false} tabs={false} footer={false}>
  <CellGroup type="Radio" aria-label="Label" defaultValue="1">
    <CellSelector value="1" showIcon={false}>Title</CellSelector>
    <CellSelector value="2" showIcon={false}>Title</CellSelector>
    <CellSelector value="3" showIcon={false}>Title</CellSelector>
  </CellGroup>
</Popup>`;

const LIST_SOURCE = `const anchor = useRef<HTMLButtonElement>(null);
const id = useId();
const [open, setOpen] = useState(false);
const [value, setValue] = useState<string>();
// The arrow keys move the selection through the radios; a click or Enter picks and closes.
const byPointer = useRef(false);

<Dropdown ref={anchor} label="Label" value={value} open={open} aria-controls={id} onClick={() => setOpen(!open)} />
<Popup
  id={id}
  anchorRef={anchor}
  open={open}
  onOpenChange={setOpen}
  aria-label="Label"
  matchAnchorWidth
  search={false}
  tabs={false}
  footer={false}
>
  <CellGroup
    type="Radio"
    aria-label="Label"
    value={value}
    onPointerDown={() => {
      byPointer.current = true;
    }}
    onKeyDown={(event) => {
      byPointer.current = false;
      if (event.key === 'Enter') setOpen(false);
    }}
    onValueChange={(next) => {
      setValue(next);
      if (byPointer.current) setOpen(false);
    }}
  >
    <CellSelector value="Estonia" showIcon={false}>Estonia</CellSelector>
    <CellSelector value="Finland" showIcon={false}>Finland</CellSelector>
    <CellSelector value="Latvia" showIcon={false}>Latvia</CellSelector>
  </CellGroup>
</Popup>`;

const selected = (value: DropdownProps['value']) => (typeof value === 'string' ? value : undefined);

/**
 * The Figma Dropdown demo (Input page): a Dropdown (Idle, Empty) and, spacing/s (16px) under it, a Popup with
 * the Search, Tabs and Footer booleans off: a list of five radio cells, the first selected, as wide as the field.
 * Here the Popup sits in the flow; the Interactive story opens it from the field as a popover.
 */
function OpenList(args: DropdownProps) {
  const listId = useId();
  const name = args.label ?? 'Options';

  return (
    <div style={{ display: 'grid', gap: 'var(--breakpoint-spacing-s)' }}>
      <Dropdown {...args} aria-controls={listId} />
      <Popup id={listId} aria-label={name} width="100%" search={false} tabs={false} footer={false}>
        <CellGroup type="Radio" aria-label={name} defaultValue="1">
          {FIGMA_CELLS}
        </CellGroup>
      </Popup>
    </div>
  );
}

/** The dropdown with its list as a popover: the Popup opens from the field, as wide as the field. */
function ListDemo({
  reserveRoom,
  value: initialValue,
  ...args
}: DropdownProps & { reserveRoom?: boolean }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const name = args.label ?? 'Options';
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(selected(initialValue));
  // The arrow keys move the selection through the radios; only a click or Enter picks and closes.
  const byPointer = useRef(false);

  return (
    // The list floats over the page: the canvas keeps room for it, so the visual tests see all of it.
    <div style={{ minHeight: reserveRoom ? 460 : undefined }}>
      <Dropdown
        {...args}
        ref={anchor}
        value={choice}
        open={open}
        aria-controls={listId}
        onClick={(event) => {
          args.onClick?.(event);
          setOpen(!open);
        }}
      />
      <Popup
        id={listId}
        aria-label={name}
        anchorRef={anchor}
        open={open}
        onOpenChange={setOpen}
        matchAnchorWidth
        search={false}
        tabs={false}
        footer={false}
      >
        <CellGroup
          type="Radio"
          aria-label={name}
          value={choice}
          onPointerDown={() => {
            byPointer.current = true;
          }}
          onKeyDown={(event) => {
            byPointer.current = false;
            if (event.key === 'Enter') setOpen(false);
          }}
          onValueChange={(next) => {
            setChoice(next);
            if (byPointer.current) setOpen(false);
          }}
        >
          {optionCells}
        </CellGroup>
      </Popup>
    </div>
  );
}

const meta = {
  title: 'Impact DS/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'boolean' },
    chevron: { control: 'boolean' },
    required: { control: 'boolean' },
    open: { control: 'boolean' },
    helperText: { control: 'boolean' },
    error: { control: 'boolean' },
    link: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Label', onClick: fn(), onLinkClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 327 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Dropdown" component set (node 9587:5298): the Base/Input Field box with a chevron that opens a popup. It is a button, so pressing it calls `onClick` and `open` shows the Focused state while the popup is open. The label is the placeholder while nothing is selected and a small caption above the `value` afterwards (Empty and Populated follow the value); it glides from one to the other when a value arrives or goes (300ms, ease out). Booleans: Icon, Chevron (on), Required, Link and Helper text are props; `error` and `disabled` set Error and Disabled, Hover and Focused are the browser\'s own, and the stroke eases in over 300ms (ease out), as in the Figma prototype. The Figma Dropdown tints the small label font/interactive/hover/tertiary, the Input field uses font/interactive/idle/secondary. The "Open" story is the list view from the Dropdown demo on the Figma Input page: the field with the Popup under it, list only, as wide as the field and spacing/s (16px) below it. In an app the Popup opens from the field as a popover (it fades and slides in over 300ms, ease out): see the "Interactive" story. The Popup stories have the version with a Search, Tabs and a Footer. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Dropdown" / Idle / Empty. */
export const Default: Story = {};

/** Populated: the label moves above the selected value. */
export const Populated: Story = {
  args: { value: 'Input' },
};

export const WithIcon: Story = {
  args: { icon: true, value: 'Input' },
};

export const Required: Story = {
  args: { required: true },
};

/**
 * The list open view from the Figma Dropdown demo (Input page): the field (Idle, Empty) and, spacing/s (16px)
 * under it, the Popup made into a simple list: no Search, Tabs or Footer, five radio cells with the first one
 * selected, as wide as the field. It sits in the flow here, with the demo's placeholder text; the Interactive
 * story opens the same list from the field as a popover.
 */
export const Open: Story = {
  parameters: {
    layout: 'padded',
    docs: { source: { code: OPEN_SOURCE } },
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: (args) => <OpenList {...args} />,
};

/**
 * The same list as a popover, with sample options: press the field and the Popup opens under it, fading and
 * sliding in (ease out, 300ms), while the field takes its Focused look. Picking an option selects it and closes
 * the list, and the label glides up into the caption above the picked value (300ms, ease out); Escape, a press
 * outside and tabbing away close it too, and the field opens it again. The field starts empty and the canvas
 * opens the list when the story loads; set `value` in the controls to start with an option picked.
 */
export const Interactive: Story = {
  argTypes: { open: { table: { disable: true } } },
  parameters: {
    layout: 'padded',
    docs: { source: { code: LIST_SOURCE } },
    chromatic: {
      // The snapshot waits for the list to finish fading in.
      delay: 700,
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: (args, { viewMode }) => <ListDemo key={String(args.value)} reserveRoom={viewMode !== 'docs'} {...args} />,
  // Open it, so the canvas and the visual tests show the list. (Docs pages do not run this: the field is closed there.)
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button')[0]);
  },
};

export const WithHelperText: Story = {
  args: { helperText: true, link: true },
};

export const ErrorState: Story = {
  args: { error: 'Choose an option', value: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Input' },
};

type Case = { name: string; state?: 'hover' | 'focus'; props: Partial<DropdownProps> };

const CASES: Case[] = [
  { name: 'Idle', props: {} },
  { name: 'Hover', state: 'hover', props: {} },
  { name: 'Focused', state: 'focus', props: {} },
  { name: 'Error', props: { error: true, helperText: true } },
  { name: 'Disabled', props: { disabled: true } },
];

/** The Figma variant set: State (Idle, Hover, Focused) x Condition (Empty, Populated), plus Error and Disabled. */
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
    <div style={{ display: 'grid', gap: 12 }}>
      {CASES.map(({ name, state, props }) => (
        <div key={name} style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 11, color: '#888' }}>{name}</span>
          <div data-state={state} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 327px)', gap: 24, alignItems: 'start' }}>
            <Dropdown label="Label" {...props} />
            <Dropdown label="Label" value="Input" {...props} />
          </div>
        </div>
      ))}
    </div>
  ),
};
