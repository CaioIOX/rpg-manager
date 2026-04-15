"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldIcon from "@mui/icons-material/Shield";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useLogout from "@/lib/hooks/useLogout";
import { useRouter } from "next/navigation";
import LanguageSwitch from "@/components/layout/LanguageSwitch";

export default function Navbar() {
  const loggedUser = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    logout.mutate();
    router.push("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(22, 27, 34, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid",
        borderImage:
          "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent) 1",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 72 },
          px: { xs: 1.5, sm: 2, md: 3 },
          gap: 1,
        }}
      >
        {/* Brand */}
        <Box
          onClick={() => router.push("/campaigns")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
            flexGrow: 1,
            minWidth: 0,
            cursor: "pointer",
            "&:hover .brand-icon": {
              transform: "rotate(12deg) scale(1.1)",
            },
          }}
        >
          <ShieldIcon
            className="brand-icon"
            sx={{
              color: "primary.main",
              fontSize: { xs: "1.4rem", sm: "1.75rem" },
              transition: "transform 0.3s ease",
              filter: "drop-shadow(0 0 6px rgba(212, 175, 55, 0.3))",
            }}
          />
          <Typography
            variant="h6"
            component={"div"}
            sx={{
              fontFamily: '"Merriweather", "Georgia", serif',
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.01em",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              whiteSpace: "nowrap",
            }}
          >
            CodexLore
          </Typography>
        </Box>

        {/* User section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1.5 },
            minWidth: 0,
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <LanguageSwitch />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 1, sm: 1.5 },
              py: 0.5,
              borderRadius: "20px",
              bgcolor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.06)",
              },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 28, sm: 30 },
                height: { xs: 28, sm: 30 },
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #8E24AA 0%, #BA68C8 100%)",
                boxShadow: "0 2px 8px rgba(142, 36, 170, 0.3)",
              }}
            >
              {loggedUser.data?.username?.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                display: { xs: "none", sm: "block" },
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {loggedUser.data?.username || "Carregando..."}
            </Typography>
          </Box>

          <Tooltip title="Sair" arrow>
            <IconButton
              aria-label="Sair"
              onClick={handleLogout}
              size="small"
              sx={{
                color: "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "error.main",
                  bgcolor: "rgba(248, 81, 73, 0.1)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
