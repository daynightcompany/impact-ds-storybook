import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BannerText } from './BannerText';

const meta = {
  title: 'Impact DS/Banner text',
  component: BannerText,
  tags: ['autodocs'],
  args: { onButtonClick: fn() },
  argTypes: {
    introText: { control: 'text' },
    button: { control: 'text' },
    children: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 924 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Text/BannerTextContainer" component (node 9587:7434) in the SMAL Impact Design System file. Source of truth for variants: Figma. An intro line over a large headline, with a Primary XL button at the end of the row; "Intro text" and "Button" are the `introText` and `button` props. The row wraps: the button drops under the text when the text would get narrower than 272. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof BannerText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: intro text and button on. */
export const Default: Story = {};

export const WithoutButton: Story = {
  name: 'Without button',
  args: { button: false },
};

export const WithoutIntroText: Story = {
  name: 'Without intro text',
  args: { introText: false },
};

export const HeadlineOnly: Story = {
  name: 'Headline only',
  args: { introText: false, button: false },
};

/** At 375 wide the button is under the text. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 375, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

/** Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 48 }}>
      <BannerText />
      <BannerText button={false} />
      <BannerText introText={false} />
      <BannerText introText={false} button={false} />
    </div>
  ),
};
