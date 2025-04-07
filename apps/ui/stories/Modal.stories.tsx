import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import Modal from "../src/components/Modal";

const meta: Meta<typeof Modal> = {
  title: "Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls whether the modal is open or closed",
    },
    onClose: {
      action: "closed",
      description: "Function called when the modal should close",
    },
    title: {
      control: "text",
      description: "Optional title to display at the top of the modal",
    },
    showCloseButton: {
      control: "boolean",
      description: "Controls whether to show the close button in the header",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalDemo = ({
  initialState = false,
  title,
  showCloseButton,
  children,
  className,
}: {
  title?: string;
  initialState?: boolean;
  showCloseButton?: boolean;
  children: JSX.Element | JSX.Element[];
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(initialState);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        showCloseButton={showCloseButton}
        className={className}
      >
        {children}
      </Modal>
    </div>
  );
};

// Basic Modal
export const Basic: Story = {
  render: () => (
    <ModalDemo title="Basic Modal">
      <p>This is a basic modal with default settings.</p>
      <p className="mt-4">Click outside or press ESC to close.</p>
    </ModalDemo>
  ),
};

// Modal without title
export const WithoutTitle: Story = {
  render: () => (
    <ModalDemo>
      <p>This modal has no title, only a close button in the header.</p>
      <p className="mt-4">
        The header is still visible because showCloseButton defaults to true.
      </p>
    </ModalDemo>
  ),
};

// Modal without close button
export const WithoutCloseButton: Story = {
  render: () => (
    <ModalDemo title="No Close Button" showCloseButton={false}>
      <p>This modal has no close button, but still has a title.</p>
      <p className="mt-4">
        You can still close it by clicking outside or pressing ESC.
      </p>
    </ModalDemo>
  ),
};

// Modal with custom content
export const WithFormContent: Story = {
  render: () => (
    <ModalDemo title="Sign Up">
      <form>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="button"
          >
            Sign Up
          </button>
        </div>
      </form>
    </ModalDemo>
  ),
};

// Modal with long content
export const WithLongContent: Story = {
  render: () => (
    <ModalDemo title="Terms and Conditions">
      <div className="prose">
        <h3>1. Introduction</h3>
        <p>
          Welcome to our service. By using our platform, you agree to these
          terms and conditions. Please read them carefully.
        </p>

        <h3>2. User Accounts</h3>
        <p>
          When you create an account with us, you must provide information that
          is accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the Terms, which may result in immediate
          termination of your account on our service.
        </p>

        <h3>3. Intellectual Property</h3>
        <p>
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of our company and its
          licensors. The Service is protected by copyright, trademark, and other
          laws of both the United States and foreign countries.
        </p>

        <h3>4. Links To Other Web Sites</h3>
        <p>
          Our Service may contain links to third-party web sites or services
          that are not owned or controlled by our company. Our company has no
          control over, and assumes no responsibility for, the content, privacy
          policies, or practices of any third party web sites or services.
        </p>

        <h3>5. Termination</h3>
        <p>
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason whatsoever, including without
          limitation if you breach the Terms. Upon termination, your right to
          use the Service will immediately cease.
        </p>

        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="button"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </ModalDemo>
  ),
};

// Modal with custom styling
export const CustomStyling: Story = {
  render: () => (
    <ModalDemo
      title="Custom Styled Modal"
      className="bg-gray-800 text-white border border-gray-700"
    >
      <p>This modal has custom styling applied through the className prop.</p>
      <p className="mt-4">
        You can customize the appearance to match your application's theme.
      </p>

      <div className="mt-6 flex space-x-2 justify-end">
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
          Cancel
        </button>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Confirm
        </button>
      </div>
    </ModalDemo>
  ),
};
