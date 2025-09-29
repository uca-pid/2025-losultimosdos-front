"use client";
import { useTheme } from "next-themes";
import { ThemeToggleButton } from "@/components/ui/shadcn-io/theme-toggle-button";
import { useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button";
import { useState, useEffect, useCallback } from "react";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleThemeToggle = useCallback(() => {
    const newMode: "dark" | "light" = theme === "dark" ? "light" : "dark";

    startTransition(() => {
      setTheme(newMode);
    });
  }, [setTheme, startTransition]);
  if (!mounted) {
    return null;
  }
  return (
    <ThemeToggleButton
      theme={theme as "dark" | "light"}
      onClick={handleThemeToggle}
      variant="circle-blur"
      start="top-right"
    />
  );
};

export { ModeToggle };
