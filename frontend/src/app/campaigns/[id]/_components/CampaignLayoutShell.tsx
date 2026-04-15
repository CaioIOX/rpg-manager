"use client";

import useResponsiveSidebar from "@/hooks/use-responsive-sidebar";
import { Box, Drawer } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CampaignMobileHeader from "./CampaignMobileHeader";
import LorenaDrawer from "./LoreKeeper/LorenaDrawer";
import SideBar from "./SideBar";
import SidebarToggleButton from "./SidebarToggleButton";

const MOBILE_SIDEBAR_WIDTH = "min(86vw, 320px)";
const DESKTOP_SIDEBAR_WIDTH = 320;

export default function CampaignLayoutShell({
  children,
  campaignID,
}: {
  children: React.ReactNode;
  campaignID: string;
}) {
  const pathname = usePathname();
  const { isMobile, isSidebarOpen, openSidebar, closeSidebar } =
    useResponsiveSidebar();

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [pathname, isMobile, closeSidebar]);

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        bgcolor: "background.default",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          width: isDesktopSidebarOpen ? DESKTOP_SIDEBAR_WIDTH : 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRight: isDesktopSidebarOpen ? "1px solid rgba(212, 175, 55, 0.08)" : "none",
          bgcolor: "background.paper",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: DESKTOP_SIDEBAR_WIDTH, height: "100%", overflow: "hidden" }}>
          <SideBar />
        </Box>
      </Box>

      <SidebarToggleButton
        isOpen={isDesktopSidebarOpen}
        onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        desktopWidth={DESKTOP_SIDEBAR_WIDTH}
      />

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
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              bgcolor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          {children}
        </Box>
      </Box>
      {/* Lorena — Chatbot de IA disponível em todas as telas da campanha */}
      <LorenaDrawer campaignID={campaignID} />
    </Box>
  );
}
