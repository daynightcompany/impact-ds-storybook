import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '../Accordion/Accordion';
import { AccordionList } from './AccordionList';

const names = ['Find', 'Design', 'Financing', 'Permit', 'Commission', 'Manage', 'Maintain'];
const bodyText =
  'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.';
const quote = 'Lorem ipsum may be used as a placeholder before the final copy is available.';

/** Figma's seven items of the Secondary preview, all closed; `open` is the title of the one that starts open. */
const items = (open?: string) =>
  names.map((name) => (
    <Accordion key={name} title={name} bodyText={bodyText} quote={quote} defaultExpanded={name === open} />
  ));

/** Figma's six items of the Primary preview, all closed, each with the placeholder title. */
const placeholderItems = () =>
  Array.from({ length: 6 }, (_, index) => (
    <Accordion key={index} title="Placeholder Title" bodyText={bodyText} quote={quote} />
  ));

const meta = {
  title: 'Impact DS/Accordion list',
  component: AccordionList,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['Primary', 'Secondary'] },
    title: { control: 'text' },
    children: { control: false },
  },
  args: { variant: 'Secondary', title: 'How we help', children: items() },
  decorators: [
    (Story) => (
      <div style={{ width: 924 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Accordion list" component (node 9587:6366) and the two previews next to it on the Accordion page (node 9587:76744) in the SMAL Impact Design System file. Source of truth for variants: Figma. Pass your Accordions as `children` (Figma `Items` slot). There are two variants (`variant`). Primary (Figma "Preview (Primary)") stacks the Accordions as they are on their own, one under the other with no space between them, and draws no card, headline or dividers. Secondary (Figma "Preview (Secondary)", the default) is a card with a headline (`title`, Figma "How we help"), a divider, and a divider between each two Accordions; the Accordions in it draw as Figma\'s "Features" items: no fill of their own, no side padding and a 2XL headline. Figma draws them all closed; an open one keeps the same spacing. Each Accordion keeps its own state, so several can be open at once; control them with `expanded` if only one should be (see the One at a time story). The list fills its container (Figma: 924 wide) and, in Secondary, its rows are at most 1024 wide. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof AccordionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's "Preview (Primary)": six closed accordions, one under the other with no space between them. */
export const Primary: Story = {
  args: { variant: 'Primary', title: undefined, children: placeholderItems() },
};

/** Figma's "Preview (Secondary)": a headline and seven closed items in a card. */
export const Secondary: Story = {
  args: { variant: 'Secondary' },
};

/** Not drawn in Figma: one item open (Secondary; switch `variant` to Primary to see it there). */
export const WithOpenItem: Story = {
  name: 'With open item',
  args: { children: items('Design') },
};

/** The Secondary list without its headline. */
export const WithoutTitle: Story = {
  name: 'Without title',
  args: { title: undefined },
};

/** Controlled: `expanded` and `onExpandedChange` keep one item open, and opening another closes it. */
export const OneAtATime: Story = {
  name: 'One at a time',
  render: function Render(args) {
    const [open, setOpen] = useState<string | undefined>('Find');
    return (
      <AccordionList {...args}>
        {names.map((name) => (
          <Accordion
            key={name}
            title={name}
            bodyText={bodyText}
            quote={quote}
            expanded={open === name}
            onExpandedChange={(next) => setOpen(next ? name : undefined)}
          />
        ))}
      </AccordionList>
    );
  },
};
