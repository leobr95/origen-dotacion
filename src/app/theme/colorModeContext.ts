// src/app/theme/colorModeContext.ts
import * as React from "react";

export type ColorMode = "light" | "dark";

export type ColorModeContextValue = {
  mode: ColorMode;
  toggleColorMode: () => void;
  setMode: React.Dispatch<React.SetStateAction<ColorMode>>;
};

export const ColorModeContext = React.createContext<ColorModeContextValue>({
  mode: "light",
  toggleColorMode: () => undefined,
  setMode: () => undefined,
});
