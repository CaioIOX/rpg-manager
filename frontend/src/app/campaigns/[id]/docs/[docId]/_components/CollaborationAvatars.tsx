"use client";

import { Avatar, AvatarGroup, Box, Tooltip, Typography } from "@mui/material";
import { WebsocketProvider } from "y-websocket";

interface ConnectedUser {
  name: string;
  color: string;
  clientId: number;
}

interface CollaborationAvatarsProps {
  connectedUsers: ConnectedUser[];
  providerRef: React.MutableRefObject<WebsocketProvider | null>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CollaborationAvatars({
  connectedUsers,
}: CollaborationAvatarsProps) {
  if (connectedUsers.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        ml: "auto",
        pl: 1,
      }}
    >
      {connectedUsers.length > 1 && (
        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            fontSize: "0.65rem",
            whiteSpace: "nowrap",
          }}
        >
          {connectedUsers.length} online
        </Typography>
      )}
      <AvatarGroup
        max={4}
        sx={{
          "& .MuiAvatar-root": {
            width: 24,
            height: 24,
            fontSize: "0.6rem",
            fontWeight: 700,
            border: "1.5px solid rgba(13, 17, 23, 0.8)",
          },
          "& .MuiAvatarGroup-avatar": {
            width: 24,
            height: 24,
            fontSize: "0.6rem",
            bgcolor: "rgba(139, 148, 158, 0.3)",
          },
        }}
      >
        {connectedUsers.map((user) => (
          <Tooltip
            key={user.clientId}
            title={
              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                {user.name}
              </Typography>
            }
            arrow
            placement="bottom"
          >
            <Avatar
              sx={{
                bgcolor: user.color + "33",
                color: user.color,
                border: `1.5px solid ${user.color}66 !important`,
                cursor: "default",
                fontSize: "0.6rem",
                fontWeight: 700,
                width: 24,
                height: 24,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    </Box>
  );
}
