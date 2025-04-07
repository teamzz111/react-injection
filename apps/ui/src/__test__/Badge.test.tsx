import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Badge from "../components/Badge";

describe("Badge Component", () => {
  // Test rendering default variant
  test("renders with default variant", () => {
    render(<Badge>Test Badge</Badge>);

    const badge = screen.getByText("Test Badge");
    expect(badge).toBeInTheDocument();
    expect(badge.classList.contains("bg-gray-100")).toBe(true);
    expect(badge.classList.contains("text-gray-800")).toBe(true);
  });

  // Test each variant
  test.each([
    ["default", "bg-gray-100", "text-gray-800"],
    ["primary", "bg-blue-100", "text-blue-800"],
    ["secondary", "bg-purple-100", "text-purple-800"],
    ["success", "bg-green-100", "text-green-800"],
    ["warning", "bg-yellow-100", "text-yellow-800"],
    ["destructive", "bg-red-100", "text-red-800"],
    ["outline", "bg-transparent", "border-gray-200"],
  ])(
    "renders %s variant with correct classes",
    (variant, bgClass, textClass) => {
      render(<Badge variant={variant as any}>Test Badge</Badge>);

      const badge = screen.getByText("Test Badge");
      expect(badge).toBeInTheDocument();
      expect(badge.classList.contains(bgClass)).toBe(true);
      expect(badge.classList.contains(textClass)).toBe(true);
    }
  );

  // Test custom class name
  test("applies custom className correctly", () => {
    render(<Badge className="custom-class">Test Badge</Badge>);

    const badge = screen.getByText("Test Badge");
    expect(badge.classList.contains("custom-class")).toBe(true);
  });

  // Test children rendering
  test("renders children correctly", () => {
    render(
      <Badge>
        <span data-testid="child-element">Child Content</span>
      </Badge>
    );

    const childElement = screen.getByTestId("child-element");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Child Content");
  });

  // Test HTML attributes passing
  test("passes HTML attributes to the div element", () => {
    render(
      <Badge data-testid="badge-element" id="test-id" aria-label="badge label">
        Test Badge
      </Badge>
    );

    const badge = screen.getByTestId("badge-element");
    expect(badge).toHaveAttribute("id", "test-id");
    expect(badge).toHaveAttribute("aria-label", "badge label");
  });

  // Test with complex content
  test("renders with icon and text", () => {
    render(
      <Badge variant="primary">
        <svg data-testid="test-icon" />
        Badge with Icon
      </Badge>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Badge with Icon")).toBeInTheDocument();
  });
});
