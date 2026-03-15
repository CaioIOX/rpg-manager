"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useLogout from "@/lib/hooks/useLogout";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const loggedUser = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout");
    logout.mutate();
    router.push("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "rgba(212, 175, 55, 0.2)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component={"div"}
          sx={{
            flexGrow: 1,
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          RPG Manager
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 32,
                height: 32,
                fontSize: "1rem",
              }}
            >
              {loggedUser.data?.username?.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Typography variant="body1" color="text.primary">
              {loggedUser.data?.username || "Carregando..."}
            </Typography>
          </Box>

          <IconButton
            aria-label="Sair"
            onClick={handleLogout}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "error.main" },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
