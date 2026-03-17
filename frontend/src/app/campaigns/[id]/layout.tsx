import { Box } from "@mui/material";
import SideBar from "./_components/SideBar";

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <SideBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
