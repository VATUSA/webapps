"use client";

import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const handle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      id="darkToggle"
      className="text-sm hover:text-red-400 transition cursor-pointer"
      onClick={handle}
    >
      🌙
    </button>
  );
}
