"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {resolvedTheme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 animate-rotate dark:scale-0 dark:-rotate-90" />
      ) : (
        <Moon className=" h-[1.2rem] w-[1.2rem] scale-0 rotate-90 animate-rotate dark:scale-100 dark:rotate-0" />
      )}
    </Button>
  );
}
