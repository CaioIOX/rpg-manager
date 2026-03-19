"use client";

import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useGetCampaign from "@/lib/hooks/useGetCampaign";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useSearchQuery from "@/lib/hooks/useSearchQuery";
import useTemplates from "@/lib/hooks/useTemplates";
import useFolders from "@/lib/hooks/useFolders";
import useDocuments from "@/lib/hooks/useDocuments";
import { useState } from "react";

export default function SideBar() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const campaign = useGetCampaign(campaignId);
  const templates = useTemplates(campaignId);
  const documents = useDocuments(campaignId);
  const folders = useFolders(campaignId);

  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useSearchQuery(campaignId, searchQuery);

  return (
    <Box
      sx={{
        width: "300px",
        minWidth: "300px",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "rgba(212, 175, 55, 0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "rgba(212, 175, 55, 0.08)",
          background:
            "linear-gradient(180deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            onClick={() => router.push(`/campaigns`)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              px: 0.5,
              py: 0.5,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.04)",
                "& .back-arrow": {
                  transform: "translateX(-2px)",
                },
              },
            }}
          >
            <IconButton
              aria-label="Voltar"
              size="small"
              className="back-arrow"
              sx={{
                color: "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "transparent" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Merriweather", "Georgia", serif',
                color: "primary.main",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "160px",
              }}
            >
              {campaign.data?.name}
            </Typography>
          </Box>
          <Tooltip title="Adicionar Membro" arrow>
            <IconButton
              aria-label="Membros"
              size="small"
              onClick={() => console.log("members modal open")}
              sx={{
                color: "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "rgba(212, 175, 55, 0.08)",
                },
              }}
            >
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          placeholder="Buscar documentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(13, 17, 23, 0.5)",
              fontSize: "0.85rem",
              borderRadius: "12px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.06)",
              },
            },
          }}
        />
      </Box>

      {/* Action buttons */}
      <Stack
        direction={"row"}
        spacing={0.5}
        sx={{
          p: 1.5,
          borderBottom: "1px solid",
          borderColor: "rgba(212, 175, 55, 0.06)",
        }}
      >
        {[
          {
            icon: <AddIcon sx={{ fontSize: "1rem" }} />,
            label: "Doc",
            onClick: () => console.log("docmodal open"),
          },
          {
            icon: <FolderIcon sx={{ fontSize: "1rem" }} />,
            label: "Pasta",
            onClick: () => console.log("modalOpen"),
          },
          {
            icon: <SettingsIcon sx={{ fontSize: "1rem" }} />,
            label: "Template",
            onClick: () => console.log("templateModal.onOpen"),
          },
        ].map((action) => (
          <Button
            key={action.label}
            size="small"
            variant="text"
            color="inherit"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{
              flex: 1,
              fontSize: "0.72rem",
              color: "text.secondary",
              borderRadius: "10px",
              py: 0.8,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(212, 175, 55, 0.06)",
                color: "primary.main",
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Stack>

      {/* File list */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
        {searchQuery.length >= 2 && searchResults.data ? (
          <Stack direction={"column"} spacing={0.5}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                px: 1,
                pb: 0.5,
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
              }}
            >
              Resultados da busca
            </Typography>
            {searchResults.data.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  py: 4,
                  display: "block",
                  fontSize: "0.85rem",
                }}
              >
                Nenhum resultado encontrado
              </Typography>
            ) : (
              searchResults.data.map((doc, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "rgba(212, 175, 55, 0.06)",
                    },
                  }}
                >
                  <DescriptionOutlinedIcon
                    sx={{ fontSize: "1rem", color: "text.secondary" }}
                  />
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    teste
                  </Typography>
                </Box>
              ))
            )}
          </Stack>
        ) : (
          <Stack direction={"column"} spacing={0}>
            {(templates.data?.length ?? 0) > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    px: 1,
                    pb: 1,
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Templates
                </Typography>
                {templates.data?.map((template) => (
                  <Box
                    key={template.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 1.5,
                      py: 0.8,
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      color: "text.secondary",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "rgba(142, 36, 170, 0.06)",
                        color: "text.primary",
                      },
                    }}
                  >
                    <Box sx={{ fontSize: "0.9rem", lineHeight: 1 }}>
                      {template.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                    >
                      {template.name}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ mt: 1.5 }} />
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                px: 1,
                pb: 1,
                display: "block",
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
              }}
            >
              Arquivos
            </Typography>
            {documents.data?.map((doc) => (
              <Box
                key={doc.id}
                onClick={() =>
                  router.push(`/campaigns/${campaignId}/docs/${doc.id}`)
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 0.8,
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "rgba(212, 175, 55, 0.06)",
                  },
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: "1rem", color: "text.secondary" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.primary",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc.title}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
