// "use client";
// import { Moon, Sun } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";

// export function ModeToggle() {
//   const { theme, setTheme } = useTheme();

//   return (
//     <Button
//       variant="outline"
//       size="icon"
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className=""
//     >
//       {theme === "light" ? (
//         <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//       ) : (
//         <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-foreground" />
//       )}
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }
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
