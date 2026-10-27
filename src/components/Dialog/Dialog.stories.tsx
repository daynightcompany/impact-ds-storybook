import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { Dialog, DialogSection } from './Dialog';
import { Button } from '../Button/Button';
import { CellGroup } from '../CellGroup/CellGroup';
import { CellSelector } from '../CellSelector/CellSelector';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { Dropdown } from '../Dropdown/Dropdown';
import { InputField } from '../InputField/InputField';
import { Search } from '../Search/Search';
import { Tab } from '../Tab/Tab';
import { TabList } from '../TabList/TabList';
import { TextInputGroup } from '../TextInputGroup/TextInputGroup';

const COUNTRIES = [
  'Estonia',
  'Finland',
  'Latvia',
  'Lithuania',
  'Sweden',
  'Norway',
  'Denmark',
  'Poland',
  'Germany',
  'Netherlands',
];

/** The Figma list of the Select form: a Cell group of checkbox cells, the first one checked. */
function Countries({ count = COUNTRIES.length }: { count?: number }) {
  return (
    <CellGroup type="Checkbox" aria-label="Countries">
      {COUNTRIES.slice(0, count).map((country, index) => (
        <CellSelector key={country} defaultChecked={index === 0}>
          {country}
        </CellSelector>
      ))}
    </CellGroup>
  );
}

const meta = {
  title: 'Impact DS/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    form: { control: 'inline-radio', options: ['Default', 'Select'] },
    header: { control: 'boolean' },
    footer: { control: 'boolean' },
    formFields: { control: 'boolean' },
    radio: { control: 'boolean' },
    checkboxes: { control: 'boolean' },
    switches: { control: 'boolean' },
    search: { control: 'boolean' },
    tabs: { control: 'boolean' },
    title: { control: 'text' },
    width: { control: 'number' },
    children: { control: false },
    modal: { table: { disable: true } },
    open: { table: { disable: true } },
  },
  args: {
    form: 'Default',
    header: true,
    footer: true,
    formFields: true,
    radio: true,
    checkboxes: true,
    switches: true,
    search: true,
    tabs: true,
    title: 'Title',
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Dialog" component set (node 9587:6878): a 375px panel in two forms. Default is a form: the "Form fields" slot (text inputs and dropdowns), then the Radio, Checkboxes and Switches groups (the slots "Selectors", "Checkbox content" and "Switch content"). Select is a list to choose from: Search, Tabs and the list. Both have the Header and Footer booleans. Figma draws it in the Mobile mode, so use the Breakpoint switch in the toolbar: on Mobile the drag handle shows above the sheet, and every size follows the switch. The slots take any node, and `true` shows the placeholders Figma has there. With `modal` and `open` it opens over a backdrop (see the "Modal" story); without them it is only the panel.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Form=Default as drawn: every boolean on and the placeholders in the slots. */
export const Default: Story = {};

/** Figma Form=Select: Search, Tabs and a list of ten checkbox cells. */
export const Select: Story = {
  args: { form: 'Select' },
  render: (args) => (
    <Dialog {...args}>
      <Countries />
    </Dialog>
  ),
};

/** Your own content in the slots: the Form fields, and the groups as sections of cells. */
export const CustomSlots: Story = {
  args: { title: 'Delivery' },
  render: (args) => (
    <Dialog
      {...args}
      formFields={
        <>
          <TextInputGroup aria-label="Name">
            <InputField label="First name" defaultValue="Dmytro" />
            <InputField label="Last name" />
          </TextInputGroup>
          <Dropdown label="Country" value="Estonia" />
        </>
      }
      radio={
        <DialogSection title="Speed" role="radiogroup">
          <CellSelector selector="radio" name="speed" value="standard" defaultChecked>
            Standard
          </CellSelector>
          <CellSelector selector="radio" name="speed" value="express" subtitle="Next day">
            Express
          </CellSelector>
        </DialogSection>
      }
      checkboxes={
        <DialogSection title="Extras">
          <CellSelector selector="check">Gift wrap</CellSelector>
          <CellSelector selector="check" defaultChecked>
            Insurance
          </CellSelector>
        </DialogSection>
      }
      switches={
        <DialogSection title="Updates">
          <CellSelector selector="switch" defaultChecked>
            Text messages
          </CellSelector>
        </DialogSection>
      }
      footer={<DialogFooter buttonWidth="2 CTA" secondaryButton="Cancel" primaryButton="Save" />}
    />
  ),
};

/** Form fields only, no header. */
export const FieldsOnly: Story = {
  args: { header: false, radio: false, checkboxes: false, switches: false },
};

/** Select without the Search and Tabs: a plain list in a dialog. */
export const SelectListOnly: Story = {
  args: { form: 'Select', search: false, tabs: false },
  render: (args) => (
    <Dialog {...args}>
      <Countries count={6} />
    </Dialog>
  ),
};

/** No footer: the panel gets the bottom padding the footer would bring. */
export const WithoutFooter: Story = {
  args: { footer: false, formFields: false, radio: false, switches: false },
};

/** Opens as a modal: the native <dialog> over a backdrop, kept in focus, closed by Escape, the close button or a press outside. */
export const Modal: Story = {
  args: { form: 'Select', title: 'Countries' },
  parameters: { layout: 'padded' },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open the dialog</Button>
        <Dialog
          {...args}
          modal
          open={open}
          onClose={() => setOpen(false)}
          search={<Search label="Search countries" placeholder="Search countries" />}
          tabs={
            <TabList defaultValue="all" aria-label="Show">
              <Tab value="all">All</Tab>
              <Tab value="selected">Selected</Tab>
            </TabList>
          }
          footer={
            <DialogFooter
              buttonWidth="2 CTA"
              secondaryButton={
                <Button hierarchy="Secondary" size="L" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              }
              primaryButton={
                <Button hierarchy="Primary" size="L" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              }
            />
          }
        >
          <Countries />
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /open the dialog/i }));
  },
};

/** Both forms side by side, as Figma has them. */
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
      <Dialog form="Default" title="Title" />
      <Dialog form="Select" title="Title">
        <Countries />
      </Dialog>
    </div>
  ),
};
