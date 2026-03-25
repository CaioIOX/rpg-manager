"use client";

import useResponsiveSidebar from "@/hooks/use-responsive-sidebar";
import { Box, Drawer } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import CampaignMobileHeader from "./CampaignMobileHeader";
import SideBar from "./SideBar";

const MOBILE_SIDEBAR_WIDTH = "min(86vw, 320px)";
const DESKTOP_SIDEBAR_WIDTH = 320;

export default function CampaignLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isMobile, isSidebarOpen, openSidebar, closeSidebar } =
    useResponsiveSidebar();

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [pathname, isMobile, closeSidebar]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: DESKTOP_SIDEBAR_WIDTH,
          minWidth: DESKTOP_SIDEBAR_WIDTH,
          borderRight: "1px solid rgba(212, 175, 55, 0.08)",
          bgcolor: "background.paper",
        }}
      >
        <SideBar />
      </Box>

      <Drawer
        open={isSidebarOpen}
        onClose={closeSidebar}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: MOBILE_SIDEBAR_WIDTH,
              maxWidth: MOBILE_SIDEBAR_WIDTH,
              bgcolor: "background.paper",
              backgroundImage: "none",
            },
          },
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          },
        }}
      >
        <SideBar isMobile onNavigate={closeSidebar} />
      </Drawer>

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CampaignMobileHeader onOpenSidebar={openSidebar} />
        <Box
          component="main"
          sx={{
            minWidth: 0,
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
