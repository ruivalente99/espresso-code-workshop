/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const queryProvider = new QueryClient();
function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }
  return (
    <QueryClientProvider client={queryProvider}>
      <HydrationBoundary>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

export default Providers;
