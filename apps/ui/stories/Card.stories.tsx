import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../src/components/Card";

const meta: Meta<typeof Card> = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

// Simple Card
export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

// Card with long content
export const WithLongContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Project Report</CardTitle>
        <CardDescription>
          Annual overview of project performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This detailed report provides an in-depth analysis of our project
          metrics over the past year. Key performance indicators show
          significant improvement in several areas, with particular growth in
          user engagement and retention. The implementation of new features in
          Q3 resulted in a 24% increase in daily active users.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button className="text-sm text-blue-600">Download PDF</button>
        <button className="text-sm text-blue-600">Share</button>
      </CardFooter>
    </Card>
  ),
};

// Card with image
export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-[200px] bg-gray-200 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
      <CardHeader>
        <CardTitle>Image Card</CardTitle>
        <CardDescription>Card with an image placeholder</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card demonstrates using an image at the top of the card.
        </p>
      </CardContent>
    </Card>
  ),
};

// Interactive Card with Buttons
export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Newsletter Subscription</CardTitle>
        <CardDescription>Stay updated with our latest news</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input id="terms" type="checkbox" className="h-4 w-4 rounded" />
            <label htmlFor="terms" className="text-xs">
              I agree to the terms and conditions
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white">
          Subscribe
        </button>
      </CardFooter>
    </Card>
  ),
};

// Card with Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <Card className="w-[350px] border-blue-500 bg-blue-50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-blue-700">Custom Styled Card</CardTitle>
        <CardDescription className="text-blue-500">
          Card with custom background and border
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-blue-700">
          This card demonstrates custom styling options, including colors and
          spacing.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-blue-500">Last updated: Today</p>
      </CardFooter>
    </Card>
  ),
};

// Multiple Cards Layout
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
        </CardHeader>
        <CardContent>Content for card 1</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
        </CardHeader>
        <CardContent>Content for card 2</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Full Width Card</CardTitle>
        </CardHeader>
        <CardContent>This card spans the full width</CardContent>
      </Card>
    </div>
  ),
};
