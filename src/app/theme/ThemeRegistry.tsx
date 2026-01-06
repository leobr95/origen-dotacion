"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import { ColorModeContext, type ColorMode } from "./colorModeContext";
import { getDesignTokens } from "./theme";

function createEmotionCache() {
  return createCache({ key: "mui", prepend: true });
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createEmotionCache();
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args: any[]) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) styles += cache.inserted[name];

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  // lee el modo inicial del <html data-theme="..."> (lo seteamos en layout con Script)
  const initialMode = (typeof document !== "undefined" &&
    (document.documentElement.dataset.theme as ColorMode)) || "light";

  const [mode, setMode] = React.useState<ColorMode>(initialMode);

  React.useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    localStorage.setItem("theme", mode);
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      mode,
      setMode,
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <CacheProvider value={cache}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
