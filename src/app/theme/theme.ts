import type { ThemeOptions } from "@mui/material/styles";
import type { ColorMode } from "./colorModeContext";

export const getDesignTokens = (mode: ColorMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: { default: "#F7F8FA", paper: "#FFFFFF" },
        }
      : {
          background: { default: "#0B1220", paper: "#0F172A" },
        }),
  },

  shape: { borderRadius: 14 },

  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: mode === "light" ? "1px solid rgba(15, 23, 42, 0.08)" : "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderBottom: mode === "light"
            ? "1px solid rgba(15, 23, 42, 0.08)"
            : "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
});
