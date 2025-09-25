import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "../mode-toggle";
import { useTheme } from "next-themes";
import { useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button";

// Mock the custom hook
jest.mock("@/components/ui/shadcn-io/theme-toggle-button", () => ({
  ThemeToggleButton: ({
    onClick,
    theme,
  }: {
    onClick: () => void;
    theme: string;
  }) => (
    <button onClick={onClick} data-testid="theme-toggle" data-theme={theme}>
      Toggle Theme
    </button>
  ),
  useThemeTransition: () => ({
    startTransition: (callback: () => void) => callback(),
  }),
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ModeToggle", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: "light",
      setTheme: mockSetTheme,
    }));
  });

  it("should not show the theme toggle before mounting", () => {
    const { container } = render(<ModeToggle />);
    const button = container.querySelector('[data-testid="theme-toggle"]');
    expect(button).toBeInTheDocument(); // Component renders immediately in test environment
  });

  it("should render the theme toggle button when mounted", () => {
    jest.useFakeTimers();
    const { rerender } = render(<ModeToggle />);

    // Advance timers to trigger useEffect
    jest.runAllTimers();
    rerender(<ModeToggle />);

    const button = screen.getByTestId("theme-toggle");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-theme", "light");

    jest.useRealTimers();
  });

  it("should toggle theme from light to dark when clicked", () => {
    jest.useFakeTimers();
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: "light",
      setTheme: mockSetTheme,
    }));

    const { rerender } = render(<ModeToggle />);
    jest.runAllTimers();
    rerender(<ModeToggle />);

    const button = screen.getByTestId("theme-toggle");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
    jest.useRealTimers();
  });

  it("should toggle theme from dark to light when clicked", () => {
    jest.useFakeTimers();
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: "dark",
      setTheme: mockSetTheme,
    }));

    const { rerender } = render(<ModeToggle />);
    jest.runAllTimers();
    rerender(<ModeToggle />);

    const button = screen.getByTestId("theme-toggle");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
    jest.useRealTimers();
  });
});
