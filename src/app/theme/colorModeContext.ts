import * as React from "react";

export type ColorMode = "light" | "dark";

export const ColorModeContext = React.createContext({
  mode: "light" as ColorMode,
  toggleColorMode: () => {},
  setMode: (_mode: ColorMode) => {},
});
