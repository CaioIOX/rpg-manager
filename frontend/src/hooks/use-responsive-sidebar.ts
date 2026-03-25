"use client";

import { useCallback, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

export default function useResponsiveSidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((current) => !current),
    [],
  );

  return {
    isMobile,
    isTablet,
    isSidebarOpen: isMobile ? isSidebarOpen : false,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}
